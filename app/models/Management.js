var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var managementSchema = new Schema({
    name: {type: String,
            required: 'name can\'t be empty '},
    vorname:{type:String,
            required: 'vorname can\'t be empty'},
    email:{type:String,
            required: 'email can\'t be empty'},
    password:{type:String,
            required: 'email can\'t be empty'},
});

const Management = mongoose.model('Management', managementSchema, 'managements');
module.exports = Management;
