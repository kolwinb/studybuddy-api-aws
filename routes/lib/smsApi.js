const request = require('/media/data/opt/nodejs/lib/node_modules/request');
//this class verify jwt token and issue when request
var jwt = require('/media/data/opt/nodejs/lib/node_modules/jsonwebtoken');
var fs = require("fs");

var cert = fs.readFileSync('private.pem');

//local log manager
var log = require("./log");
const status = require("./status");
const dbQuery = require("./dbQuery");
const scope = require("./apiKeys");

const USR='techsas';
const PWD='Tech#123';
const MASK='Greentel';
const MSG='StudyBuddy OTP : ';
const ApiKey = scope.smsApi.apiKey;
const SecretKey = scope.smsApi.apiSecret;

var smsSend = {
	apiAuth: function(apiKey,secretKey,callback){
		if ((apiKey == ApiKey) && (SecretKey == secretKey)){
			callback(true);
		} else {
			callback(false);
		}
	},
	
	otpSend: function(mobile,callbackotp){
		var otp=Math.floor(100000 + Math.random() * 900000);
		smsRequest="https://bulksms.hutch.lk/sendsmsmultimask.php?USER=techsas&PWD=Tech%23123&MASK=Greentel&NUM="+mobile+"&MSG="+MSG+otp;
		request.post(smsRequest, (err, resp, body) => {
		
			console.log("sms gateway response : "+JSON.parse(JSON.stringify(resp)));
			
			if (err) {
				console.log("sms not send");
				return JSON.parse(status.smsFailure());
			} else {
				log.info("SMS sent to "+mobile);
				//add database
				var timestamp= new Date();
				dbQuery.setUserSqlQuery(dbQuery.whereOtpNo,["sms_verification",mobile],function(callback){
					if (callback[0]) {
						dbQuery.setSqlUpdate(dbQuery.updateOtp,["sms_verification",otp,timestamp,mobile],function(callbackA){
							if (callbackA){
								log.info("sms verification table updated");
								var jsonString=JSON.stringify({"description":"OTP has been sent."});
								callbackotp(status.stateSuccess(jsonString));
							} else {
								callbackotp(status.server());
							}
						});
					} else {
						dbQuery.setUserInsert(dbQuery.insertOtp,["sms_verification",'NULL',otp,mobile,timestamp,0],function (callbackB){
							if (callbackB){
								var jsonString=JSON.stringify({"description":"OTP has been sent."});
								callbackotp(status.stateSuccess(jsonString));
							} else {
								callbackotp(status.server());
							}					
						
						});				
					}
				});
				
			}
		});
	},
	otpVerify: function(mobile,otp,callbackotp){
		dbQuery.setUserSqlQuery(dbQuery.whereOtpNo,["sms_verification",mobile],function(callback){
			if (callback[0]) {
				if (callback[0].otp == otp){
					var dateTime= new Date();
					var createdTime = callback[0].created;
					var timeDifference = Math.abs(dateTime.getTime() - createdTime.getTime());
					log.info("timeDifference : " + timeDifference);
					
					if (timeDifference	<= 150000){
						dbQuery.setSqlUpdate(dbQuery.updateIsVerify,["sms_verification",1,dateTime,mobile],function(callbackA){
							if (callbackA){
								var jsonString=JSON.stringify({"description":"OTP verified"});
								callbackotp(status.stateSuccess(jsonString))
							} else {
								callbackotp(status.server());
							}
						});
					} else {
						callbackotp(status.otpExpired());
					}
				} else {
					callbackotp(status.otpExpired());
				}
			} else {
				callbackotp(status.otpNotVerify());
			
			}
		
		});		
	}
}

module.exports = smsSend

