var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let Raum = require('../models/Raum');
let Veranstalter = require('../models/Veranstalter');


var veranstaltungSchema = new Schema({
    titel: {type: String},
    //raum_nr: {type: Number},
    /*
    start_datum: {type: Date},
    end_datum: {type: Date},

     */
    teilnehmerzahl: {type: Number},
    veranstalter_preis: {type: Number},
    teilnehmer_preis: {type: Number},
    sichtbarkeit: {type: Boolean},
    angebotsstatus: {type: String},

    veranstalter: [{  // wird ja eig wie auch raum vom management ausgewählt
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Veranstalter'
    }],

}, {collection : "Veranstaltung"});

// Erstellt das benötigte Schema mit Name, Schema und der zugehörigen Collection!
module.exports = mongoose.model('Veranstaltung', veranstaltungSchema);














