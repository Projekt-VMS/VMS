const raumSchema = require("mongodb/lib/collection");
var mongoose = require('mongoose');

class Raum {
    constructor(kapazitaet, raumpreis) {
        this.kapazitaet = kapazitaet;
        this.raumpreis = raumpreis;
    }
    create(kapazitaet, raumpreis){

        let raumInstance = new Raum(kapazitaet, raumpreis);

        raumInstance.save()
                .catch(err=>{
                console.log(err.toString());
                res.status(500).send(err.toString()); })
                .then(dbres=>{

                    console.log(dbres);
                    res.json(dbres);
                });
    }

    show(){
        raumSchema.find(function(err, data) {
            if(err){
                console.log(err);
            }
            else{
                res.send(data);
            }
        });
    }

    edit(){
        raumSchema.findAndModify()
    }

    delete(){

    }

}

