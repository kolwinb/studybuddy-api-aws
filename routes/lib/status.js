const crypto = require('./crypto');
var pool = require('../../models/usermysql.js');

var State ={
	answerProhibited: function(){
		return  JSON.stringify({"status":"error","error":{"statusCode":"1014","description":"Prohibited action."}})
	},
	answerCorrect: function(content){
		return  JSON.stringify({"status":"correct","data":JSON.parse(content)})
	},
	answerIncorrect: function(content){
		return  JSON.stringify({"status":"incorrect","data":JSON.parse(content)})
	},
	studentAnswerWarning: function(){
		return  JSON.stringify({"status":"error","error":{"statusCode":"1013","description":"Given answer is not matched."}})
	},
	profileAdding: function(){
		return  JSON.stringify({"status":"error","error":{"statusCode":"1012","description":"not allowed."}})
	},
	profileError: function(){
		return  JSON.stringify({"status":"error","error":{"statusCode":"1011","description":"Unable to find profile data."}})
	},
	regParamErr: function(){
		return  JSON.stringify({"status":"error","error":{"statusCode":"1010","description":"Parameters not match."}})
	},
	smsNoRequire: function(){
		return  JSON.stringify({"status":"error","error":{"statusCode":"1207","description":"Mobile number is required."}})
	},
	unAuthApi: function(){
		return  JSON.stringify({"status":"error","error":{"statusCode":"1206","description":"Unauthorized API calling.."}})
	},
	otpRequired: function(){
		return  JSON.stringify({"status":"error","error":{"statusCode":"1205","description":"OTP verification is required."}})
	},
	otpExpired: function(){
		return  JSON.stringify({"status":"error","error":{"statusCode":"1204","description":"OTP has been expired."}})
	},
	otpNotVerify: function(){
		return  JSON.stringify({"status":"error","error":{"statusCode":"1203","description":"OTP has not been verified."}})
	},
	otpDecline: function(){
		return  JSON.stringify({"status":"error","error":{"statusCode":"1202","description":"SMS request decline."}})
	},
	otpFailure: function(){
		return  JSON.stringify({"status":"error","error":{"statusCode":"1201","description":"Can't send SMS OTP."}})
	},
	googleTokenTimeout: function(){
		return  JSON.stringify({"status":"error","error":{"statusCode":"1103","description":"Token used too late."}})
	},
	googleNotAuth: function(){
		return  JSON.stringify({"status":"error","error":{"statusCode":"1102","description":"Google user is not authenticated."}})
	},
	googleAccessToken: function(content){
		return  JSON.stringify({"status":"error","error":{"statusCode":"1101","description":"Google authentication session has been expired."}})
	},
	stateSuccess: function(content){
		return  JSON.stringify({"status":"success","data":JSON.parse(content)})
	},
	userReject: function(){
		return  JSON.stringify({"status":"error","error":{"statusCode":"1009","description":"Regitration rejected, Email/Mobile found."}})
	},
	userNotActivated: function(){
		return  JSON.stringify({"status":"error","error":{"statusCode":"1008","description":"User has been registered. But activation has not been verified."}})
	},
//	userRegistered: function(){
//		return  JSON.stringify({"status":"success","description":"Activation has been verified."})
//	},
	userNotFound: function(){
		return   JSON.stringify({"status":"error","error":{"statusCode":"1001","description":"Authentication Failed. User not found."}})
	},
	thirdPartyAuth: function(){
		return   JSON.stringify({"status":"error","error":{"statusCode":"302","description":"Return Null"}})
	},
	emptyMobile: function(){
		return   JSON.stringify({"status":"error","error":{"statusCode":"1007","description": "Mobile number required"}})
	},
	paramNone: function(){
		return  JSON.stringify({"status":"error","error":{"statusCode":"1006","description":"Parameters missing"}})
	},
	tokenNone: function(){
		return   JSON.stringify({"status":"error","error":{"statusCode":"1005","description":"Token not provided"}})
	},
	tokenExpired: function(){
		return   JSON.stringify({"status":"error","error":{"statusCode":"1004","description":"Token expired"}})
	},
	server: function() {
		return  JSON.stringify({"status":"error","error":{"statusCode":"1000","description":"Internal server error"}})
		},
	content: function() {
		return {"status":"error","error":{"statusCode":"101","description":"Content type mismatch"}}
		},
	redeem: function() {
		return {"status":"error","error":{"statusCode":"102","description":"Invalid redeem code"}}
		},
	subscribe: function() {
		return {"status":"error","error":{"statusCode":"103","description":"Not subscribed"}}
		},
	subActivate: function() {
		return {"status":"error","error":{"statusCode":"104","description":"Subscription has not been activated"}}
		},
	header: function() {
		return {"status":"error","error":{"statusCode":"105","description":"Header mismatch"}}
		},
	operator: function() {
		return {"status":"error","error":{"statusCode":"106","description":"Operator cnnection error"}}
		},
	customError:  function(res,callback){
    	if (res.statusCode.charAt(0) == "E"){
	
			errData= {
				"status":"error",
				"error":{
					"statusCode":res.statusCode,
					"description":res.statusDetail
					}
				}
	
	/*
				errData={
					"subscriptionStatus":"INITIAL CHARGING PENDING",
					"subscriberId":"tel:B%3C43GzdP+rv2cVZCDyfPOt5HASikzALBbt4ZswwcNLOXPTF+OeDsTJLBaQkg6dbVvea",
					"statusDetail":"Success",
					"version":"1.0",
					"statusCode":"S1000"
					}
	*/
			return callback(errData);
		} else {
	
			return callback(res);
	
	
		}
	}

}

module.exports = State;
