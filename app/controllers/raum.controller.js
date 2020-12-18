const express = require('express'),
    raumController = express();


let Raum = require('../models/Raum');


raumController.get(('/raum'), function (req , res){
    res.sendFile('erstellen.raum.html',{root:'./app/view/'})
});

//list all

raumController.get('/raum/list', function(req, res){
    Raum.find()
    .catch(err=>{
        console.log(err.toString()); res.status(500).send(err.toString());
    })
    .then(dbres=>{
        console.log(dbres);
        res.send(dbres);
    });
});

//show one

raumController.get('/raum/show/:id', function (req, res) {
        Raum.findOne()
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
raumController.delete('/raum/delete/:id', function (req, res) {

    const { id } = req.params.id;
    console.log(id);
    Raum.findOneAndDelete({
        _id: id,
    })
        .exec((err, raum) => {
            if(err)
                return res.status(500).json({code: 500, message: 'There was an error deleting the raum', error: err});
            else {
                res.status(200).json({code: 200, message: 'raum deleted', deletedRaum: raum});
            }
            });
});


// update
raumController.put('/raum/edit/:id',function (req, res) {

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

