const express = require('express'),
    raumController = express.Router();


let Raum = require('../models/Raum');


raumController.get(('/raum'), function (req , res){
    res.sendFile('erstellen.raum.html',{root:'./app/view/'})
});

//show

raumController.get('/raum/show', function(req, res){ Raum.find()
    .catch(err=>{
        console.log(err.toString()); res.status(500).send(err.toString());
    })
    .then(dbres=>{
        console.log(dbres);
        res.send(dbres);
    });
});


//create

raumController.route('/raum/add').post(function (req, res) {

    let raumInstance = new Raum(req.body);

    console.log(raumInstance);

    raumInstance.save()
        .then(raumInstance => {
            res.status(200).json({ 'Success': true })
        })
        .catch(err => {
            res.status(400).send({ 'Success': false, 'Message': 'Error occured while creating new Raum' });
        });

});

//delete
raumController.route('/raum/delete/:id').get(function (req, res) {

    let raumId = req.params.raum_ID;

    Raum.find({ 'rid': raumId }).remove(function (err, raum) {
        if (err)
            res.json({ 'Success': false, 'Message': 'Raum not found' });
        else
            res.json({ 'Success': true, 'Message' : raumId});

    });
});


// update
raumController.route('/raum/edit/:id').post(function (req, res) {

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

