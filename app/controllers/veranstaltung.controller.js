const express = require('express'),
    veranstaltungsController = express();
const nodemailer = require('nodemailer');
const Veranstalter = require('../models/Veranstalter');
const Raum = require('../models/Raum');
let Veranstaltung = require('../models/Veranstaltung');
const Moment = require('moment');
var momentTz = require('moment-timezone');
const MomentRange = require('moment-range');
const Teilnehmer = require("../models/Teilnehmer");
const moment = MomentRange.extendMoment(Moment);
//moment.tz.add('Europe/Berlin|CET CEST CEMT|-10 -20 -30')
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
    let { titel, veranstalter, raum, start_datum, end_datum, teilnehmerzahl, teilnehmer_preis, sichtbarkeit, angebotsstatus, leistung } = req.body;
    start_datum = momentTz(start_datum).tz('Europe/Berlin').format('YYYY-MM-DD');
    end_datum = momentTz(end_datum).tz('Europe/Berlin').format('YYYY-MM-DD');
    let errors = [];

    if (!titel || !veranstalter || !raum || !start_datum || !end_datum || !teilnehmerzahl || !teilnehmer_preis || !sichtbarkeit || !angebotsstatus ) {
        errors.push({message: 'Fülle bitte alle Felder aus.'});
    }

    let raum_preis;
    let veranstalter_preis =0;
    let preis;
    let raum_kapa;



    Raum.find({raumNr: req.body.raum} ,function (err, doc){ //berechnet Preis des Veranstalters aus Raumpreis und Dauer
        preis = doc
        preis.every(e =>{
           raum_preis = e.raumpreis
        })
        let start = moment(req.body.start_datum)
        let end = moment(req.body.end_datum);
        let diff = end.diff(start, 'days')
        let dauer = diff + 1 //add+1 to account for missing day that comes with duration
        veranstalter_preis = dauer * raum_preis
    })

    Veranstalter.find({email: req.body.veranstalter}, function (err, doc) { //check if Veranstalter exists
        veranstalterExists = doc.length > 0;
        if (veranstalterExists === false) {
            console.log('endlich')
            errors.push({message: 'Der Veranstalter existiert nicht.'});
            console.log(errors)
        }

        Raum.find({raumNr: req.body.raum} ,function (err, doc){ //berechnet Preis des Veranstalters aus Raumpreis und Dauer
            let kapa = doc
            kapa.every(e =>{
                raum_kapa = e.kapazitaet})
            if(req.body.teilnehmerzahl > raum_kapa){
                errors.push({message: 'Die Teilnehmeranzahl für diesen Raum ist zu hoch'})
                return false;
            }
        })


        Raum.find({raumNr: req.body.raum},'raumNr', function (err, doc) { //check if Raum exists
            raumExists = doc.length > 0;
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
                   // errors.push({message: 'Veranstaltung darf nicht länger als Sonntag dauern! Außerdem darf eine Veranstaltung maximal 7 Tage dauern!'})
                }
                console.log('hier auch ' )
                if (errors.length > 0) {
                    res.status(400).json({
                        errors,
                        titel, veranstalter, raum, start_datum, end_datum, teilnehmerzahl, teilnehmer_preis, sichtbarkeit, angebotsstatus, leistung
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
                        angebotsstatus,
                        leistung
                    })
                    console.log(veranstaltungInstance)
                    veranstaltungInstance.save((err, doc) => { //saves event
                        if (!err) {
                            console.log(veranstalter_preis)
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

        Veranstaltung.findByIdAndRemove({_id: req.params.id}, function (err, event) {
            if (err) {
                res.status(401).json({message: 'Es hat nicht geklappt!'});
            } else {
                res.status(200).json({message: 'Veranstaltung ' + event.titel + ' wurde gelöscht'});
            }
        });
    });

//Absage mit Nachricht an Teilnehmer und Veranstalter (bspw. wegen Corona)
veranstaltungsController.post('/veranstaltung/delete/message/:id', function (req, res, next) {
    let absagePossible = true;
    Veranstaltung.findById({_id: req.params.id}, function (err, event) {
        if (event !== null) {
            let currentDate = moment();
            let newMomentObj = moment(event.start_datum)
            if (newMomentObj.diff(currentDate, 'days') <= 0) {
                absagePossible = false;
            }
        }


    let {grund} = req.body
    if(!grund){
        res.status(400).json({message: 'Grund für Absage eingeben.'})
    }else if(absagePossible === true) {
        Veranstaltung.findByIdAndRemove({_id: req.params.id}, function (err, doc) {
            if (err) {
                res.status(401).json({message: 'Es hat nicht geklappt!'});
            } else {
                transport.sendMail({
                    from: 'management@vms.de',
                    to: doc.veranstalter,
                    subject: 'Absage Ihrer Veranstaltung ' + doc.titel,
                    text: 'Sehr geehrter Veranstalter, \nLeider müssen wir Ihre oben genannte Veranstaltung absagen. Der Grund dafür: ' +
                        '\n \n      ' + grund +
                        '\n \nBitte kontaktieren Sie uns per Mail, ob wir die Veranstaltungen, angepasst an den Absagegrund, wieder im System aufnehmen sollen.' +
                        '\nWir freuen uns auf Ihre nächste Buchung! ' +
                        '\nMit freundlichen Grüßen ' +
                        '\nDas VMS '
                })
                doc.teilnehmer.every(e => {

                    Teilnehmer.findById({_id: e}, 'email', function (err, usermail) {
                        let tMail = usermail.email
                        transport.sendMail({
                            from: 'management@vms.de',
                            to: tMail,
                            subject: 'Absage der Veranstaltung ' + doc.titel,
                            text: 'Sehr geehrter Teilnehmer, \n leider müssen wir oben genannte Veranstaltung absagen. Der Grund dafür: \n \n'
                                //bitte hier Absagegrund ergänzen  + req.body.
                                + '\n Wir werden uns bemühen, die Veranstaltung im Rahmen unserer Möglichkeiten erneut anzubieten. Bitte informieren Sie sich in den nächsten Tagen auf unserer Seite, ob die Veranstaltung wieder eingestellt wurde.'
                        })

                    })
                    return true
                })
            }


            res.status(200).json({message: 'Veranstaltung ' + doc.titel + ' wurde abgesagt'});
        });
    }
    else {res.status(400).json({message: 'Veranstaltung hat bereits begonnen. Eine Absage ist nicht möglich"'})}
})
});


//update
    veranstaltungsController.put('/veranstaltung/edit/:id', function (req, res, next) {

        Veranstaltung.findByIdAndUpdate(
            {_id: req.params.id},
            {
                $set: req.body
            },
            function (err, event) {
                if (err)
                    res.status(401).json({message: 'Es hat nicht geklappt!'});
                else {
                    res.status(200).json({message: 'Veranstaltung ' + event.titel + ' wurde erfolgreich überschrieben'});
                }
            });



    });

//get Teilnehmerliste pro Veranstaltung

veranstaltungsController.get('/veranstaltung/showOne/list/:id', function (req, res) {

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

//generate Teilnehmerliste als PDF

veranstaltungsController.post('/veranstaltung/download/:id', function (req, res) {

    Veranstaltung.findOne({_id: req.params.id},'teilnehmer')
        .populate('teilnehmer', 'name vorname email')
        .catch(err => {
            console.log(err.toString());
            res.status(500).send(err.toString());
        })
        .then(dbres => {

            console.log(dbres.teilnehmer)
                var {Base64Encode} = require('base64-stream');
                let fonts = {
                    Roboto: {
                        normal: 'node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf',
                        bold: 'node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf',
                        italics: 'node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf',
                        bolditalics: 'node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf'
                    }
                };

                var PdfPrinter = require('pdfmake');
                var printer = new PdfPrinter(fonts);
                var fs = require('fs');

                function buildTableBody(data, columns) {
                    var body = [];

                    body.push(columns);

                    data.forEach(function(row) {
                        var dataRow = [];

                        columns.forEach(function(column) {
                            dataRow.push(row[column].toString());
                        })

                        body.push(dataRow);
                    });
                    console.log(body)
                    return body;
                }

                function table(data, columns) {
                    return {
                        table: {
                            headerRows: 1,
                            body: buildTableBody(data, columns)
                        }
                    };
                }

                var docDefinition = {
                    content: [
                        { text: 'Teilnehmerliste', alignment: 'center'},
                        { text: '\n \n'},
                        table(dbres.teilnehmer, ['name', 'vorname', 'email'])
                    ]
                }

                var pdfDoc = printer.createPdfKitDocument(docDefinition);

                const stream = pdfDoc.pipe(new Base64Encode())
                pdfDoc.end()
                let finalString = ''
                stream.on('data', function (chunk) {
                finalString += chunk;
                });
                stream.on('end', function () {
                    res.status(200).send(finalString)
                });
        })
});


// Abrechnung erstellen
veranstaltungsController.put('/veranstaltung/abrechnen/:id', function (req, res, next) {
  console.log( req.params.id.veranstalter_preis)

    Veranstaltung.findByIdAndUpdate(
        {_id: req.params.id},
        {
            $set: {angebotsstatus : "Abrechnung erstellt"}
        },
        function (err, doc) {
            if (!doc)
                return next(new Error('Event not found'));
            else if (doc.angebotsstatus === 'Angebot akzeptiert') {
                transport.sendMail({
                    from: 'management@vms.de',
                    to: doc.veranstalter,
                    subject: 'Ihre Abrechnung zur Veranstaltung ' + doc.titel,
                    text: 'Sehr geehrter Veranstalter, \nanbei erhalten Sie Ihre Abrechnung zu oben genannter Veranstaltung. Bitte überweisen Sie den Betrag spätestens 10 Tage nach erhalt dieser Abrechnung an unsere Bankverbindung: DE12333456665444433456. \n \n Ausmachender Betrag: '
                        + doc.veranstalter_preis +
                        '\n Verwendungszweck: ' + doc.id +
                        '\n Wir freuen uns auf Ihre nächste Buchung! \n Mit freundlichen Grüßen \n Das VMS '


                })
            } else if(doc.angebotsstatus=== 'Intern'){
                doc.teilnehmer.every(e => {

                    Teilnehmer.findById({_id:e}, 'email', function(err,usermail){
                   let tMail = usermail.email
                    transport.sendMail({
                        from: 'management@vms.de',
                        to: tMail,
                        subject: 'Ihre Abrechnung zur Veranstaltung ' + doc.titel,
                        text: 'Sehr geehrter Teilnehmer, \nanbei erhalten Sie Ihre Abrechnung zu oben genannter Veranstaltung. Bitte überweisen Sie den Betrag spätestens 10 Tage nach erhalt dieser Abrechnung an unsere Bankverbindung: DE12333456665444433456. \n \n Ausmachender Betrag: '
                            + doc.teilnehmer_preis +
                            '\n Verwendungszweck: ' + doc.id +
                            '\n Wir freuen uns auf Ihre nächste Buchung! \n Mit freundlichen Grüßen \n Das VMS '
                    })

                    })
                    return true
                })
            }
            console.log(doc.teilnehmer)
            console.log(doc.veranstalter_preis)
            console.log(doc.teilnehmerzahl)
            console.log(doc.teilnehmer_preis)

            res.status(200).json({message: 'Abrechnung wurde erfolgreich abgeschickt!'});

            console.log('Status geändert')
        }
    )})





//raumauslastung statistik
veranstaltungsController.post('/statistik/raumauslastung', function (req, res){
    const todayMoment = moment()
    const tomorrowMoment = todayMoment.clone().add(1,'days')
    const arrayVeranstaltungen = [];
    Veranstaltung.find( function (err, veranstaltung) {
        foundevents = veranstaltung;
        console.log(foundevents);
        foundevents.forEach(event => {
            range1 = moment.range(event.start_datum, event.end_datum)
            if(range1.contains(todayMoment) || (todayMoment === event.start_datum) || (todayMoment === event.end_datum)){
                arrayVeranstaltungen.push(event)
            }
        })
        if(err){
            res.status(500).json({message: 'Etwas ist schiefgelaufen '})
        }else{
            Raum.find(function (err, raum){
                res.send(JSON.stringify((1- arrayVeranstaltungen.length / raum.length)*100));
            })
        }
    })
})



module.exports = veranstaltungsController;

