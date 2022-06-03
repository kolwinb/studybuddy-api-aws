var express = require('/media/data/opt/nodejs/lib/node_modules/express');
var jwt = require('/media/data/opt/nodejs/lib/node_modules/jsonwebtoken');
var app = express();
var fs = require("fs");
var router = express.Router();
//app.use('/api',api);

//using privatekey
var cert=fs.readFileSync('private.pem');

//jwtcustom class
var jwtModule = require('../lib/jwtToken.js');

router.post('/',function(req,res,next) {

   var rtoken = req.body.token || req.query.token || req.headers['x-access-token'];

   if (rtoken) {
   		jwtModule.jwtVerify(rtoken,function(callback){
   			return res.json(callback);
   		});
   		
    } else {
       return res.status(403).send({ success: false,message:'No token provided.',errorcode:105});
  	}

 });

module.exports = router
