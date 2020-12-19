const express = require('express'),
    managementController = express();


let Management = require('../models/Management');

//list all

managementController.get('/management/show', function(req, res){
    Management.find()
    .catch(err=>{
        console.log(err.toString()); res.status(500).send(err.toString());
    })
    .then(dbres=>{

        console.log(dbres);
        res.send(dbres);
    });
});

//show one

managementController.get('/management/show/:id', function (req, res) {
    Management.findOne()
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

// create


managementController.post('/management/registration/add', function (req, res) {
    console.log('erstelle Management User');

    let managementInstance = new Management(req.body);

    console.log(managementInstance);

    managementInstance.save((err, doc) =>{
        if (!err){
            res.send('Management User wurde  erfolgreich registriert!');}
        else  {console.log(err.toString());
            res.status(500).send(err.toString()); }

    });

});

//delete
managementController.delete('/management/delete/:id', function (req, res, next) {

    Management.findByIdAndRemove({_id: req.params.id},function(err, id){

        if (err){
            return next (new Error('user not found'))}
        else {
            res.send('User ' + id.email + ' wurde gelöscht' );
        }
    });
});

//Update
managementController.put('/management/edit/:id',function (req, res, next) {

    Management.findByIdAndUpdate(
        {_id: req.params.id},
        {
            name: req.body.name,
            vorname: req.body.vorname,
            email: req.body.email,
            passwort: req.body.passwort
        },
        function (err, managementuser) {
            if (!managementuser)
                return next(new Error('user not found'));
            else {
                res.send(managementuser);
            }
        });
});

module.exports = managementController;
