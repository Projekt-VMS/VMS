const express = require('express'),
    veranstalterController = express();

let Veranstalter = require('../models/Veranstalter');


//list all

veranstalterController.get('/veranstalter/show', function(req, res){
    Veranstalter.find()
    .catch(err=>{
        console.log(err.toString()); res.status(500).send(err.toString());
    })
    .then(dbres=>{

        console.log(dbres);
        res.send(dbres);
    });
});

veranstalterController.get('/veranstalter/show/:id', function (req, res) {
    Veranstalter.findOne()
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

veranstalterController.post('/veranstalter/registration/add', function (req, res) {

    let veranstalterInstance = new Veranstalter(req.body);

    console.log(veranstalterInstance);

    veranstalterInstance.save((err, doc) =>{
        if (!err){
            res.send('Veranstalter User wurde erfolgreich registriert!');}
        else  {console.log(err.toString());
            res.status(500).send(err.toString()); }

    });

});

veranstalterController.delete('/veranstalter/delete/:id', function (req, res, next) {

    Veranstalter.findByIdAndRemove({_id: req.params.id},function(err, id){

        if (err){
            return next (new Error('user not found'))}
        else {
            res.send('User ' + id.email + ' wurde gelöscht' );
        }
    });
});

//Update
veranstalterController.put('/veranstalter/edit/:id',function (req, res, next) {

    Veranstalter.findByIdAndUpdate(
        {_id: req.params.id},
        {
            name: req.body.name,
            vorname: req.body.vorname,
            unternehmen: req.body.unternehmen,
            email: req.body.email,
            passwort: req.body.passwort
        },
        function (err, user) {
            if (!user)
                return next(new Error('user not found'));
            else {
                res.send(user);
            }
        });
});



module.exports = veranstalterController;
