const express = require('express');
const adminController = express();
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

let tokens=[];

//show one
adminController.get('/admin/showOne/:id', function (req, res) {
    Admin.findOne({_id: req.params.id})
        .catch(err => {
            console.log(err.toString());
            res.status(500).send(err.toString());
        })
        .then(dbres => {
            res.send(dbres);
        });
});

//Registration

adminController.post('/admin/registration/add', function (req, res) {
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
            email,
            password,
            password2
        });
        console.log(errors)
    } else {
        const newAdmin = new Admin({
            name,
            vorname,
            email,
            password
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newAdmin.password, salt, (err, hash) => {
                if (err) throw err;
                newAdmin.password = hash;
                newAdmin
                    .save((err, doc) => {
                        const token = jwt.sign(
                            {email: newAdmin.email, userID: newAdmin._id}, 'B6B5834672A21DC0C5B40800BDCE9945586DD5A8E33CF29701F0A323DE371601',
                            {expiresIn: "1h"})
                        if (!err){
                            res.status(200).json({
                                token: token,
                                expiresIn: 3600,
                                userID: newAdmin._id
                            });
                            tokens.push(token);
                            console.log(tokens);
                        }
                        else  {console.log(err.toString());
                            res.status(500).send(err.toString()); }
                    })
                console.log(newAdmin);
            });
        });
    }
});

//login
adminController.post('/admin/login', (req, res, next) =>{

    let fetchedUser;

    Admin.findOne({email:req.body.email}).then(function(admin){
        if(!admin){
            return res.status(401).json({message: 'Login fehlgeschlagen! Userdaten konnten nicht gefunden werden'});
        }
        fetchedUser=admin;
        return bcrypt.compare(req.body.password, admin.password);
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

//logout
adminController.delete('/admin/logout/:token', function (req, res) {
    tokens = tokens.filter(token => token !== req.params.token)
    res.status(200).json({message: 'Du bist erfolgreich abgemeldet'});
    console.log(tokens);
});
module.exports = adminController;
