const express = require('express');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const raumController = require('./app/controllers/raum.controller');
const teilnehmerController  = require ('./app/controllers/teilnehmer.controller');
const managementController = require ('./app/controllers/management.controller');
const veranstalterController = require ('./app/controllers/veranstalter.controller');
const veranstaltungsController = require ('./app/controllers/veranstaltung.controller');


app.set('view engine', 'html');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(teilnehmerController);
app.use(managementController);
app.use(veranstalterController);

app.use(raumController);
app.use(veranstaltungsController);

//var routes = require('./app/routes/routes.js');

//app.use('/', routes);




const Veranstalter = require("./app/models/Veranstalter");
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
});

app.listen(PORT, function(){
    console.log('Server running at port:'+PORT);
});






mongoose.connect('mongodb+srv://admin:0Sr3xN6OfhVQzMK3@vms.eucj6.mongodb.net/VMS?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.once('open', ()=>console.log('Mit Datenbank verbunden'));



// home
app.get ('/', function(req, res) {
    res.send('homepage')
});



