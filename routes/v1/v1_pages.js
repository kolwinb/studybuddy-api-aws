var express = require('../../lib/node_modules/express');
var app = express();
var fs = require("fs");
var router = express.Router();

//using privatekey
var cert=fs.readFileSync('private.pem');

router.get('/privacy',function(req,res) {
//       res.json({success:true,signature:'valid'});
res.sendFile('/opt/API/studybuddy-api-aws/routes/templates/privacy.html');

 });

module.exports = router
