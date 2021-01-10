var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let today = new Date();

var veranstaltungSchema = new Schema({
    titel: {type: String},
    veranstalter: {
        type: mongoose.Schema.Types.String,
        ref: 'Veranstalter',
    },
    raum: {
        type: mongoose.Schema.Types.Number,
        ref: 'Raum'
    },
    teilnehmer: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teilnehmer',

    }],
    veranstalter_preis:{type: Number},
    start_datum: {type: Date, min: today},
    end_datum:{type: Date},
    teilnehmerzahl: {type: Number},
    teilnehmer_preis: {type: Number},
    sichtbarkeit: {type: String},
    angebotsstatus: {type: String},
    leistung: {type: String, default: 'keine Zusatzleistungen'}
});

// Erstellt das benötigte Schema mit Name, Schema und der zugehörigen Collection!
const Veranstaltung = mongoose.model('Veranstaltung', veranstaltungSchema, 'veranstaltungen');
module.exports = Veranstaltung;















