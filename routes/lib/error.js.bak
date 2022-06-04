const crypto = require('./crypto');
var pool = require('../../models/usermysql.js');

exports.server= {"status":"error","error":{"statusCode":"100","description":"Internal server error"}}
exports.content = {"status":"error","error":{"statusCode":"101","description":"Content type mismatch"}}
exports.redeem = {"status":"error","error":{"statusCode":"102","description":"Invalid redeem code"}}
exports.subscribe = {"status":"error","error":{"statusCode":"103","description":"Not subscribed"}}
exports.subActivate = {"status":"error","error":{"statusCode":"104","description":"Subscription has not been activated"}}
exports.header = {"status":"error","error":{"statusCode":"105","description":"Header mismatch"}}
exports.operator = {"status":"error","error":{"statusCode":"106","description":"Operator cnnection error"}}
                                                                                    
exports.customError = function(res,callback){
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
