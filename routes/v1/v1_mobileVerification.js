var express = require('/media/data/opt/nodejs/lib/node_modules/express');
var jwt = require('/media/data/opt/nodejs/lib/node_modules/jsonwebtoken');
var app = express();
var fs = require("fs");
var router = express.Router();
//app.use('/api',api);

//using privatekey
var cert=fs.readFileSync('private.pem');

//jwtcustom class
var jwtModule = require('../lib/jwtToken');

//dbquery module
var dbQuery = require('../lib/dbQuery');

//status
var status = require('../lib/status');

//sms
const smsApi = require('../lib/smsApi');

router.post('/send',function(req,res,next) {
   var apiKey = req.body.api_key;
   var apiSecret=req.body.api_secret;
   var mobile=req.body.mobile;
   
	smsApi.apiAuth(apiKey,apiSecret,function(callback){
		if (callback){
			//otp sms gateway controller
			smsApi.otpSend(mobile,function(callback){
				res.send(JSON.parse(callback));
			});
		} else {
			res.send(JSON.parse(status.otpDecline()));
		}
	});

 });

router.post('/verify',function(req,res,next) {
   var apiKey = req.body.api_key;
   var apiSecret=req.body.api_secret;
   var mobile=req.body.mobile;
   var otp=req.body.otp;
   
	//api key verification
	smsApi.apiAuth(apiKey,apiSecret,function(callback){
		if (callback){
			smsApi.otpVerify(mobile,otp,function(callback){
				res.send(JSON.parse(callback));
			});
		} else {
			res.send(JSON.parse(status.otpDecline()));
		}
	});
 });


module.exports=router
