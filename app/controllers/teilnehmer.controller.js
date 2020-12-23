const express = require('express');
const teilnehmerController = express();
const Teilnehmer = require('../models/Teilnehmer');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");


//show all Teilnehmer

teilnehmerController.get('/teilnehmer', function(req, res){ Teilnehmer.find()
    .catch(err=>{
        console.log(err.toString()); res.status(500).send(err.toString());
    })
    .then(dbres=>{
        console.log(dbres);
        res.send(dbres);
    });
});

//Show one Teilnehmer

teilnehmerController.get('/teilnehmer/showOne', function (req, res) {

    Teilnehmer.findById(req.body.ObjectId)

        .catch(err => {
            console.log(err.toString());
            res.status(500).send(err.toString());
        })
        .then(dbres => {
            console.log(dbres);
            res.send(dbres);
        });
});

//Registration Teilnehmer

teilnehmerController.post('/teilnehmer/registration/add', function (req, res) {
    console.log('erstelle teilnehmer');

    const { name, vorname, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !vorname || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (errors.length > 0) {
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
                        const token = newTeilnehmer.generateJwt();
                        if (!err){
                            res.json({
                                "token": token
                            })
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
                {email: fetchedUser.email, userID: fetchedUser._id}, "private_key",
                {expiresIn: "1h"}
            );
        res.status(200).json({
                token: token,
                expiresIn: 3600,
                userID: fetchedUser._id
            });
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
        {
            name: req.body.name,
            vorname: req.body.vorname,
            email: req.body.email,
            passwort: req.body.passwort
        },
        function (err, teilnehmer) {
            if (!teilnehmer)
                return next(new Error('user not found'));
            else {
                res.send(teilnehmer);
            }
        })});

module.exports = teilnehmerController;
