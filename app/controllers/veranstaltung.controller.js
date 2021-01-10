const express = require('express'),
    veranstaltungsController = express();
const nodemailer = require('nodemailer');
const Veranstalter = require('../models/Veranstalter');
const Raum = require('../models/Raum');
let Veranstaltung = require('../models/Veranstaltung');
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
moment().utc();
moment.locale('us',{week:{dow : 1}})
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

//show all
veranstaltungsController.get('/veranstaltung/show', function (req, res) {
    Veranstaltung.find()
            .catch(err => {
                console.log(err.toString());
                res.status(500).send(err.toString());
            })
            .then(dbres => {
                res.send(dbres);
            });
});

//show one
veranstaltungsController.get('/veranstaltung/showOne/:id', function (req, res) {
    Veranstaltung.findOne({_id: req.params.id})
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
let foundevents;
let range1;
let range2;
let result2;
let veranstalterExists;
let raumExists;
result2 = false;

veranstaltungsController.post('/veranstaltung/add',function (req, res) {
    let {
        titel,
        veranstalter,
        raum,
        start_datum,
        end_datum,
        teilnehmerzahl,
        veranstalter_preis,
        teilnehmer_preis,
        sichtbarkeit,
        angebotsstatus
    } = req.body;
    let errors = [];

    if (!titel || !veranstalter || !raum || !start_datum || !end_datum || !teilnehmerzahl || !teilnehmer_preis || !sichtbarkeit || !angebotsstatus) {
        errors.push({message: 'Fülle bitte alle Felder aus.'});
    }

    Veranstalter.find({email: req.body.veranstalter}, function (err, veranstalter) { //check if Veranstalter exists
        veranstalterExists = veranstalter.length > 0;
        if (veranstalterExists === false) {
            console.log('endlich')
            errors.push({message: 'Der Veranstalter existiert nicht.'});
            console.log(errors)
        }

        Raum.find({raumNr: req.body.raum}, function (err, raum) { //check if Raum exists
            console.log(req.body.raum)
            raumExists = raum.length > 0;
            console.log(raumExists)
            if (raumExists === false) {
                console.log('raum existiert nicht')
                errors.push({message: 'Der Raum existiert nicht'})
            }

            Veranstaltung.find({raum: req.body.raum}, 'start_datum end_datum', function (err, veranstaltung) {
                foundevents = veranstaltung //saves all found events as arrays to foundevents
                //foundevents.forEach(event => { //as long as result is false there is no overlap; complete array of matching rooms is searched until overlap is found or end of array is reached
                foundevents.every(event => {
                    range1 = moment.range(req.body.start_datum, req.body.end_datum) //dates to check are passed in
                    range2 = moment.range(event.start_datum, event.end_datum) //these are the dates of the exisiting event
                    result2 = range1.overlaps(range2) //ranges are checked for overlap; result 2 is updated
                    if (result2 === true) {
                        errors.push({message: 'Leider ist dieser Raum zu dieser Zeit blockiert. Bitte versuchen Sie eine andere Kombination aus Datum und Raum!'})
                        return false;
                    }
                    return true;
                })
                    if (!((moment(req.body.start_datum).isSame(req.body.end_datum, 'week')))) {
                        errors.push({message: 'Veranstaltung darf nicht länger als Sonntag dauern! Außerdem darf eine Veranstaltung maximal 7 Tage dauern!'})
                    }
                if (errors.length > 0) {
                    res.status(400).json({
                        errors,
                        veranstalter_preis, titel, veranstalter, raum, start_datum, end_datum, teilnehmerzahl, teilnehmer_preis, sichtbarkeit, angebotsstatus
                    });
                } else {
                    const veranstaltungInstance = new Veranstaltung({
                        titel,
                        veranstalter,
                        raum,
                        start_datum,
                        end_datum,
                        veranstalter_preis,
                        teilnehmerzahl,
                        teilnehmer_preis,
                        sichtbarkeit,
                        angebotsstatus
                    })

                    veranstaltungInstance.save((err, doc) => { //saves event
                        if (!err) {
                            console.log("success!")
                            res.status(200).json({message: 'Veranstaltung wurde erfolgreich erstellt!'}); //sends mail once event is saved
                            transport.sendMail({
                                from: 'test@vms.de',
                                to: req.body.veranstalter,
                                subject: 'Ihr Angebot ',
                                text: 'Vielen Dank für Ihre Anfrage. Anbei erhalten sie ihr Angebot auf Basis Ihrer eingegebenen Daten: '
                                    + doc
                            })
                        } else { //error if event can't be safed
                            console.log(err.toString());
                            res.status(500).json({message: 'Veranstaltung erstellen ist fehlgeschlagen'});
                        }
                    })
                }
            })
        })
    })
})

   /* if (!((moment(req.body.start_datum).isSame(req.body.end_datum, 'week')))) {
       errors.push({message: 'Veranstaltung darf nicht länger als Sonntag dauern! Außerdem darf eine Veranstaltung maximal 7 Tage dauern!'})
    }

    if (errors.length > 0) {
        res.status(400).json({
            errors,
            veranstalter_preis, titel, veranstalter, raum, start_datum, end_datum, teilnehmerzahl, teilnehmer_preis, sichtbarkeit, angebotsstatus
        });
    } else {
        const veranstaltungInstance = new Veranstaltung({
            titel,
            veranstalter,
            raum,
            start_datum,
            end_datum,
            veranstalter_preis,
            teilnehmerzahl,
            teilnehmer_preis,
            sichtbarkeit,
            angebotsstatus
        })

        veranstaltungInstance.save((err, doc) => { //saves event
            if (!err) {
                console.log("success!")
                res.status(200).json({message: 'Veranstaltung wurde erfolgreich erstellt!'}); //sends mail once event is saved
                transport.sendMail({
                    from: 'test@vms.de',
                    to: req.body.veranstalter,
                    subject: 'Ihr Angebot ',
                    text: 'Vielen Dank für Ihre Anfrage. Anbei erhalten sie ihr Angebot auf Basis Ihrer eingegebenen Daten: '
                        + doc
                })
            } else { //error if event can't be safed
                console.log(err.toString());
                res.status(500).json({message: 'Veranstaltung erstellen ist fehlgeschlagen'});
            }
        })*/


        /*Veranstalter.find({email:req.body.veranstalter},function(err, veranstalter) { //check if Veranstalter exists
            veranstalterExists = veranstalter.length > 0;
        })
        console.log(veranstalter.length)

        Raum.find({raum:req.body.raumNr}, function(err, raum){ //check if Raum exists
            raumExists = raum.length > 0;
        });

        Veranstaltung.find({raum: req.body.raum}, 'start_datum end_datum', function (err, veranstaltung) { //this is the check for availability function

        if (!err) {
            foundevents = veranstaltung //saves all found events as arrays to foundevents
                //foundevents.forEach(event => { //as long as result is false there is no overlap; complete array of matching rooms is searched until overlap is found or end of array is reached
                foundevents.every(event => {
                    range1 = moment.range(req.body.start_datum, req.body.end_datum) //dates to check are passed in
                    range2 = moment.range(event.start_datum, event.end_datum) //these are the dates of the exisiting event
                    result2 = range1.overlaps(range2) //ranges are checked for overlap; result 2 is updated
                    if (result2 !== false) {return false;}
                    if (result2 === undefined){return false;}
                    return true;
                })
        }
          if(veranstalterExists === true) {
              if (raumExists === true) {
                  if (result2 === false || result2 === undefined) {
                      if ((moment(req.body.start_datum).isSame(req.body.end_datum, 'week'))) { // checks if event ends in same week --> no event longer than sunday

                          veranstaltungInstance.save((err, doc) => { //saves event
                              if (!err) {
                                  console.log("success!")

                                  res.status(200).json({message: 'Veranstaltung wurde erfolgreich erstellt!'}); //sends mail once event is saved
                                  transport.sendMail({
                                      from: 'test@vms.de',
                                      to: req.body.veranstalter,
                                      subject: 'Ihr Angebot ',
                                      text: 'Vielen Dank für Ihre Anfrage. Anbei erhalten sie ihr Angebot auf Basis Ihrer eingegebenen Daten: '
                                          + doc
                                  })
                              } else { //error if event can't be safed
                                  console.log(err.toString());
                                  res.status(500).json({message: 'Veranstaltung erstellen ist fehlgeschlagen'});
                              }
                          })
                      } else { //error if event ends after sunday
                          console.log('Fehler! (Sonntag')
                          res.status(500).send('Veranstaltung darf nicht länger als Sonntag dauern! Außerdem darf eine Veranstaltung maximal 7 Tage dauern!');
                      }

                  } else  //error if room is not available at requested date
                      res.status(500).send('Leider ist dieser Raum zu dieser Zeit blockiert. Bitte versuchen Sie eine andere Kombination aus Datum und Raum!')
              } else {
                  res.status(500).send('Dieser Raum existiert nicht')
              }
          }

          else{res.status(500).send("Dieser Veranstalter existiert nicht")
         }
    })
}})*/




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
                $set: req.body
            },
            function (err, event) {
                if (!event)
                    return next(new Error('Event not found'));
                else {
                    res.send(event);
                }
            });



    });

//get Teilnehmerliste pro Veranstaltung

veranstaltungsController.get('/veranstaltung/showOne/list/:id', function (req, res) {
    //getVeranstaltungWithVeranstalter(req.params.id);

    Veranstaltung.findOne({_id: req.params.id},'teilnehmer')
        .populate('teilnehmer', 'name vorname email')
        .catch(err => {
            console.log(err.toString());
            res.status(500).send(err.toString());
        })
        .then(dbres => {
            console.log(dbres);
            res.send(dbres);
        });



});


module.exports = veranstaltungsController;

