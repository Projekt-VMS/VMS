var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validate = require('mongoose-validator');
var uniqueValidator = require('mongoose-unique-validator');
var jwt = require('jsonwebtoken');

// User Name Validator
var nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
        message: 'Name darf keine Sonderzeichen oder Zahlen enthalten.'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 20],
        message: 'Name muss mindestens 3 bis max. 20 Stellen haben'
    })
];
var firstNameValidator = [
    validate({
        validator: 'matches',
        arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
        message: 'Vorname darf keine Sonderzeichen oder Zahlen enthalten.'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 20],
        message: 'Vorname muss mindestens 3 bis max. 20 Stellen haben'
    })
];

// User E-mail Validator
var emailValidator = [
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,40}$/,
        message: 'Email darf keine Sonderzeichen oder Zahlen enthalten.'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 40],
        message: 'Email muss mindestens 3 bis max. 40 Stellen haben.'
    })
];

// Password Validator

var passwordValidator = [
    validate({
        validator: 'matches',
        arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/,
        message: 'Passwort muss mindestens einen Kleinbuchstaben, einen Großbuchstaben, eine Zahl und ein Sonderzeichen haben.'
    }),
    validate({
        validator: 'isLength',
        arguments: [8, 35],
        message: 'Passwort muss zwischen 8 bis 35 Zeichen haben.'
    })
];


var veranstalterSchema = new Schema({
    name: { type: String, required: 'name can\'t be empty '},
    vorname: {type: String, required: 'name can\'t be empty '},
    unternehmen: { type: String, required: 'name can\'t be empty '},
    email:{type:String, required: 'email can\'t be empty', unique: true, trim: true, uniqueCaseInsensitive: true},
    password:{type:String, minlength: [5, 'Passwort zu kurz!']},
    veranstaltungen: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Veranstaltung'
    }]

});


/*
veranstalterSchema.virtual('Veranstaltungen', {
    ref: 'Veranstaltung',
    localField: '_id', //Find in Model, where localField
    foreignField: 'Veranstalter'
});

veranstalterSchema.set('toObject', { virtuals: true });
veranstalterSchema.set('toJSON', { virtuals: true });


 */

veranstalterSchema.plugin(uniqueValidator,{message: '{PATH} wurde bereits registriert !'});

//Email Validation
veranstalterSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');


//token

veranstalterSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        name: this.name,
        vorname: this.vorname,
        unternehmen: this.unternehmen,
        email: this.email,
        exp: parseInt(expiry.getTime() / 1000),
    }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};


const Veranstalter = mongoose.model ("Veranstalter", veranstalterSchema, 'veranstalter');
module.exports = Veranstalter;
