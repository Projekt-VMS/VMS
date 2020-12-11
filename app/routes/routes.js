var express = require('express');
var router = express.Router();
var path = require('path');


//app.use('/api', apiRouter);
//app.use('/', router);

// home route
router.get ('/', function(req, res) {
    res.send('homepage');
});

// admin route
router.get ('/admin', function(req, res) {
    res.send('login');
});

//admin register
router.get ('/admin/register', function(req, res) {
    res.send('Admin register')
    //  res.render('admin/register');
});

//admin profilzugriff
router.get ('/admin/profile', function (req, res){

});

module.exports = router;
