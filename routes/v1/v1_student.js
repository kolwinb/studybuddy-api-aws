var express = require('/media/data/opt/nodejs/lib/node_modules/express');
var mclient = require('/media/data/opt/nodejs/lib/node_modules/mongodb').MongoClient;
var jwt = require('/media/data/opt/nodejs/lib/node_modules/jsonwebtoken');

var url = "mongodb://192.168.1.110:27017/studybuddy";
var app = express();
var fs = require("fs");
var router = express.Router();

var cert=fs.readFileSync('private.pem');

//custom jwt module
var jwtModule = require('../lib/jwtToken');
const status = require('../lib/status');

//apikey
const scope = require('../lib/apiKeys');
const api_key = scope.vodApi.apiKey;
const api_secret = scope.vodApi.apiSecret;

//get list of all channels
router.post('/',function(req,res,next) {
	const rtoken = req.body.token || req.query.token || req.headers['x-access-token'];
   	const apiKey = req.body.api_key;
  	const apiSecret=req.body.api_secret;
 	
	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {                    	
		res.send(JSON.parse(status.unAuthApi()));
	} else {
   		if (rtoken) {
				jwtModule.jwtVerify(rtoken,function(callback){
		//			getJwt=JSON.parse(callback);
					if (callback){

       					resStatus=status.stateSuccess(contents);
       					res.send(JSON.parse(resStatus));						
					} else {
						res.send(status.tokenExpired());         
					}      
				}); 
		
    	}else {
       		return res.status(403).send(JSON.parse(status.tokenNone()));
  		}
  	}
 });




module.exports = router
