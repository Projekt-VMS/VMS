const express = require('express');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const raumController = require('./app/controllers/raum.controller');
const teilnehmerController  = require ('./app/controllers/teilnehmer.controller');
const managementController = require ('./app/controllers/management.controller');
const veranstalterController = require ('./app/controllers/veranstalter.controller');


app.set('view engine', 'html');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(teilnehmerController);
app.use(managementController);
app.use(veranstalterController);

app.use(raumController);

//var routes = require('./app/routes/routes.js');

//app.use('/', routes);

app.listen(PORT, function(){
    console.log('Server running at port:'+PORT);
});


mongoose.connect('mongodb+srv://admin:0Sr3xN6OfhVQzMK3@vms.eucj6.mongodb.net/VMS?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.once('open', ()=>console.log('Mit Datenbank verbunden'));



// home
app.get ('/', function(req, res) {
    res.send('homepage')
});



