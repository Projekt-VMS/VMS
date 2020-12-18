var express = require('express');
var router = express.Router();
var path = require('path');


//test raum
router.get ('/raum', function (req , res){
    res.sendFile('erstellen.raum.html',{root:'./app'})
});

// home
router.get ('/', function(req, res) {
    res.send('homepage')
});

// registration route
router.get ('/registration', function(req, res) {
    res.sendFile('registration.html',{root:'./vms/src/views/teilnehmer'})
});



module.exports = router;
