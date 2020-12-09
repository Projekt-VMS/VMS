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

