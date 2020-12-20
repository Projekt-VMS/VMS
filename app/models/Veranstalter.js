var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var validate = require('mongoose-validator');
var Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);


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
    passwort:{type:String, minlength: [5, 'Passwort zu kurz!']},
    veranstaltungen: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Veranstaltung'
    }]
},{timestamps: true});


/*
veranstalterSchema.virtual('Veranstaltungen', {
    ref: 'Veranstaltung',
    localField: '_id', //Find in Model, where localField
    foreignField: 'Veranstalter'
});

veranstalterSchema.set('toObject', { virtuals: true });
veranstalterSchema.set('toJSON', { virtuals: true });


 */

veranstalterSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password')) return next(); // If password was not changed or is new, ignore middleware

    // Function to encrypt password
    bcrypt.hash(user.password, null, null, function(err, hash) {
        if (err) return next(err); // Exit if error is found
        user.password = hash; // Assign the hash to the user's password so it is saved in database encrypted
        next(); // Exit Bcrypt function
    });
});

//Email Validation
veranstalterSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

const Veranstalter = mongoose.model ("Veranstalter", veranstalterSchema, 'veranstalter');
module.exports = Veranstalter;
