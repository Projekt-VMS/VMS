const express = require('express');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//app.set('view engine', 'ejs');
app.set('view engine', 'html');
//app.engine('html', require('ejs').renderFile)
var routes = require('./app/routes/routes.js');
app.use('/', routes);
app.listen(PORT, function(){
    console.log('Server running at port:'+PORT);
});




mongoose.connect('mongodb+srv://admin:0Sr3xN6OfhVQzMK3@vms.eucj6.mongodb.net/VMS?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.once('open', ()=>console.log('Mit Datenbank verbunden'));


//wollte diese Funktion auch in Model Teilnehmer hängen, Registration funktioniert dann aber nicht mehr
var Teilnehmer = require('./app/models/Teilnehmer')
app.get('/teilnehmer', function(req, res){ Teilnehmer.find()
    .catch(err=>{
        console.log(err.toString()); res.status(500).send(err.toString());
    })
    .then(dbres=>{
        // Ergebnis zurückgeben.
        console.log(dbres);
        res.send(dbres);
    });
});
var Management = require('./app/models/Management.js');

app.get('/Management', function(req, res){ Management.find()
    .catch(err=>{
        console.log(err.toString()); res.status(500).send(err.toString());
    })
    .then(dbres=>{

        console.log(dbres);
        res.send(dbres);
    });
});

app.post('/Management', function(req, res){

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
