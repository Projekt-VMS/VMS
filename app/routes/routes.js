var express = require('express');
var router = express.Router();
var path = require('path');


//app.use('/api', apiRouter);
//app.use('/', router);



// home route
router.get ('/registration', function(req, res) {
    res.sendFile('registration.html',{root:'./vms/src/views/teilnehmer'})
});


// teilnehmer route
router.get ('/teilnehmer', function(req, res) {
    res.send('login');
});

//teilnehmer register
router.get ('/teilnehmer/register', function(req, res) {
    res.send('Admin register')
    //  res.render('teilnehmer/register');
});

//teilnehmer profilzugriff
router.get ('/teilnehmer/profile', function (req, res){

});

module.exports = router;
