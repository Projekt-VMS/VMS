var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var veranstaltungSchema = new Schema({
    titel: {type: String},
    start_datum: {type: Date},
    end_datum: {type: Date},
    teilnehmerzahl: {type: Number},
    veranstalter_preis: {type: Number},
    teilnehmer_preis: {type: Number},
    sichtbarkeit: {type: Boolean},
    angebotsstatus: {type: String},

    veranstalter: [{
        type: Schema.Types.ObjectId,
        ref: 'Veranstalter',

    }],
    raum: [{
        type: Schema.Types.ObjectId,
        ref: 'Raum',

    }]
}, {collection : "Veranstaltung"});

// Erstellt das benötigte Schema mit Name, Schema und der zugehörigen Collection!
module.exports = mongoose.mode('veranstaltung', veranstaltungSchema);














