const express = require('express');
const teilnehmerController = express();
const Teilnehmer = require('../models/Teilnehmer');
const Veranstaltungen = require('../models/Veranstaltung');
const {validateEmail} = require("./validation");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const Moment = require('moment');
const MomentRange = require('moment-range');
const Veranstalter = require("../models/Veranstalter");
const nodemailer = require("nodemailer");
const {validatePassword} = require("./validation");
const moment = MomentRange.extendMoment(Moment);
let  transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "f91515824063a2",
        pass: "e0703dbc730281"
    }
});

var tokens = [];

//list all
teilnehmerController.get('/teilnehmer/show', function(req, res){
    Teilnehmer.find()
        .catch(err=>{
            console.log(err.toString()); res.status(500).send(err.toString());
        })
        .then(dbres=>{
            console.log(dbres);
            res.send(dbres);
        });
});

//Show one Teilnehmer
teilnehmerController.get('/teilnehmer/showOne/:id', function (req, res) {
    Teilnehmer.findOne({_id: req.params.id})
        .catch(err => {
            console.log(err.toString());
            res.status(500).send(err.toString());
        })
        .then(dbres => {
            res.send(dbres);
        });
});

//Registration Teilnehmer
teilnehmerController.post('/teilnehmer/registration/add', function (req, res) {
    const { name, vorname, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !vorname || !email || !password || !password2) {
        errors.push({message: 'Fülle bitte alle Felder aus.'});
    }
    if(email === undefined){}
    else{
        if (validateEmail(email) !== true) {
            errors.push({message: 'Gültige Email eingeben.'})
        }
    }
    if (password === undefined){}
    else {
        if (validatePassword(password)!== true) {
            errors.push({message: 'Passwort muss mindestens 5 Zeichen lang sein, einen Großbuchstaben und eine Zahl enthalten.'})
        }
        else if (password !== password2) {
            errors.push({message: 'Die Passwörter stimmen nicht überein.'});
        }
    }

    Veranstalter.find({email: email}, function (err, veranstalter) {
        console.log(errors)
        let emailExists = veranstalter.length > 0;
        if (emailExists === true) {
            errors.push({message: 'Die Email ist bereits als Veranstalter registriert. Ein Teilnehmer kann kein Veranstalter sein!'});
        }

        })



    Teilnehmer.find({email: email}, function (err, teilnehmer) {
            console.log(errors)
            let emailExists = teilnehmer.length > 0;
            if (emailExists === true) {
                errors.push({message: 'Die Email ist bereits vergeben.'});
            }
            if (errors.length > 0) {
                res.status(400).json({
                    errors,
                    name,
                    vorname,
                    email,
                    password,
                    password2
                });
            } else {
                const newTeilnehmer = new Teilnehmer({
                    name,
                    vorname,
                    email,
                    password
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newTeilnehmer.password, salt, (err, hash) => {
                        if (err) throw err;
                        newTeilnehmer.password = hash;
                        newTeilnehmer
                            .save((err, doc) => {
                                const token = jwt.sign(
                                    {
                                        email: newTeilnehmer.email,
                                        userID: newTeilnehmer._id
                                    }, 'B6B5834672A21DC0C5B40800BDCE9945586DD5A8E33CF29701F0A323DE371601',
                                    {expiresIn: "1h"})
                                if (!err) {
                                    res.status(200).json({
                                        token: token,
                                        expiresIn: 3600,
                                        userID: newTeilnehmer._id,
                                        message: 'Du hast dich erfolgreich registriert.'
                                    });
                                    tokens.push(token);
                                    console.log(tokens);
                                } else {
                                    console.log(err.toString());
                                    res.status(500).send(err.toString());
                                }
                            })
                        console.log(newTeilnehmer);
                    });
                });
            }

        })
});

// login teilnehmer
teilnehmerController.post('/teilnehmer/login', (req, res) =>{
    let fetchedUser;
    Teilnehmer.findOne({email:req.body.email}).then(function(teilnehmer){
        if(!teilnehmer){
            return res.status(401).json({message: 'Login fehlgeschlagen! Userdaten konnten nicht gefunden werden'});
        }
        fetchedUser=teilnehmer;
        return bcrypt.compare(req.body.password, teilnehmer.password);
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

//delete Teilnehmer
let currentDate = moment();
let resignPossible = true; // Abmeldung von Veranstaltung ist möglich
teilnehmerController.delete('/teilnehmer/delete/:id', function (req, res) {

    Teilnehmer.findOneAndRemove({_id: req.params.id},function(err, id){
        if (err || resignPossible === false) {
            res.status(401).json({message: 'User konnte nicht gelöscht werden'});
        }
        else {
            Veranstaltungen.findOneAndUpdate({teilnehmer: req.params.id},
                {$pull: {teilnehmer: req.params.id}}).exec();

            res.status(200).json({message: 'User ' + id.email + ' wurde gelöscht'});
            Veranstaltungen.findOneAndUpdate({teilnehmer: req.params.id},
                    {$pull: {teilnehmer: req.params.id}}).exec();

        }});
})



//Update Teilnehmer
teilnehmerController.put('/teilnehmer/edit/:id',function (req, res) {

    if (req.body.password !== undefined) {
        let password = req.body.password;
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) throw err;
                req.body.password = hash;
                console.log(password)

                Teilnehmer.findByIdAndUpdate(
                    {_id: req.params.id},
                    {
                        $set: req.body
                    },
                    function (err, teilnehmer) {
                        if (err) {
                            res.status(401).json({message: 'Es hat nicht geklappt!'});
                        } else if (req.body.password !== undefined) {

                            let tMail = teilnehmer.email
                            transport.sendMail({
                                from: 'management@vms.de',
                                to: tMail,
                                subject: 'Änderungen an Ihrem Profil',
                                text: 'Sehr geehrter Teilnehmer, ' +
                                    '\n\nihr Passwort wurde geändert. Das neue Passwort lautet:' + req.body.password2 +
                                    '\n\nHiermit können Sie sich nun im System anmelden.' +
                                    '\n\nMit freundlichen Grüßen' +
                                    '\nDas VMS'
                            })
                            res.status(200).json({message: 'User ' + teilnehmer.email + ' wurde erfolgreich geändert'});
                        }
                    })
            })
        })
    }
    else {Teilnehmer.findByIdAndUpdate(
        {_id: req.params.id},
        {
            $set: req.body
        },
        function (err, teilnehmer) {
            if (err) {
                res.status(401).json({message: 'Es hat nicht geklappt!'});
            } else {

                res.status(200).json({message: 'User ' + teilnehmer.email + ' wurde erfolgreich geändert'});

            }
        }
    )}
});

//logout
teilnehmerController.delete('/teilnehmer/logout/:token', function (req, res) {
    tokens = tokens.filter(token => token !== req.params.token)
    res.status(200).json({message: 'Du bist erfolgreich abgemeldet'});
    console.log(tokens);
});

// teilnehmen
let events;
let result = true;
teilnehmerController.put('/teilnehmer/participate/:id/:veranstaltung', function(req,res) {
    console.log('...')
    console.log(req.params.veranstaltung)
    Veranstaltungen.findById({_id: req.params.veranstaltung}, 'teilnehmerzahl teilnehmer', function (err, event) {
        events = event;
        if (event.teilnehmerzahl === event.teilnehmer.length) { // checks if max number of participants is already reached
            res.status(500).json({message: 'Veranstaltung ist bereits ausgebucht!'}) //err if max Teilnehmeranzahl is reached
        } else {
            events.teilnehmer.some(e => { //if room on list --> check if user already registered for event
                    if (e == req.params.id) { //if user matches with entry in list --> break
                        result = false; //if matching entries are found --> set result to false
                        return true; //= break
                    }
                })

            if (result === true) { //if result is true, user is not yet signed in for event
                Veranstaltungen.findByIdAndUpdate({_id: req.params.veranstaltung}, //pushes userID into Veranstaltung
                    {$push: {teilnehmer: req.params.id}}).exec();
                res.status(200).json({message: 'Du bist erfolgreich angemeldet'})
            }
            else{ //if result is not true, user already exists in list
                res.status(400).json({message: 'Du bist bereits angemeldet!'})
                result = true; //reset result variable
            }
        }
    })
})

//abmelden
teilnehmerController.put('/teilnehmer/deregisterEvent/:id/:veranstaltung', function(req,res) {
    let currentDate = moment();
    let resignPossible = true; // Abmeldung von Veranstaltung ist möglich

    Veranstaltungen.findById({_id: req.params.veranstaltung}, function(err,event) { //checks if Rücktrittsfrist is over
        let newMomentObj = moment(event.start_datum)
        if (newMomentObj.diff(currentDate, 'days') < 1) {  //if you want to resign closer then 1 day before start of the event
            resignPossible = false;
            console.log(newMomentObj.diff(currentDate, 'days'))
        }
        if (resignPossible === false) {
            res.status(400).json('Die Rücktrittsfrist ist abgelaufen.');
        } else {
            Veranstaltungen.findByIdAndUpdate({_id: req.params.veranstaltung}, 'teilnehmerzahl teilnehmer', function (err, event) {
                Veranstaltungen.findByIdAndUpdate({_id: req.params.veranstaltung}, //pushes userID into Veranstaltung
                    {$pull: {teilnehmer: req.params.id}}).exec();
                 res.status(200).json({message: 'Du hast dich erfolgreich abgemeldet.'});
            })
        }
    })
})

module.exports = teilnehmerController;

