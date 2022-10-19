var express = require('../../lib/node_modules/express');
//var config = require('../../config.js');

//18byt id generator
var uniqid = require ('../../lib/node_modules/uniqid');

//mysql model
var pool = require('../../models/usermysql.js');


var app = express();
var router = express.Router();

//custom crypt module
var crypto=require("../lib/crypto");

router.post('/',function(req,res){
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
	
	crypto.encryptAesRsa(varstringify,function(callback) {
		data = {
			"status":"success",
			"data":  callback
				
			}
		res.json(data);
	});
});

module.exports = router
