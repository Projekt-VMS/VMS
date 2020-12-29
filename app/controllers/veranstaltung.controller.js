
var moment = require('moment'); // require
moment().format();
moment.locale('de',{week:{dow : 1}})
const express = require('express'),
    veranstaltungsController = express();
const nodemailer = require('nodemailer');
const Veranstalter = require('../models/Veranstalter');
let Veranstaltung = require('../models/Veranstaltung');
var date = new Date();

date.setDate(date.getDate() + 7)

// get with Veranstalter

function getVeranstaltungWithVeranstalter (veranstaltung_ID){
    console.log(veranstaltung_ID);
    return Veranstaltung.findOne({ veranstaltung_id: veranstaltung_ID })
        .populate('veranstalter').exec((err, veranstalter) => {
            console.log("Populated Veranstaltung " + veranstalter);
        })
}


//show all

veranstaltungsController.get('/veranstaltung/show', function (req, res) {

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
        //getVeranstaltungWithVeranstalter(req.params.id);

    Veranstaltung.findOne()
        .populate('raum')
        .populate('veranstalter')
        .exec()
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

veranstaltungsController.post('/veranstaltung/add',async (req, res) => {
   let veranstaltungInstance = new Veranstaltung(req.body);
    let  transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "f91515824063a2",
            pass: "e0703dbc730281"
        }
    });
    if (moment(req.body.start_datum).isSame (req.body.end_datum, 'week')){ // checks if event ends in same week --> no event longer than sunday
        veranstaltungInstance.save((err, doc) => {
            if (!err) {
                console.log(doc._id);

                res.send('Veranstaltung wurde erfolgreich erstellt!');
                transport.sendMail({
                    from: 'test@vms.de',
                    to: 'test@kunde.de',
                    subject: 'Test Mail 1',
                    text: 'Ihre Veranstaltung wurde erfolgreich erstellt'
                })
            } else {
                console.log(err.toString());
                res.status(500).send(err.toString());
            }

        });
    }
    else {console.log ('Fehler!')
    res.status(500).send('Veranstaltung darf nicht länger als Sonntag dauern!');}
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
    veranstaltungsController.put('/veranstaltung/edit/:id', function (req, res, next) {

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

