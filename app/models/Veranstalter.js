var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var veranstalterSchema = new Schema({
    name: { type: String,
            required: 'name can\'t be empty '},
    vorname: {type: String,
            required: 'name can\'t be empty '},
    unternehmen: { type: String,
            required: 'name can\'t be empty '},
    email:{type:String,
            required: 'email can\'t be empty'},
    password:{type:String,
            required: 'email can\'t be empty'}
});

const Veranstalter = mongoose.model ("Veranstalter", veranstalterSchema, 'veranstalter');
module.exports = Veranstalter;
