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
	//log.info("sign in : "+signdate.getTime());    
	const mobile=req.body.mobileNo;
	const passwd=req.body.password;
	api_key=req.body.api_key;
	api_secret=req.body.api_secret;
	
	//log.info("api_key :"+api_key+", api_secret :"+api_secret+", mobile :"+mobile+", password "+passwd);
	
	if ((apiKey != api_key) || (apiSecret != api_secret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((!mobile) || (!passwd)){
        res.send(JSON.parse(status.regParamErr()));
	} else {
		dbQuery.getSelect(dbQuery.wherePhonePasswd,["user",mobile,passwd],function(callback){
			if (!callback[0]){
				res.send(JSON.parse(status.userNotFound()));
			} else if (callback[0].is_active==0){
				res.send(JSON.parse(status.userNotActivated()));
			} else {
				//(email,expSeconds,response)
				jwtPayload={ 
					userId:callback[0].id,
					uniqId:callback[0].uniqid
					};
				
				//one hour
				jwtToken.jwtAuth(jwtPayload,3600,function(callbackJwt){
				//one minute
				//jwtToken.jwtAuth(jwtPayload,60,function(callbackJwt){
					res.send(JSON.parse(callbackJwt));
				
				});
				//update lastlogin
				dbQuery.setUpdate(dbQuery.updateLastLogin,["user",signdate,callback[0].id],function(callbackA){
				
				});
			}
		
		});
	}
});


module.exports = router
