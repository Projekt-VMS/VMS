const express = require('express');
const teilnehmerController = express();
var ObjectId = require('mongoose').Types.ObjectId;
let Teilnehmer = require('../models/Teilnehmer');
const {delay} = require("rxjs/operators");


//show

teilnehmerController.get('/teilnehmer', function(req, res){ Teilnehmer.find()
    .catch(err=>{
        console.log(err.toString()); res.status(500).send(err.toString());
    })
    .then(dbres=>{
        console.log(dbres);
        res.send(dbres);
    });
});

//registration

teilnehmerController.get('/registration', function (req, res){
    res.sendFile('registration.html',{root:'./vms/src/views/teilnehmer'});
});


//create

teilnehmerController.post('/teilnehmer/registration/add', function (req, res) {
    console.log('erstelle teilnehmer');

    let teilnehmerInstance = new Teilnehmer(req.body);

    console.log(teilnehmerInstance);

    teilnehmerInstance.save((err, doc) =>{
        if (!err)
            res.send('Sie wurden  erfolgreich registriert!');
        else  console.log(err.toString());
        res.status(500).send(err.toString()); })

});

//delete

teilnehmerController.get('/delete',(function (req, res) {
    res.sendFile('userdelete.html', {root: 'vms/src/views/teilnehmer'})
}));







// update
teilnehmerController.route('/teilnehmer/edit/:id').post(function (req, res) {

    let teilnehmerId = req.params.id;

    Teilnehmer.findOne({ 'Teilnehmer.id': teilnehmerId }, function (err, user) {
        if (!teilnehmer)
            return next(new Error('user not found'));
        else {
            teilnehmer.name = req.body.name;
            teilnehmer.vorname = req.body.vorname;
            teilnehmer.email = req.body.email;
            teilnehmer.passwort = req.body.passwort;

            teilnehmer.save().then(teilnehmer => {
                res.json({ 'Success': true });
            })
                .catch(err => {
                    res.status(400).json({ 'Success': false });
                });
        }
    });
});





module.exports = teilnehmerController;
