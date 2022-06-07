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


// con.query ("UPDATE ?? SET uniqid=? WHERE email=?",[tablename,valrand,req.body.email],function (err, result) {

router.post('/',function(req,res){
	valrand=uniqid(); //uniq id
    var signdate = new Date();
	email=req.body.email;
	password=req.body.password;
	username=req.body.username;
	contact=req.body.contact;
	log.info("register request");
    dbQuery.setUserSqlQuery(dbQuery.whereEmailOrPhone,["user",email,contact],function(callback){
    	//res.send(JSON.parse(callback));
		if (!callback[0]){
			log.error("user not found");
			//sql insert here
			dbQuery.setUserInsert(dbQuery.insertUser,["user",email,password,username,contact,signdate,signdate,valrand,0,'NULL'],function(callback){
				if (!callback){
					res.send(JSON.parse(status.server()));
				} else {
					content=JSON.stringify({"description":"User has been registered. But activation has not been verified."});
					res.send(JSON.parse(status.stateSuccess(content)));
				}			
			});
		} else if ((callback[0].email == email) || (callback[0].phone == contact)){
			res.send(JSON.parse(status.userReject()));
		/*
		}  else if (callback[0].is_active == 0){
			log.info("email : "+callback[0].email + " has not verify by sms");
			res.send(JSON.parse(status.userNotActivated()));
		
		} else if (callback[0].is_active == 1){
			log.info("email : "+callback[0].email + " found");
			content=JSON.stringify({"description":"Mobile successfully activated"});
			res.send(JSON.parse(status.stateSuccess(content)));
		*/
		}
    });

});
module.exports = router;
