// var passport = require('passport');
// var mongoose = require('mongoose');
// var Teilnehmer = mongoose.model('Teilnehmer');
// require('passport-local');
// require ('/Users/dorian/Development/GitHub/VMS/app/config/passport.js');
//
//
//
// var sendJSONresponse = function(res, status, content) {
//     res.status(status);
//     res.json(content);
// };
//
//
//
// /*module.exports.login = function(req, res, next) {
//     if(!req.email || !req.password) {
//        sendJSONresponse(res, 400, {
//         "message": "All fields required"});
//       return;
//      }*/
//
//     /*passport.authenticate('local', {
//         successRedirect: '/',
//         failureRedirect: '/login'}, function (err, user, info)
//     {
//
//         console.log(user);
//         var token;
//
//         // If Passport throws/catches an error
//         if (err) {
//             res.status(404).json(err);
//             return;
//         }
//
//         // If a user is found
//         if(user){
//             token = user.generateJwt();
//             res.status(200);
//             res.json({
//                 "token" : token
//             });
//         } else {
//             // If user is not found
//             console.log('Authentication failed => user set to false');
//             res.status(401).json(info);
//         }*/
//    //}) (req, res, next);
//
// //};
