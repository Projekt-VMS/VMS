const express = require('express'),
    teilnehmerController = express.Router();

let Teilnehmer = require('../models/Teilnehmer');


//create

teilnehmerController.route('/add').post(function (req, res) {

    let teilnehmerInstance = new Teilnehmer(req.body);
    console.log(teilnehmerInstance);
    teilnehmerInstance.save()
        .then(teilnehmerInstance => {
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
