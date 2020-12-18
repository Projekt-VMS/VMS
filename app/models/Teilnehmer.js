var mongoose = require('mongoose');
var router = require('../routes/routes')
var uniqueValidator = require('mongoose-unique-validator');

var teilnehmerSchema = mongoose.Schema({
    name: {type: String,
            required: 'name can\'t be empty '},
    vorname:{type:String,
            required: 'vorname can\'t be empty'},
    email:{type:String,
            required: 'email can\'t be empty',
            unique: true,
            trim: true,
            uniqueCaseInsensitive: true},
    passwort:{type:String,
                minlength: [5, 'Passwort zu kurz!']}
}, {collection : "Teilnehmer"});
teilnehmerSchema.plugin(uniqueValidator,{message: '{PATH} wurde bereits registriert !'});

//Email Validation
teilnehmerSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');




// Erstellt das benötigte Schema mit Name, Schema und der zugehörigen Collection!
var Teilnehmer = mongoose.model('teilnehmer', teilnehmerSchema);


/*router.post('/registration', function(req, res){
// Überprüfen, ob die notwendigen Daten übermittelt wurden.
    if(!req.body.name || !req.body.vorname || !req.body.email || !reqbody.passwort){
        return res.status(400).send('Der Datensatz ist unvollständig!');
    }
// Neuen Teilnehmer anlegen.
    let teilnehmerInstance = new Teilnehmer(req.body);
// Teilnehmer in Datenbank ablegen.
    teilnehmerInstance.save()
        .catch(err=>{
            console.log(err.toString());
            res.status(500).send(err.toString()); })
        .then(dbres=>{
// Gibt die eingetragenen Werte zurück.
            console.log(dbres);
            res.json(dbres);
        });
});*/

// Export für externen Aufruf
module.exports = Teilnehmer;
