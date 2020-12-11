var mongoose = require('mongoose');
// Bildet die Dokumentenstruktur der Collection Teilnehmertabelle ab.
var teilnehmerSchema = mongoose.Schema({
    Name: {type: String},
    Vorname:{type:String},
    Email:{type:String}
}, {collection : "Teilnehmer"});
// Erstellt das benötigte Schema mit Name, Schema und der zugehörigen Collection!
var Teilnehmer = mongoose.model('teilnehmer', teilnehmerSchema);
// Export für externen Aufruf
module.exports = Teilnehmer;