const express = require('express'),
    raumController = express.Router();


let Raum = require('../models/Raum');

//create

raumController.route('/add').post(function (req, res) {

    let raumInstance = new Raum(req.body);
    console.log(raumInstance);
    raumInstance.save()
        .then(raumInstance => {
            res.status(200).json({ 'Success': true })
        })
        .catch(err => {
            res.status(400).send({ 'Success': false, 'Message': 'Error occured while creating new user' });
        });

});

//delete
raumController.route('/delete/:id').get(function (req, res) {

    let raumId = req.params.id;

    Raum.find({ 'Raum.rid': raumId }).remove(function (err, raum) {
        if (err)
            res.json({ 'Success': false, 'Message': 'Raum not found' });
        else
            res.json({ 'Success': true });
    });
});


// update
raumController.route('/edit/:id').post(function (req, res) {

    let raumId = req.params.id;

    Raum.findOne({ 'Raum.rid': raumId }, function (err, raum) {
        if (!raum)
            return next(new Error('user not found'));
        else {
            raum.kapazitaet = req.body.kapazitaet;
            raum.raumpreis = req.body.raumpreis;


            raum.save().then(raum => {
                res.json({ 'Success': true });
            })
                .catch(err => {
                    res.status(400).json({ 'Success': false });
                });
        }
    });
});



module.exports = raumController;

