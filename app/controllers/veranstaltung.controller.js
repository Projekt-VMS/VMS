
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
moment().format();
moment.locale('de',{week:{dow : 1}})
const express = require('express'),
    veranstaltungsController = express();
const nodemailer = require('nodemailer');
const Veranstalter = require('../models/Veranstalter');
let Veranstaltung = require('../models/Veranstaltung');
var date = new Date();
let  transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "f91515824063a2",
        pass: "e0703dbc730281"
    }
});

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
     //   .populate('raum')
     //   .populate('veranstalter')
     //   .exec()
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
veranstaltungsController.post('/veranstaltung/add',function (req, res) {
    let veranstaltungInstance = new Veranstaltung(req.body);
    let foundevents;
    let range1;
    let range2;
    let result2;
    result2 = false;

    const { titel, veranstalter, raum, start_datum, end_datum, teilnehmerzahl, teilnehmer_preis, sichtbarkeit, angebotsstatus } = req.body;
    let errors = [];

    if (!titel || !veranstalter || !raum || !start_datum || !end_datum || !teilnehmerzahl || !teilnehmer_preis || !sichtbarkeit || !angebotsstatus) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if ((Veranstalter.findOne({email: veranstalter}))) {
           errors.push({msg: 'Veranstalter gibt es nicht'});
    }

    if (errors.length > 0) {
        console.log('fail');
        res.send({
            errors, titel, veranstalter, raum, start_datum, end_datum, teilnehmerzahl, teilnehmer_preis, sichtbarkeit, angebotsstatus
        });
    } else {
        const veranstaltungInstance = new Veranstaltung({
            titel,
            veranstalter,
            raum,
            start_datum,
            end_datum,
            teilnehmerzahl,
            teilnehmer_preis,
            sichtbarkeit,
            angebotsstatus
        })

        Veranstaltung.find({raum: req.body.raum}, 'start_datum end_datum', function (err, veranstaltung) { //this is the check for availability function

        if (!err) {
            foundevents = veranstaltung //saves all found events as arrays to foundevents
                //foundevents.forEach(event => { //as long as result is false there is no overlap; complete array of matching rooms is searched until overlap is found or end of array is reached
                foundevents.every(event => {
                    range1 = moment.range(req.body.start_datum, req.body.end_datum) //dates to check are passed in
                    range2 = moment.range(event.start_datum, event.end_datum) //these are the dates of the exisiting event
                    result2 = range1.overlaps(range2) //ranges are checked for overlap; result 2 is updated
                    console.log(foundevents.start_datum)
                    console.log(req.body.start_datum)
                    if (result2 !== false) {return false;}
                    if (result2 === undefined){return false;}
                    return true;


                })


        }

        //if room is available at requested date
        console.log(result2)
        if (result2 === false || result2 === undefined) {
            if ((moment(req.body.start_datum).isSame(req.body.end_datum, 'week'))) { // checks if event ends in same week --> no event longer than sunday

                veranstaltungInstance.save((err, doc) => { //saves event
                    if (!err) {
                        console.log(doc._id);

                        res.send('Veranstaltung wurde erfolgreich erstellt!'); //sends mail once event is saved
                        transport.sendMail({
                            from: 'test@vms.de',
                            to: 'test@kunde.de',
                            subject: 'Test Mail 1',
                            text: 'Ihre Veranstaltung wurde erfolgreich erstellt'
                        })
                    } else { //error if event can't be safed
                        console.log(err.toString());
                        res.status(500).send(err.toString());
                    }

                })
            } else { //error if event ends after sunday
                console.log('Fehler!')
                res.status(500).send('Veranstaltung darf nicht länger als Sonntag dauern! Außerdem darf eine Veranstaltung maximal 7 Tage dauern!');
            }

        } else  //error if room is not available at requested date
            res.status(500).send('Leider ist dieser Raum zu dieser Zeit blockiert. Bitte versuchen Sie eine andere Kombination aus Datum und Raum!')
    });
}})




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

