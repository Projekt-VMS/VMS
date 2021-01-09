const express = require('express');
const teilnehmerController = express();
const Teilnehmer = require('../models/Teilnehmer');
const Veranstaltungen = require('../models/Veranstaltung');
const {validateEmail} = require("./validation");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

var tokens = [];


//show all Teilnehmer
teilnehmerController.get('/teilnehmer/show', function(req, res){ Teilnehmer.find()
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
            console.log('aktiver User:'+ dbres);
            res.send(dbres);
        });
});

//Registration Teilnehmer
teilnehmerController.post('/teilnehmer/registration/add', function (req, res) {

    const { name, vorname, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !vorname || !email || !password || !password2) {
        errors.push({ message: 'Fülle bitte alle Felder aus.' });
    }
    if (validateEmail(email) !== true){
        errors.push({message: 'Gültige Email eingeben.'})
    }
    Teilnehmer.find({email: email}, function(err, teilnehmer){
        let emailExists = teilnehmer.length > 0;
        if (emailExists === true){
            errors.push({ message: 'Die Email ist bereits vergeben.'});
        }
    })
    if (password.length < 5){
        errors.push({message: 'Passwort muss mindestens 5 Zeichen lang sein.'})
    }
    if (password !== password2) {
        errors.push({ message: 'Die Passwörter stimmen nicht überein.' });
    }
    if (errors.length > 0) {
        console.log('fail');
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
                            {email: newTeilnehmer.email, userID: newTeilnehmer._id}, 'B6B5834672A21DC0C5B40800BDCE9945586DD5A8E33CF29701F0A323DE371601',
                            {expiresIn: "1h"})
                        if (!err){
                            res.status(200).json({
                                token: token,
                                expiresIn: 3600,
                                userID: newTeilnehmer._id,
                                message: 'Du hast dich erfolgreich registriert.'

                            });
                            tokens.push(token);
                            console.log(tokens);
                        }
                        else  {console.log(err.toString());
                            res.status(500).send(err.toString());
                        }
                    })

                console.log(newTeilnehmer);
            });
        });
    }
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
teilnehmerController.delete('/teilnehmer/delete/:id', function (req, res) {

    Teilnehmer.findOneAndRemove({_id: req.params.id},function(err){
        if (err) {
            res.status(401).json({message: 'User konnte nicht gelöscht werden'});
        }
        else {
            res.status(200).json({message:'User wurde erfolgreich gelöscht'});
        }
    });
});


//Update Teilnehmer
teilnehmerController.put('/teilnehmer/edit/:id',function (req, res) {

    Teilnehmer.findByIdAndUpdate(
        {_id: req.params.id},
        {$set: req.body
        },
        function (err, teilnehmer) {
            if (err || !teilnehmer){
                res.status(401).json({message: 'Es hat nicht geklappt!'});
            }
            else {
                res.status(200).json({message: 'Userdaten wurden erfolgreich überschrieben.'});
            }
        })
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
    let event02;
    let result02 = true;

    Veranstaltungen.findById({_id: req.params.veranstaltung}, function(err,event){ //checks if Rücktrittsfrist is over
        let newMomentObj = moment(event.start_datum)
        if (newMomentObj.diff(currentDate, 'days') < 1){  //if you want to resign closer then 1 day before start of the event
          resignPossible = false;
          console.log(newMomentObj.diff(currentDate, 'days'))
        }
        if (resignPossible === false){
            res.status(400).json({message: 'Die Rücktrittsfrist ist abgelaufen'});
        }
        else {Veranstaltungen.findById({_id: req.params.veranstaltung}, 'teilnehmerzahl teilnehmer', function (err, event) {
            event02 = event;
            console.log(result02)
            console.log(event02.teilnehmer)
            event02.teilnehmer.some(e => { //if room on list --> check if user already registered for event
                if (e === req.params.id) { //if user matches with entry in list --> break
                    result02 = false//if matching entries are found --> set result to false
                    return false;
                    //= break
                }

            })

            if (result02 === false) { //if result is true, user is not yet signed in for event
                Veranstaltungen.findByIdAndUpdate({_id: req.params.veranstaltung}, //pushes userID into Veranstaltung
                    {$pull: {teilnehmer: req.params.id}}).exec();
                res.status(200).json({message: 'Du hast dich erfolgreich abgemeldet.'})
            }
            else{ //if result is not true, user already exists in list
                res.status(500).json({message: 'Deine Abmeldung hat nicht geklappt.'})
                result = true; //reset result variable
            }
        })}
    })
})

module.exports = teilnehmerController;

