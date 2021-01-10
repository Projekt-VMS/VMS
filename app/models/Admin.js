var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adminSchema = new Schema({
    email:{type:String,
        required: 'email can\'t be empty',
        unique: true,
        trim: true,
        uniqueCaseInsensitive: true},
    password:{type:String,
        minlength: [5, 'Passwort zu kurz!']},
});

// Erstellt das benötigte Schema mit Name, Schema und der zugehörigen Collection!
const Admin = mongoose.model('Admin', adminSchema, 'admin');
module.exports = Admin;
