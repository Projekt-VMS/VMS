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
    Raum.find({raumNr: req.body.raumNr}, function (err, doc) {
        let raum = doc
        console.log (raum.length)
        if (raum.length  > 0) {
            res.status(400).send({message: 'Dieser Raum existiert bereits.'})
        } else {
            raumInstance.save((err, doc) => { //saves room
                if (!err) {
                    console.log("success!")
                    res.status(200).json({message: 'Raum wurde erfolgreich erstellt!'});
                }
            })
        }
    })
})





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
        {$set: req.body
        },
        function (err, raum) {
            if (!raum)
                return next(new Error('raum not found'));
            else {

                res.status(200).json({message: 'Raum ' + raum.raumNr + ' wurde erfolgreich überschrieben'});
            }
        });

});

// verfügbarkeit prüfen

raumController.post('/raum/verfuegbarkeit/:id', function (req, res) {
    let veranstaltung;
    let range1;
    let range2;
    let result2;
    result2 = false;
    Raum.findOne({_id: req.params.id}, function (err, raum){
        if(err){
            res.status(500).json({message: 'Der Raum existiert nicht!'})
        }else{
            let raumNummer = raum.raumNr;
            console.log('test' + raumNummer)
            Veranstaltung.find({raum: raumNummer}, function (err, veranstaltung){
                console.log(veranstaltung)
                if(err){
                    res.status(200).json({message: 'Der Raum ' + raumNummer + ' ist im gewünschten Zeitraum verfügbar.'});
                }else{
                    veranstaltung.every(event => {
                            range1 = moment.range(req.body.start_datum, req.body.end_datum) //dates to check are passed in
                            range2 = moment.range(event.start_datum, event.end_datum) //these are the dates of the exisiting event
                            result2 = range1.overlaps(range2) //ranges are checked for overlap; result 2 is updated
                            console.log(veranstaltung.start_datum)
                            console.log(req.body.start_datum)
                            if (result2 !== false) { //if there is an overlap, break
                                return false;
                            }
                            if (result2 === undefined) { //if result2 is undefined, break
                                return false;
                            }
                    })
                        if (result2 === false) { //if overlap is not existing, room is available
                            res.status(200).json({message: 'Der Raum ' + raumNummer + ' ist im gewünschten Zeitraum verfügbar.'})
                        } else {//if overlap is true, room is not available
                            res.status(200).json({message: "Der Raum " + raumNummer + " ist im gewünschten Zeitraum nicht verfügbar. Bitte versuchen Sie ein anderes Datum oder einen andern Raum."})
                        }
                }
            });
        }
    })
});


module.exports = raumController;

