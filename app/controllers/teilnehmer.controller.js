const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
const express = require('express');
const teilnehmerController = express();
const Teilnehmer = require('../models/Teilnehmer');
const Veranstaltungen = require('../models/Veranstaltung');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const authenticate = require('./authentication');
let tokens = [];


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
    console.log(req.body);

    const { name, vorname, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !vorname || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (errors.length > 0) {
        console.log('fail');
        res.send({
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
                                userID: newTeilnehmer._id
                            });
                            tokens.push(token);
                            console.log(tokens);
                        }
                        else  {console.log(err.toString());
                            res.status(500).send(err.toString()); }
                    })

                req.flash('success_msg', 'Du bist nun registriert')
                console.log(newTeilnehmer);
            });
        });
    }
});

// login teilnehmer

teilnehmerController.post('/teilnehmer/login', (req, res, next) =>{

    let fetchedUser;
    Teilnehmer.findOne({email:req.body.email}).then(function(teilnehmer){

        if(!teilnehmer){
            return res.status(401).json({message: 'Login Failed, no such User!'})
        }
        fetchedUser=teilnehmer;
        return bcrypt.compare(req.body.password, teilnehmer.password);
    }).then (result => {
        console.log(fetchedUser)
        if (!result) {
            return res.status(401).json({message: 'Login failed: wrong password!'})
        }
        else {
            const token = jwt.sign(
                {email: fetchedUser.email, userID: fetchedUser._id}, 'B6B5834672A21DC0C5B40800BDCE9945586DD5A8E33CF29701F0A323DE371601',
                {expiresIn: "1h"}
                );
        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userID: fetchedUser._id
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


/*teilnehmerController.post('/teilnehmer/login', function (req, res, next) {
        const dataJson = req.body.email;
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/error/login',
            failureFlash: true
        })(req, res, next);
        console.log(req.body.email);
});
*/

//delete Teilnehmer

teilnehmerController.delete('/teilnehmer/delete/:id', function (req, res, next) {

    Teilnehmer.findOneAndRemove({_id: req.params.id},function(err, id){

        if (err){
            return next (new Error('user not found'))}
        else {
            res.send('User ' + id.email + ' wurde gelöscht' );
        }
    });
});


//Update Teilnehmer
teilnehmerController.put('/teilnehmer/edit/:id',function (req, res, next) {

    Teilnehmer.findByIdAndUpdate(
        {_id: req.params.id},
        {$set: req.body
        },
        function (err, teilnehmer) {
            if (!teilnehmer)
                return next(new Error('user not found'));
            else {
                res.send(teilnehmer);
            }
        })
});

//logout

teilnehmerController.delete('/teilnehmer/logout', function (req, res) {
    tokens = tokens.filter(token => token !== req.body.token)
    res.send("Logout successful");
    console.log(tokens);
});


// teilnehmen
let events;
let result = true;
teilnehmerController.put('/teilnehmer/participate/:id', function(req,res) {
    Veranstaltungen.findById({_id: req.body.id}, 'teilnehmerzahl teilnehmer', function (err, event) {
        events = event;
        if (event.teilnehmerzahl === event.teilnehmer.length) { // checks if max number of participants is already reached
            res.status(500).send("Veranstaltung ist bereits ausgebucht!") //err if max Teilnehmeranzahl is reached
        } else {
            events.teilnehmer.some(e => { //if room on list --> check if user already registered for event
                    if (e == req.params.id) { //if user matches with entry in list --> break
                        result = false; //if matching entries are found --> set result to false
                        return true; //= break
                    }
                })

            if (result === true) { //if result is true, user is not yet signed in for event
                Veranstaltungen.findByIdAndUpdate({_id: req.body.id}, //pushes userID into Veranstaltung
                    {$push: {teilnehmer: req.params.id}}).exec();
                res.send("sie wurden erfolgreich angemeldet!")
            }
            else{ //if result is not true, user already exists in list
                res.send("Sie sind bereits angemeldet!")
                result = true; //reset result variable
            }
        }
    })
})




//abmelden
teilnehmerController.put('/teilnehmer/deregisterevent/:id', function(req,res) {
    let currentDate = moment();
    let resignPossible = true; // Abmeldung von Veranstaltung ist möglich
    let event02;
    let result02 = true;

    Veranstaltungen.findById({_id: req.body.id}, function(err,event){ //checks if Rücktrittsfrist is over
        let newMomentObj = moment(event.start_datum)
        if (newMomentObj.diff(currentDate, 'days') < 1){  //if you want to resign closer then 1 day before start of the event
          resignPossible = false;
        }
        if(resignPossible === false){
            res.status(500).send('Die Rücktrittsfrist ist abgelaufen')
        }
        else{Veranstaltungen.findById({_id: req.body.id}, 'teilnehmerzahl teilnehmer', function (err, event) {
            event02 = event;
            console.log(result02)
            console.log(event02.teilnehmer)
            event02.teilnehmer.some(e => { //if room on list --> check if user already registered for event
                if (e == req.params.id) { //if user matches with entry in list --> break
                    result02 = false//if matching entries are found --> set result to false
                    return false;
                    //= break
                }

            })
            console.log(result02)
            if (result02 === false) { //if result is true, user is not yet signed in for event
                Veranstaltungen.findByIdAndUpdate({_id: req.body.id}, //pushes userID into Veranstaltung
                    {$pull: {teilnehmer: req.params.id}}).exec();
                res.send("erfolgreich abgemeldet")
            }
            else{ //if result is not true, user already exists in list
                res.send("Sie sind nicht angemeldet!")
                result = true; //reset result variable
            }

        })}

    })




})





module.exports = teilnehmerController;
