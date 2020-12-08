const mongoose = require('mongoose');
// Bildet die Dokumentenstruktur der Collection Kundentabelle ab.
const TeilnehmerSchema = mongoose.Schema({
    id: Number,
    Name: String
});
// Erstellt das benötigte Schema mit Name, Schema und der zugehörigen Collection!
const Teilnehmer = mongoose.model('Kunde', TeilnehmerSchema, 'kunden');
// Export für externen Aufruf
module.exports = Teilnehmer;