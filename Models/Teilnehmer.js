const mongoose = require('mongoose');
// Bildet die Dokumentenstruktur der Collection Teilnehmertabelle ab.
const TeilnehmerSchema = mongoose.Schema({
    Name: String
});
// Erstellt das benötigte Schema mit Name, Schema und der zugehörigen Collection!
const Teilnehmer = mongoose.model('Teilnehmer', TeilnehmerSchema, 'teilnehmer');
// Export für externen Aufruf
module.exports = Teilnehmer;