const crypto = require('./crypto');
var pool = require('../../models/usermysql.js');

function sendError(code,desc){
	const jsonData = {
		"status":"error",
		"error":{
			"statusCode":code,
			"description":desc
		}	
	}
	return JSON.stringify(jsonData)
}

function wsSendError(code,msg){
return JSON.stringify(
		{
			"code" : code,
			"description":msg
		}
	)
}

var State ={
	wsOngoingError: function(){
		return  wsSendError(915,"Battle is being run, Try again after little while...")
	},
	wsFinishError: function(){
		return  wsSendError(914,"Battle is not allowed to finish")
	},
	wsSystemError: function(){
		return  wsSendError(913,"Sysetem error")
	},
	wsBattleNotFinish: function(){
		return  wsSendError(912,"Battle has not been finished yet")
	},
	wsBattleCoin: function(){
		return  wsSendError(911,"Prohibited action of coin pool")
	},
	wsBattleNotFound: function(){
		return  wsSendError(910,"Battle session not found.")
	},
	wsReqLessFund: function(){
		return  wsSendError(909,"Insufficient funds in requested user's wallet.")
	},
	wsReqUserNotFound: function(){
		return  wsSendError(908,"Requested user not found.")
	},
	wsAuth: function(){
		return  wsSendError(900,"API authorization required.")
	},
	wsUauth: function(){
		return  wsSendError(901,"Uauthorization API calling.")
	},
	wsToken: function(){
		return  wsSendError(902,"Token not provided.")
	},
	wsTokenVerification: function(){
		return  wsSendError(903,"Token verification failed.")
	},
	wsFormat: function(){
		return  wsSendError(904,"Wrong format.")
	},
	wsEvent: function(){
		return  wsSendError(905,"Event not found.")
	},
	wsUserNotFound: function(){
		return  wsSendError(906,"User not found.")
	},
	wsLessFund: function(){
		return  wsSendError(907,"Insufficient funds in your wallet.")
	},
	subscriptionFound: function(){
		return  sendError(1024,"Subscription has not been expired.")
	},
	invalidPlanId: function(){
		return  sendError(1023,"Invalid plan id.")
	},
	resetPasswordFail: function(){
		return  sendError(1022,"Password resetting failed.")
	},
	planNotFound: function(){
		return  sendError(1021,"Subscription plan has not been found.")
	},
	planExpired: function(){
		return  sendError(1020,"Subscription plan has been expired.")
	},
	wrongReferral: function(){
		return  sendError(1019,"Wrong referral code")
	},
	authHeader: function(){
		return  sendError(1018,"Authorization is required.")
	},
	misbehaviour: function(){
		return  sendError(1017,"request misbehaviour.")
	},
	answerProhibited: function(){
		return  sendError(1016,"Prohibited action.")
	},
	studentAnswerWarning: function(){
		return  sendError(1015,"Given answer is not matched.")
	},
	recoveryCodeVerification: function(){
		return  sendError(1014,"Recovery code verification required.")
	},
	mobileNotMatch: function(){
		return  sendError(1013,"Mobile number not match with registered one.")
	},
	profileAdding: function(){
		return  sendError(1012,"not allowed.")
	},
	profileError: function(){
		return  sendError(1011,"Unable to find profile data.")
	},
	regParamErr: function(){
		return  sendError(1010,"Parameters not match.")
	},
	recoveryCodeNotVerify: function(){
		return  sendError(1209,"Recovery code verification has been failed.")
	},
	recoveryCodeExpired: function(){
		return  sendError(1208,"Recovery code timeout.")
	},
	smsNoRequire: function(){
		return  sendError(1207,"Mobile number is required.")
	},
	unAuthApi: function(){
		return  sendError(1206,"Unauthorized API calling..")
	},
	otpRequired: function(){
		return  sendError(1205,"OTP verification is required.")
	},
	otpExpired: function(){
		return  sendError(1204,"OTP has been expired.")
	},

	otpNotVerify: function(){
		return  sendError(1203,"OTP has not been verified.")
	},
	otpDecline: function(){
		return  sendError(1202,"SMS request decline.")
	},
	otpFailure: function(){
		return  sendError(1201,"Can't send SMS OTP.")
	},
	googleTokenTimeout: function(){
		return  sendError(1103,"Token used too late.")
	},
	googleNotAuth: function(){
		return  sendError(1102,"Google user is not authenticated.")
	},
	googleAccessToken: function(content){
		return  sendError(1101,"Google authentication session has been expired.")
	},
	stateSuccess: function(content){
		return  JSON.stringify({"status":"success","data":JSON.parse(content)})
	},
	sendWsData: function(type,content){
		const jsonData = {
			"type":type,
			"payload":JSON.parse(content)
		}
		return JSON.stringify(jsonData)
	},
	userReject: function(){
		return  sendError(1009,"Regitration rejected, Email/Mobile found.")
	},
	userNotActivated: function(){
		return  sendError(1008,"User has been registered. But activation has not been verified.")
	},
//	userRegistered: function(){
//		return  JSON.stringify({"status":"success,"Activation has been verified."})
//	},
	userNotFound: function(){
		return   sendError(1001,"Authentication Failed. User not found.")
	},
	thirdPartyAuth: function(){
		return   sendError(302,"Return Null")
	},
	emptyMobile: function(){
		return   sendError(1007, "Mobile number required")
	},
	paramNone: function(){
		return  sendError(1006,"Data is missing")
	},
	tokenNone: function(){
		return   sendError(1005,"Token not provided")
	},
	tokenExpired: function(){
		return   sendError(1004,"Token expired")
	},
	server: function() {
		return  sendError(1000,"Internal server error")
		},
	content: function() {
		return sendError(101,"Content type mismatch")
		},
	redeem: function() {
		return sendError(102,"Invalid redeem code")
		},
	subscribe: function() {
		return sendError(103,"Not subscribed")
		},
	subActivate: function() {
		return sendError(104,"Subscription has not been activated")
		},
	header: function() {
		return sendError(105,"Header mismatch")
		},
	operator: function() {
		return sendError(106,"Operator cnnection error")
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
