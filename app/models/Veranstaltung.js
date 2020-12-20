var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let Raum = require('../models/Raum');
let Veranstalter = require('../models/Veranstalter');


var veranstaltungSchema = new Schema({
    titel: {type: String},
    veranstalter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Veranstalter'
    },
    raum: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Raum'
    },
    // teilnehmer: [ embedded]
    /*
    start_datum: {type: Date},
    end_datum: {type: Date},
     */
    teilnehmerzahl: {type: Number},
    veranstalter_preis: {type: Number},
    teilnehmer_preis: {type: Number},
    sichtbarkeit: {type: Boolean},
    angebotsstatus: {type: String},

});

// Erstellt das benötigte Schema mit Name, Schema und der zugehörigen Collection!
const Veranstaltung = mongoose.model('Veranstaltung', veranstaltungSchema, 'veranstaltungen');
module.exports = Veranstaltung;














