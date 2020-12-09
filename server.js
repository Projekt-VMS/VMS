const express = require('express');
const app = express();
const PORT = 3000;
// Route für den Fall das ein GET-Request an '/' gesendet wird.
app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.listen(PORT, function(){
  console.log('Server running at port:'+PORT);
})
var mongoURL = 'mongodb://132.231.36.103/VMS'
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.connect(mongoURL, {useNewUrlParser: true, useUnifiedTopology: true}); mongoose.connection.once('open', ()=>console.log('Mit Datenbank verbunden'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const Teilnehmer = require('./Models/Teilnehmer.js');

app.get('api/Teilnehmer', function(req, res){ Teilnehmer.find()
    .catch(err=>{
      console.log(err.toString()); res.status(500).send(err.toString());
    })
    .then(dbres=>{
      // Ergebnis zurückgeben.
      console.log(dbres);
      res.json(dbres);
    });
});

app.post('api/teilnehmer', function(req, res){
// Überprüfen, ob die notwendigen Daten übermittelt wurden.
  if(!req.body || !req.body.name){
    return res.status(400).send('Der Datensatz ist unvollständig!');
  }
// Neuen Kunden anlegen.
  let teilnehmerInstance = new Teilnehmer(req.body);
// Kunden in Datenbank ablegen.
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
