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

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.connect('mongodb://localhost:27017/', {useNewUrlParser: true, useUnifiedTopology: true}); mongoose.connection.once('open', ()=>console.log('Mit Datenbank verbunden'));
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

app.post('api/Teilnehmer', function(req, res){
// Überprüfen, ob die notwendigen Daten übermittelt wurden.
  if(!req.body || !req.body.id || !req.body.name){
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