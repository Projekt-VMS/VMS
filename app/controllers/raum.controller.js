const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
const express = require('express'),
    raumController = express();

let Raum = require('../models/Raum');
let Veranstaltung = require ('../models/Veranstaltung');


//list all

raumController.get('/raum/show', function(req, res){
    Raum.find()
    .catch(err=>{
        console.log(err.toString());
        res.status(500).send(err.toString());
    })
    .then(dbres=>{
        res.send(dbres);
    });
});

//show one

raumController.get('/raum/showOne/:id', function (req, res) {
        Raum.findOne({_id: req.params.id})
        //let raum = Raum["customer" + req.params.id];
        //res.end( "Find a Customer:\n" + JSON.stringify(raum, null, 4));

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

raumController.post('/raum/add',function (req, res) {

//     console.log(req.body.kapazitaet)
//     let raumInstance = new Raum();
//     raumInstance.kapazitaet = req.body.kapazitaet
//                    raum =  Raum.findOne(raumNummer: req.body.raumnummer)
// raumInstance.raum = raum.id
//     console.log(raumInstance);
    let raumInstance = new Raum(req.body);
    raumInstance.save()
        .then(raumInstance => {
            res.status(200).json({ 'Success': true })
        })
        .catch(err => {
            res.status(400).send({ 'Success': false, 'Message': 'Error occured while creating new Raum' });
        });

});

//delete
raumController.delete('/raum/delete/:id', function (req, res, next) {

    Raum.findByIdAndRemove({_id: req.params.id},function(err, raum){

        if (err)
            return next (new Error('raum not found'));
        else {
            res.send('Raum ' + raum.raumNr + ' wurde gelöscht' );
        }
    });
});


// update
raumController.put('/raum/edit/:id',function (req, res, next) {

    Raum.findByIdAndUpdate(
        {_id: req.params.id},
        {
            kapazitaet: req.body.kapazitaet,
            raumpreis: req.body.raumpreis
        },
        function (err, raum) {
            if (!raum)
                return next(new Error('raum not found'));
            else {
                console.log(raum);
                res.send(raum);
            }
        });

});

// verfügbarkeit prüfen

raumController.post('/raum/verfuegbarkeit/:id', function (req, res) {
    let foundevents;
    let range1;
    let range2;
    let result2;
    result2 = false;

    Veranstaltung.find({raum: req.body.raum}, 'start_datum end_datum raum', function (err, veranstaltung) { //this looks up all events where the specified room is assigned to

        if (veranstaltung.length !==0) {
            foundevents = veranstaltung //saves all found events as arrays to foundevents
            //foundevents.forEach(event => { //as long as result is false there is no overlap; complete array of matching rooms is searched until overlap is found or end of array is reached
            foundevents.every(event => {
                range1 = moment.range(req.body.start_datum, req.body.end_datum) //dates to check are passed in
                range2 = moment.range(event.start_datum, event.end_datum) //these are the dates of the exisiting event
                result2 = range1.overlaps(range2) //ranges are checked for overlap; result 2 is updated
                console.log(foundevents.start_datum)
                console.log(req.body.start_datum)
                if (result2 !== false) { //if there is an overlap, break
                    return false;
                }
                if (result2 === undefined) { //if result2 is undefined, break
                    return false;
                }


            })
            if (result2 === false) { //if overlap is not existing, room is available
                res.send("Der Raum " + req.body.raum + " ist im gewünschten Zeitraum verfügbar.")
            } else {//if overlap is true, room is not available
                res.send("Der Raum " + req.body.raum + " ist im gewünschten Zeitraum nicht verfügbar. Bitte versuchen Sie ein anderes Datum oder einen andern Raum.")
            }
        }
        else {res.status(500).send("Dieser Raum existiert nicht!")}//if room is not found, send error msg
        });
});


module.exports = raumController;

