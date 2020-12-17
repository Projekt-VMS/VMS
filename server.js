const express = require('express');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const raumController = require('./app/controllers/raum.controller');
const teilnehmerController  = require ('./app/controllers/teilnehmer.controller');
const managementController = require ('./app/controllers/management.controller');

app.use(raumController);
app.use(teilnehmerController);
app.use(managementController);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'html');


//var routes = require('./app/routes/routes.js');

//app.use('/', routes);

app.listen(PORT, function(){
    console.log('Server running at port:'+PORT);
});


mongoose.connect('mongodb+srv://admin:0Sr3xN6OfhVQzMK3@vms.eucj6.mongodb.net/VMS?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.once('open', ()=>console.log('Mit Datenbank verbunden'));



var Management = require('./app/models/Management.js');



var Veranstalter = require('./app/models/Veranstalter.js');

app.get('/Veranstalter', function(req, res){ Veranstalter.find()
    .catch(err=>{
        console.log(err.toString()); res.status(500).send(err.toString());
    })
    .then(dbres=>{

        console.log(dbres);
        res.send(dbres);
    });
});

app.post('/Veranstalter', function(req, res){

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


