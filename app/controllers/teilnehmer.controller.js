const express = require('express');
const teilnehmerController = express();

let Teilnehmer = require('../models/Teilnehmer');


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

teilnehmerController.post('/registration/add', function (req, res) {
    console.log('erstelle teilnehmer');
    if(!req.body.name || !req.body.vorname || !req.body.email || !req.body.passwort) {
        return res.status(400).send('Der Datensatz ist unvollständig!');
    };
    console.log(req.body);

    let teilnehmerInstance = new Teilnehmer(req.body);

    console.log(teilnehmerInstance);

    teilnehmerInstance.save()
        .then(() => {
            res.status(200).json({ 'Success': true })
        })
        .catch(err => {
            res.status(400).send({ 'Success': false, 'Message': 'Error occured while creating new user' });
        });

});

//delete
teilnehmerController.route('/delete/:id').get(function (req, res) {

    let teilnehmerId = req.params.id;

    Teilnehmer.find({ 'Teilnehmer.id': teilnehmerId }).remove(function (err, user) {
        if (err)
            res.json({ 'Success': false, 'Message': 'User not found' });
        else
            res.json({ 'Success': true });
    });
});


// update
teilnehmerController.route('/edit/:id').post(function (req, res) {

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
