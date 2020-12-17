var mongoose = require('mongoose');
var router = require('../routes/routes')

var teilnehmerSchema = mongoose.Schema({
    name: {type: String},
    vorname:{type:String},
    email:{type:String},
    passwort:{type:String}
}, {collection : "Teilnehmer"});





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
