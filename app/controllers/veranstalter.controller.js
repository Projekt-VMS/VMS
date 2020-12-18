const express = require('express'),
    veranstalterController = express.Router();

let Veranstalter = require('../models/Veranstalter');


//show veranstalter

veranstalterController.get('/veranstalter/show', function(req, res){ Veranstalter.find()
    .catch(err=>{
        console.log(err.toString()); res.status(500).send(err.toString());
    })
    .then(dbres=>{

        console.log(dbres);
        res.send(dbres);
    });
});

//create

veranstalterController.post('/veranstalter/registration', function(req, res){

    if(!req.body || !req.body.name){
        return res.status(400).send('Der Datensatz ist unvollständig!');
    }

    let veranstalterInstance = new Veranstalter(req.body);

    veranstalterInstance.save()
        .catch(err=>{
            console.log(err.toString());
            res.status(500).send(err.toString()); })
        .then(dbres=>{

            console.log(dbres);
            res.json(dbres);
        });
});


module.exports = veranstalterController;
