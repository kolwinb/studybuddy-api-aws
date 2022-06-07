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
//app.use(express.urlencoded());
var router = express.Router();

//load mobile operator modules
var operator=require('./operator-api'); //this will send request from client browser

//load custom crypto module
var decCrypto = require('./crypto');
var properties = require('./properties');
var axios = require('./axios'); //this will send request from nodejs server

const varErr = require('./status');

exports.otpRequest=function(req,callback){
	engparam=req.originalUrl;
    if (!req.is('application/json')) {
		return callback(varErr.content);
		console.log("content-type is not a application/json type");
	} else {
	
		decCrypto.decryptAesRsa(req.body.data,function(retCrypto){
				
        	var varObj = JSON.parse(retCrypto)
			var_mobile=varObj.mobile;
			var_operator=varObj.operator;
	//		var_redeemCode=varObj.redeem_code;
			var_deviceId=varObj.device_id;
			var_deviceType=varObj.device_type;
			var_deviceOs=varObj.device_os;
			var_dateTime= new Date();
			var_status=0;
	//		console.log("redeem_cde :"+var_redeemCode);
                                                                                                                                                            			
			//random subscriber id
			var_subscriberId=Math.floor(new Date().valueOf() * Math.random());
			
			console.log("subscriber_id : "+var_subscriberId);

			if (var_operator == "mobitel"){
			
				const post_data = JSON.stringify({
					"applicationId": properties.mobitelAppId,
					"password": properties.mobitelPassword,
					"subscriberId": "tel:"+var_mobile,
					"applicationHash": properties.mobitelAppHash,
					"applicationMetaData": {
						"client": properties.mobitelClient,
						"device": var_deviceType,
						"os": var_deviceOs,
						"appCode": properties.appCode
						}
	  				});
	  				
				console.log("req.pth :"+req.path);
//	  					operator.api(post_data,properties.mobitelUrl,'/otp/request',function (retVal){ 
	  			axios.api(post_data,properties.mobitelOtpRequest,function (retVal){ 
	  				console.log("mobitel axios return :"+JSON.stringify(retVal));
	  				return callback(retVal);  
	  				});
	  				

  			} else if (var_operator == "dialog") {
  				const post_data = JSON.stringify({
					"applicationId": properties.dialogAppId,
					"password": properties.dialogPassword,
					"subscriberId": "tel:"+var_mobile,
					"applicationHash": properties.dialogAppHash,
					"applicationMetaData": {
						"client": properties.dialogClient,
						"device": var_deviceType,
						"os": var_deviceOs,
						"appCode": properties.appCode
						}
  					});
//	  					operator.api(post_data,properties.dialogUrl,'/subscription/otp/request',function (retVal){ 
	  			axios.api(post_data,properties.dialogOtpRequest,function (retVal){ 
	  				console.log("otp-request:response :"+JSON.stringify(retVal));
//	  				retData=JSON.stringify(retVal);
//	  				retObj=JSON.parse(retData);
//	  				retObj=retVal;
	  				
	  				if (retVal.statusCode=="S1000") {
						dialogData={
							"operator":"dialog",
							"referenceNo":retVal.referenceNo
							}
						decCrypto.encryptAes(JSON.stringify(dialogData),function(retAES){
							data={
								"status":"success",
								"data":retAES
							}
	  					return callback(data);  
						});
						

					} else {
						return callback(retVal);
					}
					
					
					
	  				});
			}		



			//add record into subscriber table with status 0
			pool.getConnection(function(err,con){
				if (err) {		
					console.log("can't connect database server");
				} else {
					con.query("SELECT ? FROM ??  WHERE mobile=?",["mobile","subscriber",var_mobile], function (err,result){
						if (!result.length){
							console.log('otp-request:'+var_mobile+':mobile not found in subscriber table');
							con.query("INSERT INTO ?? (id,subscriber_id,device_id,mobile,operator,type,status,date_time,subs_type,device_os,encoded_id) VALUES(?,?,?,?,?,?,?,?,?,?,?)",["subscriber",'NULL',var_subscriberId,var_deviceId,var_mobile,var_operator,var_deviceType,var_status,var_dateTime,"P",var_deviceOs,'NULL'],function (err,result) {
								if (err) {
									console.log("otp-rquest:database insert error in subscriber table");
								} else {
									console.log("otp-request:add record into subscriber table");
								} //sql insert result
							}); //sql insert
						} else {
							console.log("otp-requst:record found in subscriber table");
						} //query result
					}); // query 
				}
				con.release();
			});	//pool
		});//decCrypto library
	} //ifcondition
} //export object
