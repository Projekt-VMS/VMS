const express = require('express');
const veranstalterController = express();
const Veranstalter = require('../models/Veranstalter');
const Veranstaltung = require('../models/Veranstaltung');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
let  transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "f91515824063a2",
        pass: "e0703dbc730281"
    }
});
const Moment = require('moment');
const MomentRange = require('moment-range');
const Teilnehmer = require("../models/Teilnehmer");
const {validatePassword} = require("./validation");
const {validateEmail} = require("./validation");
const moment = MomentRange.extendMoment(Moment);

let tokens = [];

//show one
veranstalterController.get('/veranstalter/showOne/:id', function (req, res) {
    Veranstalter.findOne({_id: req.params.id})
        .catch(err => {
            console.log(err.toString());
            res.status(500).send(err.toString());
        })
        .then(dbres => {
            console.log('aktiver Veranstalter:'+ dbres);
            res.send(dbres);
        });
});

//Registration
veranstalterController.post('/veranstalter/registration/add', function (req, res) {
    const { name, vorname, unternehmen, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !vorname || !unternehmen|| !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }
    if (validateEmail(email) !== true){
        errors.push({message: 'Gültige Email eingeben.'})
    }
    if (validatePassword(password) !== true){
        errors.push({message: 'Passwort muss mindestens 5 Zeichen lang sein, einen Großbuchstaben und eine Zahl enthalten.'})
    }
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }
    Teilnehmer.find({email: email}, function (err, teilnehmer) {
        let emailExists = teilnehmer.length > 0;
        if (emailExists === true) {
            errors.push({message: 'Die Email ist bereits als Teilnehmer registriert. Ein Teilnehmer kann kein Veranstalter sein!'});
        }
    })
    Veranstalter.find({email: email}, function(err, veranstalter){
        let emailExists = veranstalter.length > 0;
        if (emailExists === true){
            errors.push({ message: 'Die Email ist bereits vergeben.'});
        }
        if (errors.length > 0) {
            res.status(400).json({
                errors,
                name,
                vorname,
                unternehmen,
                email,
                password,
                password2
            });
        } else {
            let newVeranstalter = new Veranstalter({
                name,
                vorname,
                unternehmen,
                email,
                password
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newVeranstalter.password, salt, (err, hash) => {
                    if (err) throw err;
                    newVeranstalter.password = hash;
                    newVeranstalter
                        .save((err, doc) => {
                            const token = jwt.sign(
                                {email: newVeranstalter.email, userID: newVeranstalter._id}, 'B6B5834672A21DC0C5B40800BDCE9945586DD5A8E33CF29701F0A323DE371601',
                                {expiresIn: "1h"})
                            if (!err){
                                res.status(200).json({
                                    token: token,
                                    expiresIn: 3600,
                                    userID: newVeranstalter._id,
                                    message: 'Du hast dich erfolgreich registriert.'
                                });
                                tokens.push(token);
                                console.log(tokens);
                            }
                            else  {console.log(err.toString());
                                res.status(500).send(err.toString()); }
                        })
                    console.log(newVeranstalter);
                });
            });
        }
    })
});

//login veranstalter
veranstalterController.post('/veranstalter/login', (req, res) =>{
    let fetchedUser;
    Veranstalter.findOne({email:req.body.email}).then(function(veranstalter){
        if(!veranstalter){
            return res.status(401).json({message: 'Login fehlgeschlagen! Userdaten konnten nicht gefunden werden'});
        }
        fetchedUser=veranstalter;
        return bcrypt.compare(req.body.password, veranstalter.password);
    }).then (result => {
        console.log(fetchedUser)
        if (!result) {
            return res.status(401).json({message: 'Login fehlgeschlagen! Passwort inkorrekt!'});
        }
        else {
            const token = jwt.sign(
                {email: fetchedUser.email, userID: fetchedUser._id}, 'B6B5834672A21DC0C5B40800BDCE9945586DD5A8E33CF29701F0A323DE371601',
                {expiresIn: "1h"}
            );
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userID: fetchedUser._id,
                message: 'Du bist erfolgreich angemeldet.'
            });
            tokens.push(token);
            console.log(tokens);
            console.log('logged in!')
        }
    })
        .catch(e=>{
            console.log(e)
        })
})

//delete
veranstalterController.delete('/veranstalter/delete/:id', function (req, res, next) {

    Veranstalter.findByIdAndRemove({_id: req.params.id},function(err, id){
        if (err) {
            res.status(401).json({message: 'User konnte nicht gelöscht werden'});
        }
        else {
            res.status(200).json({message: 'User ' + id.email + ' wurde gelöscht'});
        }
    });
});

//Update
veranstalterController.put('/veranstalter/edit/:id',function (req, res, next) {

    Veranstalter.findByIdAndUpdate(
        {_id: req.params.id},
        {$set: req.body
        },
        function (err, veranstalter) {
            if (err){
                res.status(401).json({message: 'Es hat nicht geklappt!'});
            }
            else {
                res.status(200).json({message: 'User ' + veranstalter.email + ' wurde erfolgreich überschrieben'});
            }
        })
});

//logout
veranstalterController.delete('/veranstalter/logout/:token', function (req, res) {
    tokens = tokens.filter(token => token !== req.params.token)
    res.status(200).json({message: 'Du bist erfolgreich abgemeldet'});
    console.log(tokens);
});

//anfragen
veranstalterController.post('/veranstalter/request/:id', function (req, res){

    const {titel, kapazitaet, start_datum, end_datum, verfuegbarkeit, zusatzleistungen} = req.body
    let errors = [];
    let anfrageInstance = req.body
    console.log (anfrageInstance)

    if (!titel || !kapazitaet || !start_datum|| !end_datum || !verfuegbarkeit) {
        errors.push({ message: 'Fülle bitte alle Felder aus.' });
    }
    if (errors.length > 0) {
        res.status(400).json({
            errors,
            titel,
            kapazitaet,
            start_datum,
            end_datum,
            verfuegbarkeit,

        });
    } else {
        Veranstalter.findById({_id: req.params.id}, function (err, veranstalter) {
            let veranstalterEmail = veranstalter.email;

            transport.sendMail({
                from: veranstalterEmail,
                to: 'management@vms.de',
                subject: `Anfrage von ${veranstalterEmail}`,
                text: 'Es wurde eine neue Anfrage im VMS erstellt: \n Titel: ' + anfrageInstance.titel + '\n Maximal benötigte Kapazität: ' + anfrageInstance.kapazitaet
                + '\n Zeitraum: ' + anfrageInstance.start_datum + ' bis '+ anfrageInstance.end_datum + '\n Sichtbarkeit' + anfrageInstance.angebotsstatus
                + '\n Zusatzleistungen: '+ anfrageInstance.zusatzleistungen
                + '\n Veranstalter: ' + veranstalterEmail
                + '\n \n Bitte erstellen Sie im System ein entsprechende Angebot!'


            })
            res.status(200).json({message: 'Anfrage wurde erfolgreich abgeschickt!'});
        })
    }
})

// Stornierung
let currentDate = moment();
let stornoPossible;
veranstalterController.delete('/veranstalter/storno/:id', function (req, res) {

    Veranstaltung.findById({_id: req.params.id}, function (err, event) {
        if(event !== null) {
            let newMomentObj = moment(event.start_datum)
            if (newMomentObj.diff(currentDate, 'days') < 3) {  //if you want to resign closer then 1 day before start of the event
                stornoPossible = false;
                console.log(newMomentObj.diff(currentDate, 'days'))
            }
        }
        else{
            res.status(400).json({message: 'Veranstaltung existiert nicht!'})
        }
        if (stornoPossible === false) {
            res.status(400).json({message: 'Die Stornofrist ist abgelaufen, ihre Veranstaltung kann nicht storniert werden!'})
        } else {
            Veranstaltung.findByIdAndRemove({_id: req.params.id}, function (err, event) {
                if (err) {
                    res.status(400).json({message: 'Veranstaltung konnte nicht storniert werden!'})
                } else {
                    res.status(200).json({message: 'Veranstaltung ' + event.titel + ' wurde storniert'})
                }
            })
        }
    })
})

module.exports = veranstalterController;
