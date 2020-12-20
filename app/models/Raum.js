var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var autoIncrement = require('mongoose-auto-increment');
//var connection = mongoose.createConnection('mongodb+srv://admin:0Sr3xN6OfhVQzMK3@vms.eucj6.mongodb.net/VMS?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
var Schema = mongoose.Schema;


//autoIncrement.initialize(connection);

// Raumgröße
var sizeValidator = [
    validate({
        validator: "matches",
        arguments: [5, 100],
        message: "Raum muss mindestens 5 Plätze, aber max. 100 Plätze haben."
    }),
]

var raumSchema = new Schema({
    raumNr: {type: Number, required: true},
    kapazitaet: {type: Number, required: true},
    raumpreis: {type: Number, required: true},
    veranstaltung: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Veranstaltung'
    }
});

//raumSchema.plugin(autoIncrement.plugin, 'raumNr');


const Raum =  mongoose.model('Raum', raumSchema, 'räume');
module.exports = Raum;
