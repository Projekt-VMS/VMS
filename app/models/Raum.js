var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var raumSchema = new Schema({
    raumNr: {type: Number, required: true},
    kapazitaet: {type: Number, required: true},
    raumpreis: {type: Number, required: true},
    veranstaltung: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Veranstaltung'
    }
});


const Raum =  mongoose.model('Raum', raumSchema, 'räume');
module.exports = Raum;
