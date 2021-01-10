const express = require('express');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const bodyParser = require('body-parser');
const session = require('express-session');

const raumController = require('./app/controllers/raum.controller');
const teilnehmerController  = require ('./app/controllers/teilnehmer.controller');
const managementController = require ('./app/controllers/management.controller');
const veranstalterController = require ('./app/controllers/veranstalter.controller');
const veranstaltungsController = require ('./app/controllers/veranstaltung.controller');
const adminController = require ('./app/controllers/admin.controller')
const authController = require("./app/controllers/authentication");


app.set('view engine', 'html');

//Body parser

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

// Controller
app.use(teilnehmerController);
app.use(managementController);
app.use(veranstalterController);
app.use(adminController);

app.use(authController);

app.use(raumController);
app.use(veranstaltungsController);

app.use(express.static('static'));


app.listen(PORT, function(){
    console.log('Server running at port:'+PORT);
});

mongoose.connect('mongodb+srv://admin:0Sr3xN6OfhVQzMK3@vms.eucj6.mongodb.net/VMS?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.once('open', ()=>console.log('Mit Datenbank verbunden'));




