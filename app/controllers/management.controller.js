const express = require('express');
const managementController = express();
const Management = require('../models/Management');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

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
        //let raum = Raum["customer" + req.params.id];
        //res.end( "Find a Customer:\n" + JSON.stringify(raum, null, 4));

        .catch(err => {
            console.log(err.toString());
            res.status(500).send(err.toString());
        })
        .then(dbres => {
            console.log(dbres);
            res.send(dbres);
        });
});

// Registration Management


managementController.post('/management/registration/add', function (req, res) {

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
                        const token = newManagement.generateJwt();
                        if (!err){
                            res.json({
                                "token": token
                            })
                        }
                        else  {console.log(err.toString());
                            res.status(500).send(err.toString()); }
                    })

                req.flash('success_msg', 'Du bist nun registriert')
                console.log(newManagement);
            });
        });
    }
});

//delete
managementController.delete('/management/delete/:id', function (req, res, next) {

    Management.findByIdAndRemove({_id: req.params.id},function(err, id){

        if (err){
            return next (new Error('user not found'))}
        else {
            res.send('User ' + id.email + ' wurde gelöscht' );
        }
    });
});

//Update
managementController.put('/management/edit/:id',function (req, res, next) {

    Management.findByIdAndUpdate(
        {_id: req.params.id},
        {$set:req.body
        },
        function (err, managementuser) {
            if (!managementuser)
                return next(new Error('user not found'));
            else {
                res.send(managementuser);
            }
        });
});

//login

managementController.post('/management/login', (req, res, next) =>{

    let fetchedUser;

    Management.findOne({email:req.body.email}).then(function(manager){
        if(!manager){
            return res.status(401).json({message: 'Login Failed, no such User!'})
        }
        fetchedUser=manager;
        return bcrypt.compare(req.body.password, manager.password);
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
            tokens.push(token);
            console.log(tokens);
            console.log('logged in!')
        }

    })
        .catch(e=>{
            console.log(e)
        })
})

module.exports = managementController;
