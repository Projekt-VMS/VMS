var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var validate = require('mongoose-validator');
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


var veranstalterSchema = mongoose.Schema({
    name: { type: String, required: true, validate: nameValidator },
    vorname: {type: String, required: true, validate: firstNameValidator },
    unternehmen: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, unique: true, validate: emailValidator },
    passwort: { type: String, required: true, validate: passwordValidator, select: false },
}, {collection : "Veranstalter"});


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

module.exports = mongoose.model('Veranstalter', veranstalterSchema); // Export User Model for us in API
