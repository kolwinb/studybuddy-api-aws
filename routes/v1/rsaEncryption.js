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

//custom crypt module
var crypto=require("../lib/crypto");

router.post('/setEncrypt',function(req,res){
	engparam=req.originalUrl;
	varstringify=JSON.stringify(req.body);
//	varBody=JSON.stringify(varstringify);
//	var_mobile=req.body.mobile;
//	var_operator=req.body.operator;
//	var_redeemCode=req.body.redeem_code;
//	var_deviceId=req.body.device_id;
//	var_deviceType=req.body.device_type;

	var_status='0';
	var_dateTime= new Date();
	console.log(varstringify);
	crypto.encryptRsa(varstringify,function(callback) {
		data = {
			"status":"success",
			"data":  callback
				
			}
		res.json(data);
	});
});

router.post('/getDecrypt',function(req,res){
	engparam=req.originalUrl;
	varstringify=JSON.parse(JSON.stringify(req.body));
	
	var_status='0';
	var_dateTime= new Date();
	console.log(varstringify);
	crypto.decryptRsa(varstringify.data,function(callback) {
		const studentAnswer=JSON.parse(callback)
		Object.keys(studentAnswer).forEach(function(key){
			mcqArr=studentAnswer[key].mcq;
			Object.keys(mcqArr).forEach(function(keyA){
				console.log('key :'+key+', videoId:'+studentAnswer[key].videoId);
				console.log('key :'+keyA+', questionId:'+mcqArr[key].questionId);
			});
		});
				
		res.json(studentAnswer);
	});
});

module.exports = router
