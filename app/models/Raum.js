var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection('mongodb+srv://admin:0Sr3xN6OfhVQzMK3@vms.eucj6.mongodb.net/VMS?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
var Schema = mongoose.Schema;


autoIncrement.initialize(connection);

// Raumgröße
var sizeValidator = [
    validate({
        validator: "matches",
        arguments: [5, 100],
        message: "Raum muss mindestens 5 Plätze, aber max. 100 Plätze haben."
    }),
]

var raumSchema = new Schema({
    raum_ID: {type: Schema.Types.ObjectId},
    kapazitaet: {type: Number, required: true, validate: sizeValidator},
    raumpreis: {type: Number, required: true},
}, {collection : "Raum"});

raumSchema.plugin(autoIncrement.plugin, 'raum_ID');
var Raum = connection.model('Raum', raumSchema);
module.exports = mongoose.model('Raum', raumSchema);
