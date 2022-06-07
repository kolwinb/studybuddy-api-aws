var express = require('/media/data/opt/nodejs/lib/node_modules/express');
var jwt = require('/media/data/opt/nodejs/lib/node_modules/jsonwebtoken');

var url = "mongodb://192.168.1.110:27017/learntvapi";
var app = express();
var fs = require("fs");
var router = express.Router();

//using privatekey
var cert=fs.readFileSync('private.pem');


//custom jwt module
var jwtModule = require('../lib/jwtToken');
const status = require('../lib/status');
const log = require('../lib/log');

router.post('/',function(req,res,next) {

   var rtoken = req.body.token || req.query.token || req.headers['x-access-token'];
   if (rtoken) {
		jwtModule.jwtVerify(rtoken,function(callback){
			if (callback) {
				contents=JSON.stringify({"description":"Token verified"});
				res.send(JSON.parse(status.stateSuccess(contents)));
			} else {
				res.send(JSON.parse(status.tokenExpired()));
			
			}
		});
		                            
    } else {
    
       res.send(JSON.parse(status.tokenNone()));
  }

 });

module.exports = router
