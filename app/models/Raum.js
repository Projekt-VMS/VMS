var mongoose = require('mongoose');
var validate = require('mongoose-validator');
mongoose.set('useCreateIndex', true);

// Raumgröße
var sizeValidator = {
    validator: "matches",
    arguments: [5,100],
    message: "Raum muss mindestens 5 Plätze, aber max. 100 Plätze haben."
}

var raumSchema = mongoose.Schema({
    kapazitaet: {type: Number, required: true, validate: sizeValidator},
    raumpreis: {type: Number, required: true},
}, {collection : "Raum"});


module.exports = mongoose.model('Raum', raumSchema);
