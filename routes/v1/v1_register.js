var express = require('/media/data/opt/nodejs/lib/node_modules/express');
//var config = require('../../config.js');

//send mails
var sendmail = require('/media/data/opt/nodejs/lib/node_modules/sendmail')({silent: true,devPort:25,devHost:'localhost'});

//email validator
var validator = require('/media/data/opt/nodejs/lib/node_modules/email-validator');

//18byt id generator
var uniqid = require ('/media/data/opt/nodejs/lib/node_modules/uniqid');

//mysql model
var pool = require('../../models/usermysql.js');

var app = express();
var router = express.Router();

const dbQuery=require('../lib/dbQuery');
const status = require('../lib/status');
const log = require('../lib/log');
const jwtToken = require('../lib/jwtToken');
const scope = require('../lib/apiKeys');
const apiKey = scope.userReg.apiKey;
const apiSecret = scope.userReg.apiSecret;

// con.query ("UPDATE ?? SET uniqid=? WHERE email=?",[tablename,valrand,req.body.email],function (err, result) {

router.post('/',function(req,res){
	valrand=uniqid(); //uniq id
    var signdate = new Date();
	email=req.body.email;
	password=req.body.password;
	username=req.body.username;
	contact=req.body.contact;
	api_key=req.body.api_key;
	api_secret=req.body.api_secret;
	
	log.info("register request");

	if ((apiKey != api_key) || (apiSecret != api_secret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((!email) && (!contact)) {
		res.send(JSON.parse(status.regParamErr()));
	} else if  ((!password) || (!username)){ 
		res.send(JSON.parse(status.regParamErr()));
	} else {
    	dbQuery.setUserSqlQuery(dbQuery.whereEmailOrPhone,["user",email,contact],function(callback){
    		//res.send(JSON.parse(callback));
			if (!callback[0]){
				log.error("registration : user not found");
				//sql insert here
				if (contact){
					log.info("mobile detected, wait for otp confirmation...");
					dbQuery.setUserSqlQuery(dbQuery.whereOtpNo,["sms_verification",contact],function(callbackVerify){
						if (!callbackVerify[0]){
							res.send(JSON.parse(status.otpRequired()));
						} else	if (callbackVerify[0].is_verify == 1){
							dbQuery.setUserInsert(dbQuery.insertUser,["user",email,password,username,contact,signdate,signdate,valrand,1,'NULL'],function(callbackAdd){
								if (!callbackAdd){
									res.send(JSON.parse(status.server()));
								} else {
									content=JSON.stringify({"description":"Mobile User has been registered."});
									res.send(JSON.parse(status.stateSuccess(content)));
								}			
							});				
							//content=JSON.stringify({"description":"User has been registered."});
							//res.send(JSON.parse(status.stateSuccess(content)));
						} else {
							res.send(JSON.parse(status.otpNotVerify()));
						}
					});
				} else {
					dbQuery.setUserInsert(dbQuery.insertUser,["user",email,password,username,contact,signdate,signdate,valrand,1,'NULL'],function(callbackA){
						if (!callbackA){
							res.send(JSON.parse(status.server()));
						} else {
							content=JSON.stringify({"description":"Email User has been registered."});
							res.send(JSON.parse(status.stateSuccess(content)));
						}			
					});
				}
			} else if ((callback[0].email == email) || (callback[0].phone == contact)){
				res.send(JSON.parse(status.userReject()));
			}
    	});
	}
});
module.exports = router;
