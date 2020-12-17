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
        required: true
    }],
    raum: [{
        type: Schema.Types.ObjectId,
        ref: 'Raum',
        required: true
    }]
},  {collection : "Veranstaltung"});

module.exports = mongoose.model('Veranstaltung', veranstaltungSchema);
