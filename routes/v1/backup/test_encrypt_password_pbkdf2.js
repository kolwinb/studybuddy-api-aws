var express = require('../../lib/node_modules/express');
//var config = require('../../config.js');

//18byt id generator
var uniqid = require ('../../lib/node_modules/uniqid');

//mysql model
var pool = require('../../models/usermysql.js');

var app = express();
var router = express.Router();

//load custom crypto module
var crypto=require("../lib/crypto");

router.post('/',function(req,res){
	engparam=req.originalUrl;
	var_data=JSON.stringify(req.body);
	var_data=JSON.parse(var_data);
//	var_subscriberId=req.body.subscriber_id;
//	var_deviceId=req.body.device_id;
//	var_vodId=req.body.vod_id;
	console.log(var_data);
//	var_status='0';
//	var_dateTime= new Date();
	

	crypto.encryptPbkdf2(var_data,function(callback){  
		
		data = {
			"status":"success",
			"data":  callback
				
			}
		res.json(data);
	});
});


module.exports = router
