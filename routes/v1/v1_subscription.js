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
// parse application/json
//app.use(express.json());
var router = express.Router();

//load mobile operator modules
var operator=require('../lib/operator-api');

//load custom crypto module
var decCrypto = require('../lib/crypto');
var otpReq	= require('../lib/otp-request');
var otpVer	= require('../lib/otp-verify');
var unsubscribe = require('../lib/unsubscribe');

router.post('/otp/request',function(req,res){
	otpReq.otpRequest(req,function(retVal){
		res.json(retVal);
	});
})


router.post('/otp/verify',function(req,res){
	otpVer.otpVerify(req,function(retVal){
		res.json(retVal);
	});
})

router.post('/unsubscribe',function(req,res){
	unsubscribe.subSend(req,function(retVal){
		res.json(retVal);
	});
})


module.exports = router
