var express = require('express');
var app = express();
var PORT = 3000;

app.set('view engine', 'ejs');

// Route für den Fall das ein GET-Request an '/' gesendet wird.
app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.listen(PORT, function(){
  console.log('Server running at port:'+PORT);
})

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
mongoose.connect('mongodb+srv://admin:0Sr3xN6OfhVQzMK3@vms.eucj6.mongodb.net/VMS?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.once('open', ()=>console.log('Mit Datenbank verbunden'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var Teilnehmer = require('./app/models/Teilnehmer.js');


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

app.post('/teilnehmer', function(req, res){
// Überprüfen, ob die notwendigen Daten übermittelt wurden.
  if(!req.body || !req.body.name){
    return res.status(400).send('Der Datensatz ist unvollständig!');
  }
// Neuen Teilnehmer anlegen.
  let teilnehmerInstance = new Teilnehmer(req.body);
// Teilnehmer in Datenbank ablegen.
  teilnehmerInstance.save()
      .catch(err=>{
        console.log(err.toString());
        res.status(500).send(err.toString()); })
      .then(dbres=>{
// Gibt die eingetragenen Werte zurück.
        console.log(dbres);
        res.json(dbres);
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
