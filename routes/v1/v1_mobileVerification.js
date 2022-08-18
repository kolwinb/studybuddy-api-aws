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

router.post('/getOtp',function(req,res,next) {
   var apiKey = req.body.api_key;
   var apiSecret=req.body.api_secret;
   var mobile=req.body.mobileNo;
   
   if ((!apiKey || !apiSecret)){
   		res.send(JSON.parse(status.unAuthApi()));
   } else if ((!mobile)) {
   		res.send(JSON.parse(status.smsNoRequire()));
   } else {
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
	}
 });
 
router.post('/setOtp',function(req,res,next) {
   var apiKey = req.body.api_key;
   var apiSecret=req.body.api_secret;
   var mobile=req.body.mobileNo;
   var otp=req.body.otp;
   
   if ((!apiKey || !apiSecret)){
   		res.send(JSON.parse(status.unAuthApi()));
   } else if ((!mobile)) {
   		res.send(JSON.parse(status.smsNoRequire()));
   } else {
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
	}
 });
 



router.post('/getRecoveryCode',function(req,res,next) {
   const rtoken = req.body.token || req.query.token || req.headers['x-access-token'];
   const apiKey = req.body.api_key;
   const apiSecret=req.body.api_secret;
   const mobile=req.body.mobileNo;
   
   if ((!apiKey || !apiSecret)){
   		res.send(JSON.parse(status.unAuthApi()));
   } else if ((!mobile)) {
   		res.send(JSON.parse(status.smsNoRequire()));
   } else {
   		console.log("mobile recovery :"+mobile);
		dbQuery.setUserSqlQuery(dbQuery.whereMobile,["user",mobile],function(callbackUser){
			console.log("getRecoveryCode :"+callbackUser[0]);
			if (!callbackUser[0]) {
				res.send(JSON.parse(status.misbehaviour()));
			} else {
				smsApi.apiAuth(apiKey,apiSecret,function(callback){
					if (callback){
						//otp sms gateway controller
						smsApi.sendRecoveryCode(mobile,function(callback){
							res.send(JSON.parse(callback));
						});
					} else {
						res.send(JSON.parse(status.otpDecline()));
					}
				});								
			}
		});
	}
 });


router.post('/setRecoveryCode',function(req,res,next) {
   const rtoken = req.body.token || req.query.token || req.headers['x-access-token'];
   const apiKey = req.body.api_key;
   const apiSecret=req.body.api_secret;
   const mobile=req.body.mobileNo;
   const recoveryCode=req.body.recovery_code;
   
   if ((!apiKey || !apiSecret)){
   		res.send(JSON.parse(status.unAuthApi()));
   } else if ((!mobile)) {
   		res.send(JSON.parse(status.smsNoRequire()));
   } else {
		dbQuery.setUserSqlQuery(dbQuery.whereMobile,["user",mobile],function(callbackUser){
			if (!callbackUser[0]){
				res.send(JSON.parse(status.misbehaviour()));
			} else {
				smsApi.apiAuth(apiKey,apiSecret,function(callback){
					if (callback){
						//otp sms gateway controller
						smsApi.verifyRecoveryCode(mobile,recoveryCode,function(callback){
							res.send(JSON.parse(callback));
						});
					} else {
						res.send(JSON.parse(status.otpDecline()));
					}
				});
			}
		});
	}
 });


module.exports=router
