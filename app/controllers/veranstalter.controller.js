const express = require('express'),
    veranstalterController = express();

let Veranstalter = require('../models/Veranstalter');


//list all

veranstalterController.get('/veranstalter/show', function(req, res){
    Veranstalter.find()
    .catch(err=>{
        console.log(err.toString()); res.status(500).send(err.toString());
    })
    .then(dbres=>{

        console.log(dbres);
        res.send(dbres);
    });
});

veranstalterController.get('/veranstalter/show/:id', function (req, res) {
    Veranstalter.findOne()

        .catch(err => {
            console.log(err.toString());
            res.status(500).send(err.toString());
        })
        .then(dbres => {
            console.log(dbres);
            res.send(dbres);
        });
});

//create

veranstalterController.post('/veranstalter/registration/add', function (req, res) {

    let veranstalterInstance = new Veranstalter(req.body);

    console.log(veranstalterInstance);

    veranstalterInstance.save((err, doc) =>{
        if (!err){
            res.send('Veranstalter wurde erfolgreich registriert!');}
        else  {console.log(err.toString());
            res.status(500).send(err.toString()); }

    });

});

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
        {
            name: req.body.name,
            vorname: req.body.vorname,
            unternehmen: req.body.unternehmen,
            email: req.body.email,
            passwort: req.body.passwort
        },
        function (err, user) {
            if (!user)
                return next(new Error('user not found'));
            else {
                res.send(user);
            }
        });
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
            console.log('logged in!')
        }

    })
        .catch(e=>{
            console.log(e)
        })
})



module.exports = veranstalterController;
