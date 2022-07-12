var express = require('/media/data/opt/nodejs/lib/node_modules/express');
var jwt = require('/media/data/opt/nodejs/lib/node_modules/jsonwebtoken');
//var config = require('../../config.js');

//send mails
var sendmail = require('/media/data/opt/nodejs/lib/node_modules/sendmail')({silent: true,devPort:25,devHost:'localhost'});

//18byt id generator
var uniqid = require ('/media/data/opt/nodejs/lib/node_modules/uniqid');


//mysql model
var pool = require('../../models/usermysql.js');

var app = express();
var router = express.Router();
var fs = require("fs");
var cert = fs.readFileSync('private.pem');
//mysql

//jwt custome module
var jwtToken=require('../lib/jwtToken');

//log module
var log = require('../lib/log');

//sql
var dbQuery=require('../lib/dbQuery');

const status=require('../lib/status');

const scope = require('../lib/apiKeys');
const apiKey=scope.signIn.apiKey;
const apiSecret=scope.signIn.apiSecret;
 
router.post('/mobile',function(req,res){
    var signdate = new Date();
	log.info("sign in : "+signdate.toLocaleString());    
	log.info("sign in : "+signdate.getTime());    
	var mobile=req.body.mobileNo;
	var passwd=req.body.password;
	api_key=req.body.api_key;
	api_secret=req.body.api_secret;
	
	log.info("register request");
	
	if ((apiKey != api_key) || (apiSecret != api_secret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((!mobile) || (!passwd)){
        res.send(JSON.parse(status.regParamErr()));
	} else {
		dbQuery.setUserSqlQuery(dbQuery.wherePhonePasswd,["user",mobile,passwd],function(callback){
			if (!callback[0]){
				res.send(JSON.parse(status.userNotFound()));
			} else if (callback[0].is_active==0){
				res.send(JSON.parse(status.userNotActivated()));
			} else {
				//(email,expSeconds,response)
				jwtPayload={ 
					userId:callback[0].id
					};
				
				jwtToken.jwtAuth(jwtPayload,3600,function(callback){
					res.send(JSON.parse(callback));
				
				});
				/*
				jwtToken.jwtAuth(mobile,3600,function(callback){
					res.send(JSON.parse(callback));
				
				}); 
				*/
				//update lastlogin
				dbQuery.setSqlUpdate(dbQuery.updateLastLogin,["user",signdate,callback[0].id],function(callbackA){
				
				});
			}
		
		});
	}
});

router.post('/email',function(req,res){
    var signdate = new Date();
	log.info("sign in : "+signdate.toLocaleString());    
	log.info("sign in : "+signdate.getTime());    
	var email=req.body.email;
	var passwd=req.body.password;

	log.info("key: "+req.body.api_key);
	log.info("secret: "+req.body.api_secret);
	log.info("email: "+req.body.email);
	log.info("pass: "+req.body.password);

	api_key=req.body.api_key;
	api_secret=req.body.api_secret;
	
	log.info("register request");
	
	if ((apiKey != api_key) || (apiSecret != api_secret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((!email) || (!passwd)){
        res.send(JSON.parse(status.regParamErr()));
	} else {
		dbQuery.setUserSqlQuery(dbQuery.whereEmailPasswd,["user",email,passwd],function(callback){
			if (!callback[0]){
				res.send(JSON.parse(status.userNotFound()));
			} else if (callback[0].is_active==0){
				res.send(JSON.parse(status.userNotActivated()));
			} else {
				//(email,expSeconds,response)
				jwtPayload={ 
					userId:callback[0].id
					};
				jwtToken.jwtAuth(jwtPayload,3600,function(callback){
					res.send(JSON.parse(callback));
				
				});
				dbQuery.setSqlUpdate(dbQuery.updateLastLogin,["user",signdate,callback[0].id],function(callbackA){
				
				}); 
			}
		});
	}
});

module.exports = router