const crypto = require('./crypto');
var pool = require('../../models/usermysql.js');

var errState ={
	paramNone: function(){
		return JSON.stringify({"success": "false","message":"Parameters missing.","errorcode":"106"})
	},
	tokenNone: function(){
		return JSON.stringify({success: false,message:"No token provided.",errorcode:105})
	},
	dbQuery: function() {
		return  {success: false, message: 'Internal Server Error', errorcode:101}
		},
	server: function() {
		return  {"status":"error","error":{"statusCode":"100","description":"Internal server error"}}
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

module.exports = errState;
