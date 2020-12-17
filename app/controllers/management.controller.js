const express = require('express'),
    managementController = express.Router();


let Management = require('../models/Management');

//list managementarbeiter

managementController.get('/management', function(req, res){ Management.find()
    .catch(err=>{
        console.log(err.toString()); res.status(500).send(err.toString());
    })
    .then(dbres=>{

        console.log(dbres);
        res.send(dbres);
    });
});

// create

managementController.post('/management/add', function(req, res){

    if(!req.body || !req.body.name){
        return res.status(400).send('Der Datensatz ist unvollständig!');
    }

    let managementInstance = new Management(req.body);

    managementInstance.save()
        .catch(err=>{
            console.log(err.toString());
            res.status(500).send(err.toString()); })
        .then(dbres=>{

            console.log(dbres);
            res.json(dbres);
        });
});

module.exports = managementController;
