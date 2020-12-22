const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const Teilnehmer = require('../models/Teilnehmer');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField: 'email'}, (email, password, done) =>{
            Teilnehmer.findOne({email: email})
                .then(user =>{
                    if(!user){
                        return done(null, false, {message: "Die Email konnte nicht gefunden werden."});
                    }
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Password incorrect' });
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        Teilnehmer.findById(id, function(err, user) {
            done(err, user);
        });
    });
};


