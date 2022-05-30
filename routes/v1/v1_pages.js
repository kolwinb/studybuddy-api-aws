var express = require('/media/data/opt/nodejs/lib/node_modules/express');
var app = express();
var fs = require("fs");
var router = express.Router();

//using privatekey
var cert=fs.readFileSync('private.pem');

router.get('/privacy',function(req,res) {
//       res.json({success:true,signature:'valid'});
res.sendFile('/media/data/opt/nodejs/studybuddy/routes/templates/privacy.html');

 });

module.exports = router
