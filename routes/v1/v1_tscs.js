var express = require('../../lib/node_modules/express');
var app = express();
var fs = require("fs");
var router = express.Router();

//using privatekey
var cert=fs.readFileSync('private.pem');

 router.get('/signup',function(req,res) {
//       res.json({success:true,signature:'valid'});
res.sendFile('/opt/API/studybuddy-api-aws/routes/templates/tscs/tscs_signup.html');

 });

 router.get('/subscription',function(req,res) {
//       res.json({success:true,signature:'valid'});
res.sendFile('/opt/API/studybuddy-api-aws/routes/templates/tscs/tscs_subscription.html');

 });

 router.get('/inviteFriends',function(req,res) {
//       res.json({success:true,signature:'valid'});
res.sendFile('/opt/API/studybuddy-api-aws/routes/templates/tscs/tscs_inviteFriends.html');

 });

 router.get('/payment',function(req,res) {
//       res.json({success:true,signature:'valid'});
res.sendFile('/opt/API/studybuddy-api-aws/routes/templates/tscs/tscs_payment.html');

 });

module.exports = router
