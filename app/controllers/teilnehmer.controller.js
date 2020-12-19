const express = require('express');
const teilnehmerController = express();
let Teilnehmer = require('../models/Teilnehmer');
const {delay} = require("rxjs/operators");


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

teilnehmerController.get('/teilnehmer/show/:id', function (req, res) {
    Teilnehmer.findOne()

        .catch(err => {
            console.log(err.toString());
            res.status(500).send(err.toString());
        })
        .then(dbres => {
            console.log(dbres);
            res.send(dbres);
        });
});

//registration

teilnehmerController.get('/teilnehmer/registration', function (req, res){
    res.sendFile('registration.html',{root:'./vms/src/views/teilnehmer'});
});


//Registration Teilnehmer

teilnehmerController.post('/teilnehmer/registration/add', function (req, res) {
    console.log('erstelle teilnehmer');

    let teilnehmerInstance = new Teilnehmer(req.body);

    console.log(teilnehmerInstance);

    teilnehmerInstance.save((err, doc) =>{
        if (!err){
            res.send('Sie wurden  erfolgreich registriert!');}
        else  {console.log(err.toString());
        res.status(500).send(err.toString()); }

   });

});

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