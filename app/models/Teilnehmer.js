var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var router = require('../routes/routes')
var uniqueValidator = require('mongoose-unique-validator');
var jwt = require('jsonwebtoken');

var teilnehmerSchema = new Schema({
    name: {type: String,
            required: 'name can\'t be empty '},
    vorname:{type:String,
            required: 'vorname can\'t be empty'},
    email:{type:String,
            required: 'email can\'t be empty',
            unique: true,
            trim: true,
            uniqueCaseInsensitive: true},
    password:{type:String,
            minlength: [5, 'Passwort zu kurz!']},
});

teilnehmerSchema.plugin(uniqueValidator,{message: '{PATH} wurde bereits registriert !'});

//Email Validation
teilnehmerSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');


//erstelle Token
teilnehmerSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        name: this.name,
        vorname: this.vorname,
        email: this.email,
        exp: parseInt(expiry.getTime() / 1000),
    }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

// Erstellt das benötigte Schema mit Name, Schema und der zugehörigen Collection!
const Teilnehmer = mongoose.model('Teilnehmer', teilnehmerSchema, 'teilnehmer');
module.exports = Teilnehmer;
