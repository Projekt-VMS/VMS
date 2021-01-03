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
            console.log('aktiver User:'+ dbres);
            res.send(dbres);
        });
});

//Registration

adminController.post('/admin/registration/add', function (req, res) {
    const { email, password, password2 } = req.body;
    let errors = [];

    if (!email || !password || !password2) {
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
    } else {
        const newAdmin = new Admin({
            email,
            password
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newAdmin.password, salt, (err, hash) => {
                if (err) throw err;
                newAdmin.password = hash;
                newAdmin
                    .save((err, doc) => {
                        const token = newAdmin.generateJwt();
                        if (!err){
                            res.json({
                                "token": token
                            })
                        }
                        else  {console.log(err.toString());
                            res.status(500).send(err.toString()); }
                    })

                req.flash('success_msg', 'Du bist nun registriert')
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
            return res.status(401).json({message: 'Login Failed, no such User!'})
        }
        fetchedUser=admin;
        return bcrypt.compare(req.body.password, admin.password);
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

module.exports = adminController;
