var bodyParser = require('../../lib/node_modules/body-parser')
var express = require('../../lib/node_modules/express');
//var config = require('../../config.js');

//send mails
var sendmail = require('../../lib/node_modules/sendmail')({silent: true,devPort:25,devHost:'localhost'});

//email validator
var validator = require('../../lib/node_modules/email-validator');

//18byt id generator
var uniqid = require ('../../lib/node_modules/uniqid');

//mysql model
var pool = require('../../models/usermysql.js');


var app = express();
// parse application/json
app.use(bodyParser.json());
var router = express.Router();

//load mobile operator modules
var operator=require(../../lib/operator-api');

//load custom crypto module
var decCrypto = require('../../lib/crypto');

const mobitelUrl="api.mobitel.lk";
const dialogUrl="api.dialog.lk";
const appCode="https://play.google.com/store/apps/details?id=com.mbrain.learntv";

router.post('/otp/request',function(req,res){
	engparam=req.originalUrl;
    if (!req.is('application/json')) {
		data = {
		"status":"error",
			"error":{
			"code":"101",
			"description":"Content type mismatch"
			}
		}
		res.json(data);
		console.log("content-type is not a application/json type");
	} else {
	
		decCrypto.decryptAesRsa(req.body.data,function(callback){
				
        	var varObj = JSON.parse(callback)
			var_mobile=varObj.mobile;
			var_operator=varObj.operator;
	//		var_redeemCode=varObj.redeem_code;
			var_deviceId=varObj.device_id;
			var_deviceType=varObj.device_type;
			var_dateTime= new Date();
	//		console.log("redeem_cde :"+var_redeemCode);
                                                                                                                                                            			
			//random subscriber id
			var_subscriberId=Math.floor(new Date().valueOf() * Math.random());
			
			console.log("subscriber_id : "+var_subscriberId);
		
    		pool.getConnection(function(err,con){
				if (err) {
					console.log("can't connect database server");
				} else {
				
					if (var_operator == "mobitel"){
					
						const post_data = JSON.stringify({
							"applicationId": "APP_000375",
							"password": "a07118cda5215fc6d01db5b2ab848edd",
							"subscriberId": '"tel:'+var_mobile+'"',
							"applicationHash": "abcdefgh",
							"applicationMetaData": {
								"client": "MOBILEAPP",
								"device": "Samsung S20",
								"os": "android 8",
								"appCode": appCode
								}
	  						});
	  						
						console.log("req.pth :"+req.path);
	  					operator.api(post_data,mobitelUrl,'/otp/request',function (callback){ 
	  						console.log("await :"+JSON.stringify(callback));
	  						res.json(callback);  
	  						});
	  						
	
  					} else if (var_operator == "dialog") {
  						const post_data = JSON.stringify({
							"applicationId": "APP_060570",
							"password": "9df31a15a3d809a98d6758baef90f433",
							"subscriberId": '"tel:'+var_mobile+'"',
	//						"subscriberId": "tel:94777748260",
							"applicationHash": "abcdefgh",
							"applicationMetaData": {
								"client": "MOBILEAPP",
								"device": "Samsung M11",
								"os": "android 8",
								"appCode": appCode
								}
  							});
  							
	  					operator.api(post_data,dialogUrl,'/subscription/otp/request',function (callback){ 
	  						console.log("await :"+JSON.stringify(callback));
	  						res.json(callback);  
	  						});
				}		
					
			con.release();
			}
			});	//pool
		});//decCrypto library
	} //ifcondition
});

module.exports = router
