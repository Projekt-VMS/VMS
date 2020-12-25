var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var jwt = require('jsonwebtoken');

var adminSchema = new Schema({
    email:{type:String,
        required: 'email can\'t be empty',
        unique: true,
        trim: true,
        uniqueCaseInsensitive: true},
    password:{type:String,
        minlength: [5, 'Passwort zu kurz!']},
});

//Email Validation
adminSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');


//erstelle Token
adminSchema.methods.generateJwt = function() {
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
const Admin = mongoose.model('Admin', adminSchema, 'admin');
module.exports = Admin;
