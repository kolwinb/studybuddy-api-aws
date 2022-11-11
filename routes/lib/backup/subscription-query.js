var express = require('../../lib/node_modules/express');
//var config = require('../../config.js');

//18byt id generator
var uniqid = require ('../../lib/node_modules/uniqid');

//mysql model
var pool = require('../../models/usermysql.js');


var app = express();
// parse application/json
app.use(express.json());
var router = express.Router();

//load mobile operator modules
var operator=require('./operator-api');

//load custom crypto module
var decCrypto = require('./crypto');
var properties = require('./properties');

exports.subQuery=function(req,callback){
	engparam=req.originalUrl;
    if (!req.is('application/json')) {
		data = {
		"status":"error",
			"error":{
			"code":"101",
			"description":"Content type mismatch"
			}
		}
		return callback(data);
		console.log("content-type is not a application/json type");
	} else {
	
		decCrypto.decryptAesRsa(req.body.data,function(retCrypto){
				
        	var varObj = JSON.parse(retCrypto)
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
							"applicationId": "APP_006585",
							"password": "635d395496161d727139eef8988dbada",
	  						});
	  						
						console.log("req.pth :"+req.path);
	  					operator.api(post_data,properties.mobitelUrl,'/subscription/query-base',function (retVal){ 
	  						console.log("await mobitel :"+JSON.stringify(retVal));
	  						return callback(retVal);  
	  						});
	  						
	
  					} else if (var_operator == "dialog") {
  						const post_data = JSON.stringify({
							"applicationId": "APP_060570",
							"password": "9df31a15a3d809a98d6758baef90f433",
							"referenceNo": "213561321321613",
							"otp": "123564"
  							});
  							
	  					operator.api(post_data,properties.dialogUrl,'/subscription/query-base',function (retVal){ 
	  						console.log("await dialog:"+JSON.stringify(retVal));
	  						return callback(retVal);  
	  						});
				}		
					
			con.release();
			}
			});	//pool
		});//decCrypto library
	} //ifcondition
} //export object
