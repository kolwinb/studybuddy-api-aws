var bodyParser = require('/media/data/opt/nodejs/lib/node_modules/body-parser')
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
app.use(bodyParser.json());
var router = express.Router();

//load custom crypto module
var crypto=require("../lib/crypto");

router.post('/',function(req,res){
	engparam=req.originalUrl;
	var_data=JSON.stringify(req.body);
//	var_subscriberId=req.body.subscriber_id;
//	var_deviceId=req.body.device_id;
//	var_vodId=req.body.vod_id;

//	var_status='0';
//	var_dateTime= new Date();
	

	crypto.encryptAesRsa(var_data,function(callback){  
		
		data = {
			"status":"success",
			"data":  callback
				
			}
		res.json(data);
	});
});


module.exports = router
