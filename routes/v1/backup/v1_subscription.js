var express = require('../../lib/node_modules/express');
//var config = require('../../config.js');

//18byt id generator
var uniqid = require ('../../lib/node_modules/uniqid');

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
