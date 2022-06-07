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

//         con.query ("UPDATE ?? SET uniqid=?,last_sign=?  WHERE email=?",[tablename,valrand,signdate,req.body.email],function (err, result) {
 
router.post('/mobile',function(req,res){
    var signdate = new Date();
	log.info("sign in : "+signdate.toLocaleString());    
	log.info("sign in : "+signdate.getTime());    
	var mobile=req.body.mobileNo;
	var passwd=req.body.password;
	dbQuery.setUserSqlQuery(dbQuery.wherePhonePasswd,["user",mobile,passwd],function(callback){
		if (!callback[0]){
			res.send(JSON.parse(status.userNotFound()));
		} else if (callback[0].is_active==0){
			res.send(JSON.parse(status.userNotActivated()));
		} else {
			//(email,expSeconds,response)
			jwtToken.jwtAuth(mobile,3600,function(callback){
				res.send(JSON.parse(callback));
			
			}); 
			
			//update lastlogin
			dbQuery.setSqlUpdate(dbQuery.updateLastLogin,["user",signdate,callback[0].id],function(callbackA){
			
			});
		}
	
	});
});

router.post('/email',function(req,res){
    var signdate = new Date();
	log.info("sign in : "+signdate.toLocaleString());    
	log.info("sign in : "+signdate.getTime());    
	var email=req.body.email;
	var passwd=req.body.password;
//	log.info("email : "+email);
	dbQuery.setUserSqlQuery(dbQuery.whereEmailPasswd,["user",email,passwd],function(callback){
		if (!callback[0]){
			res.send(JSON.parse(status.userNotFound()));
		} else if (callback[0].is_active==0){
			res.send(JSON.parse(status.userNotActivated()));
		} else {
			//(email,expSeconds,response)
			jwtToken.jwtAuth(email,3600,function(callback){
				res.send(JSON.parse(callback));
			
			});
			dbQuery.setSqlUpdate(dbQuery.updateLastLogin,["user",signdate,callback[0].id],function(callbackA){
			
			}); 
		}
	});
});

module.exports = router
