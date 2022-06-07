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

//load mobile operator modules
var operator=require('./operator-api');

//load custom crypto module
var decCrypto = require('./crypto');
var properties = require('./properties');
var axios = require('./axios');
var varErr=require("./status");

exports.otpVerify=function(req,callback){
	engparam=req.originalUrl;
    if (!req.is('application/json')) {
		return callback(varErr.content);
		console.log("content-type is not a application/json type");
	} else {
	
		decCrypto.decryptAesRsa(req.body.data,function(retCrypto){
				
        	var varObj = JSON.parse(retCrypto)
			var_referenceNo=varObj.referenceNo;
			var_otp=varObj.otp;
            var_operator=varObj.operator;
            var_mobile=var_referenceNo.substring(0,11);                                                                                                                                            			
			//random subscriber id
			var_subscriberId=Math.floor(new Date().valueOf() * Math.random());
			
			console.log("otp-verify:mobile no:"+var_mobile);

					if (var_operator == "mobitel"){
					
						const post_data = JSON.stringify({
							"applicationId": properties.mobitelAppId,
							"password": properties.mobitelPassword,
							"referenceNo": var_referenceNo,
							"otp": var_otp
	  						});
	  						
						console.log("req.pth :"+req.path);
	  					axios.api(post_data,properties.mobitelOtpVerify,function (retVal){ 
	  						console.log("mobitel otp verify :"+JSON.stringify(retVal));
							dbUpdate(JSON.stringify(retVal));
	  						return callback(retVal);  
	  						});
	  						
	
  					} else if (var_operator == "dialog") {
  						const post_data = JSON.stringify({
							"applicationId": properties.dialogAppId,
							"password": properties.dialogPassword,
							"referenceNo": var_referenceNo,
							"otp": var_otp
  							});
  							
	  					axios.api(post_data,properties.dialogOtpVerify,function (retVal){ 
							console.log("axios.api:parameters:"+JSON.stringify(retVal)+" : "+var_mobile);
								if (retVal.statusCode == "S1000"){
									console.log("axios.api:retVal.statusCode: "+retVal.statusCode);
									console.log("axios.api:retVal :"+JSON.stringify(retVal));
									retEnc=retVal.subscriberId.split(":");
									encSubscriberId=retEnc[1];
									console.log("axios.api:encoded subscription id:"+encSubscriberId);
									dbUpdate(var_mobile,encSubscriberId,function(retUpdate){ 
										funcDbQuery(var_mobile,function(dbQuery){
											console.log("axios.api:"+dbQuery);
											callback(dbQuery);
										});									
									});
									
								} else {
									console.log("dialog operator return error");
									callback(retVal);
								}
	  					});//axios.api
				}		
		});//decCrypto library
	} //ifcondition
} //export object


var funcDbQuery=function(mobileNo,callback) {
	pool.getConnection(function(err,con){

	con.query("SELECT * FROM ?? WHERE mobile=? and status=?",["subscriber",var_mobile,1],function (err,resultSubscriber){
        if (!resultSubscriber.length){
			console.log("funcDbQuery:suscriber_id and device_id:sql error");
			
		} else {
			subData={
				"susbcriber_id":resultSubscriber[0].subscriber_id,
				"device_id":resultSubscriber[0].device_id
			}
			console.log("funcDbQuery:query subscriber:"+JSON.stringify(subData));
			decCrypto.encryptAes(JSON.stringify(subData),function(retAES){

				data={
						"status":"success",
						"data":retAES
					}
				callback(data);
			}); //decrypto								
		}			
	}); //query status

	con.release();
	});//pool

}

var dbUpdate=function(mobileNo,subscriberId,callback) {
		pool.getConnection(function(err,con){
		//change status of subscriber to 1
			if (err) {
				console.log("function:dbUpdate:can't connect database server");
//				return varErr.server;
			} else {
				//update subscription
				con.query("UPDATE ?? SET status=?,encoded_id=? WHERE mobile=?",["subscriber",1,subscriberId,mobileNo], function (err,result){
					if (err) {
						console.log('function:dbUpdate:subscription update error on redemption table');
//						return varErr.server;
					} else {
						console.log('function:dbUpdate:subscriber table update successful');
						callback();
					}
				});//update subscription
		
			}

		con.release();

		}); //pool


}
