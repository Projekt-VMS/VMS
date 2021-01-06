const jwt = require('jsonwebtoken');
const express = require('express');
const authController = express();
const tokenArray = require ('./teilnehmer.controller');

/*function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, 'B6B5834672A21DC0C5B40800BDCE9945586DD5A8E33CF29701F0A323DE371601', (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        req.currentUser = user
        next()
    })
}*/

authController.get('/auth/check/:token', function (req, res){
    let token = req.params.token

    const wahr = {
        "boolean": "true"
    }
    const falsch = {
        "boolean": "false"
    }

    if (token === 'null') {
        return res.json(falsch);
    }

    jwt.verify(token, 'B6B5834672A21DC0C5B40800BDCE9945586DD5A8E33CF29701F0A323DE371601', (err, user) => {
        console.log(err)
        if (err) {return res.json(falsch)}
        else{
            console.log("user ist berechtigt")
            return res.json(wahr);
        }
    })
});

module.exports = authController;
//module.exports.authenticateToken = authenticateToken;

