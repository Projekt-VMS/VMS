const express = require('express');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const raumController = require('./app/controllers/raum.controller');
const teilnehmerController  = require ('./app/controllers/teilnehmer.controller');
const managementController = require ('./app/controllers/management.controller');
const veranstalterController = require ('./app/controllers/veranstalter.controller');
const veranstaltungsController = require ('./app/controllers/veranstaltung.controller');
const adminController = require ('./app/controllers/admin.controller')
const authController = require("./app/controllers/authentication");

require ('./app/config/passport')(passport);

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

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Controller
app.use(teilnehmerController);
app.use(managementController);
app.use(veranstalterController);
app.use(adminController);

app.use(authController);

app.use(raumController);
app.use(veranstaltungsController);

app.use(express.static('static'));


//var routes = require('./app/routes/routes.js');

//app.use('/', routes);




/*const Veranstalter = require("./app/models/Veranstalter");
const Veranstaltung = require("./app/models/Veranstaltung");
const Raum = require("./app/models/Raum");


app.use("/",async (req, res) => {
    await Veranstalter.remove({});
    await Veranstalter.create({
        name: 'andy',
        vorname: 'test1',
        unternehmen: 'google',
        email: 'test12345@1234.de',
        passwort: 'müller1'
    });

    await Raum.remove({});
    await Raum.create({
        raumNr: 2,
        kapazitaet: 15,
        raumpreis: 100
    });

    await Veranstaltung.remove({});
    await Veranstaltung.create({
        titel: 'Test Event 01',
        raum: await  Raum.findOne({raumNr: 2}),
        veranstalter: await Veranstalter.findOne({name: 'andy'}),
        teilnehmerzahl: 8,
        veranstalter_preis: 400,
        teilnehmer_preis: 25,
        sichtbarkeit: true,
        angebotsstatus: 'Angebot akzeptiert'
    });


    res.json({
        veranstalterTest: await Veranstalter.find(),
        raumTest: await Raum.find(),
        veranstaltungTest: await Veranstaltung.find().populate('Veranstalter').populate('Raum'),
        veranstalterTest2: await Veranstalter.find()
    });
});*/

app.listen(PORT, function(){
    console.log('Server running at port:'+PORT);
});






mongoose.connect('mongodb+srv://admin:0Sr3xN6OfhVQzMK3@vms.eucj6.mongodb.net/VMS?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.once('open', ()=>console.log('Mit Datenbank verbunden'));



// home
// app.get ('/', function(req, res) {
//     res.render('/VMS_Frontend-main/static/index.html');
// });


