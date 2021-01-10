var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teilnehmerSchema = new Schema({
    name: {type: String,
            required: 'name can\'t be empty '},
    vorname:{type:String,
            required: 'vorname can\'t be empty'},
    email:{type:String,
            required: 'email can\'t be empty'},
    password:{type:String,
            required: 'password can\'t be empty'}
});

const Teilnehmer = mongoose.model('Teilnehmer', teilnehmerSchema, 'teilnehmer');
module.exports = Teilnehmer;
