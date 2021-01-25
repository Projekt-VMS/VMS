const express = require('express');
const managementController = express();
const Management = require('../models/Management');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const {validatePassword} = require("./validation");
const {validateEmail} = require("./validation");
let transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "38cbd2ae4553d6",
        pass: "6b6d116b85c38d"
    }
});
let tokens =[];

//list all
managementController.get('/management/show', function(req, res){
    Management.find()
    .catch(err=>{
        console.log(err.toString()); res.status(500).send(err.toString());
    })
    .then(dbres=>{
        console.log(dbres);
        res.send(dbres);
    });
});

//show one
managementController.get('/management/showOne/:id', function (req, res) {
    Management.findOne({_id: req.params.id})
        .catch(err => {
            console.log(err.toString());
            res.status(500).send(err.toString());
        })
        .then(dbres => {
            res.send(dbres);
        });
});

// Registration Management
managementController.post('/management/registration/add', function (req, res) {

    const { name, vorname, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !vorname || !email || !password || !password2) {
        errors.push({ message: 'Fülle bitte alle Felder aus' });
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
    Management.find({email: email}, function (err, management){
        let emailExists = management.length > 0;
        if (emailExists === true){
            errors.push({ message: 'Die Email ist bereits vergeben.'});
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
            const newManagement = new Management({
                name,
                vorname,
                email,
                password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newManagement.password, salt, (err, hash) => {
                    if (err) throw err;
                    newManagement.password = hash;
                    newManagement
                        .save((err, doc) => {
                            const token = jwt.sign(
                                {email: newManagement.email, userID: newManagement._id}, 'B6B5834672A21DC0C5B40800BDCE9945586DD5A8E33CF29701F0A323DE371601',
                                {expiresIn: "1h"})
                            if (!err){
                                res.status(200).json({
                                    token: token,
                                    expiresIn: 3600,
                                    userID: newManagement._id,
                                    message: 'Der Mitarbeiter wurde erfolgreich erstellt'
                                });
                                tokens.push(token);
                                console.log(tokens);
                            }
                            else  {console.log(err.toString());
                                res.status(500).send(err.toString()); }
                        })
                    console.log(newManagement);
                });
            });
        }
    })
});

//login
managementController.post('/management/login', (req, res) =>{
    let fetchedUser;
    Management.findOne({email:req.body.email}).then(function(management){
        if(!management){
            return res.status(401).json({message: 'Login fehlgeschlagen! Userdaten konnten nicht gefunden werden'});
        }
        fetchedUser=management;
        return bcrypt.compare(req.body.password, management.password);
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
managementController.delete('/management/delete/:id', function (req, res, next) {

    Management.findByIdAndRemove({_id: req.params.id},function(err, id){
        if (err){
            res.status(401).json({message: 'User konnte nicht gelöscht werden'});
        }
        else {
            res.status(200).json({message: 'User ' + id.email + ' wurde gelöscht'});
        }
    });
});

//Update
managementController.put('/management/edit/:id',function (req, res, next) {

    Management.findByIdAndUpdate(
        {_id: req.params.id},
        {$set:req.body
        },
        function (err, management) {
            if (err){
                res.status(401).json({message: 'Es hat nicht geklappt!'});
            }
            else {
                res.status(200).json({message: 'User ' + management.email + ' wurde erfolgreich überschrieben'});
            }
        })
});

//logout
managementController.delete('/management/logout/:token', function (req, res) {
    tokens = tokens.filter(token => token !== req.params.token)
    res.status(200).json({message: 'Du bist erfolgreich abgemeldet'});
    console.log(tokens);
});

//Anfrage neues Passwort
managementController.put('/passwort',function (req, res, next) {
    if(req.body.email !== undefined){
        res.status(200).json({message: 'Dein neues Passwort wurde angefragt.'});
        transport.sendMail({
            from: req.body.email,
            to: 'management@vms.de',
            subject: 'Neues Passwort für ' + req.body.email,
            text: 'Sehr geehrter Management User, ' +
                '\n\nunser User mit der Email ' + req.body.email
                + '\n\nwünscht ein neues Passwort. Bitte ändern Sie das Passwort des Users im System. Dem User wird das neue Passwort automatisch mitgetielt.'
        })
    }
    else {res.status(400).send({message: 'Bitte email eingeben!'})}
})

module.exports = managementController;
