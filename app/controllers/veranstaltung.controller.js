const express = require('express'),
    veranstaltungsController = express();


let Veranstaltung = require('../models/Veranstaltung');

//create

veranstaltungsController.post('/veranstaltung/add',function (req, res) {

    let veranstaltungInstance = new Veranstaltung(req.body);

    console.log(veranstaltungInstance);

    veranstaltungInstance.save((err, doc) =>{
        if (!err){
            res.send('Management User wurde  erfolgreich registriert!');}
        else  {console.log(err.toString());
            res.status(500).send(err.toString()); }

    })});

//show all

veranstaltungsController.get('/veranstaltung/list', function (req, res) {
    Veranstaltung.find()
        .catch(err => {
                console.log(err.toString());
                res.status(500).send(err.toString());
            })
            .then(dbres => {
                console.log(dbres);
                res.send(dbres);
            });
    });

//show one

    veranstaltungsController.get('/veranstaltung/show/:id', function (req, res) {
        Raum.findOne()

            .catch(err => {
                console.log(err.toString());
                res.status(500).send(err.toString());
            })
            .then(dbres => {
                console.log(dbres);
                res.send(dbres);
            });
    });

//delete one
    veranstaltungsController.delete('/veranstaltung/delete/:id', function (req, res, next) {

        Veranstaltung.findByIdAndRemove({_id: req.params.id}, function (err, id) {

            if (err) {
                return next(new Error('user not found'))
            } else {
                res.send('Veranstaltung ' + id.titel + ' wurde gelöscht');
            }
        });
    });

//update
    veranstaltungsController.put('/raum/edit/:id', function (req, res, next) {

        Veranstaltung.findByIdAndUpdate(
            {_id: req.params.id},
            {
                titel: req.body.titel,
                start_datum: req.body.start_datum,
                end_datum: req.body.end_datum,
                teilnehmerzahl: req.body.teilnehmerzahl,
                veranstalter_preis: req.body.veranstalter_preis,
                teilnehmer_preis: req.body.teilnehmer_preis,
                sichtbarkeit: req.body.sichtbarkeit,
                angebotsstatus: req.body.angebotsstatus,
            },
            function (err, event) {
                if (!event)
                    return next(new Error('raum not found'));
                else {
                    res.send(event);
                }
            });

    });





module.exports = veranstaltungsController;

