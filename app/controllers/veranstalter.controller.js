const express = require('express');
const veranstalterController = express();
const Veranstalter = require('../models/Veranstalter');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

let tokens = [];

//list all

veranstalterController.get('/veranstalter/show', function(req, res){
    Veranstalter.find()
        .populate('veranstaltungen', 'titel', 'Veranstaltung')
        .exec(function (err, veranstalter){
            if(err){
        console.log(err.toString()); res.status(500).send(err.toString());
    }
    else {
        console.log(veranstalter);
        res.send(veranstalter);
    }
})});

//show one

veranstalterController.get('/veranstalter/showOne/:id', function (req, res) {
    Veranstalter.findOne({_id: req.params.id})

        .catch(err => {
            console.log(err.toString());
            res.status(500).send(err.toString());
        })
        .then(dbres => {
            console.log('aktiver User:'+ dbres);
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

    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (errors.length > 0) {
        res.send({
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
                        const token = newVeranstalter.generateJwt();
                        if (!err){
                            res.json({
                                "token": token
                            })
                        }
                        else  {console.log(err.toString());
                            res.status(500).send(err.toString()); }
                    })

                req.flash('success_msg', 'Du bist nun registriert')
                console.log(newVeranstalter);
            });
        });
    }
});

//login
veranstalterController.post('/veranstalter/login', (req, res, next) =>{

    let fetchedUser;

    Veranstalter.findOne({email:req.body.email}).then(function(veranstalter){
        if(!veranstalter){
            return res.status(401).json({message: 'Login Failed, no such User!'})
        }
        fetchedUser=veranstalter;
        return bcrypt.compare(req.body.password, veranstalter.password);
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

//delete
veranstalterController.delete('/veranstalter/delete/:id', function (req, res, next) {

    Veranstalter.findByIdAndRemove({_id: req.params.id},function(err, id){

        if (err){
            return next (new Error('user not found'))}
        else {
            res.send('User ' + id.email + ' wurde gelöscht' );
        }
    });
});

//Update
veranstalterController.put('/veranstalter/edit/:id',function (req, res, next) {

    //if(req.body.name != null) { array.push("name",req.body.name)}

    Veranstalter.findByIdAndUpdate(
        {_id: req.params.id},
        {$set: req.body
        },
        function (err, user) {
            if (!user)
                return next(new Error('user not found'));
            else {
                res.send(user);
            }
        });
});

module.exports = veranstalterController;
