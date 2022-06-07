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
app.use(express.json());
var router = express.Router();

//load mobile operator modules
var operator=require('./operator-api');

//load custom crypto module
var decCrypto = require('./crypto');
var properties = require('./properties');
var axios = require('./axios');
const varErr = require('./status');

exports.subSend=function(req,callback){
	engparam=req.originalUrl;
    if (!req.is('application/json')) {
		return callback(varErr.content);
		console.log("content-type is not a application/json type");
	} else {
	
		decCrypto.decryptAesRsa(req.body.data,function(retCrypto){
				
        	var varObj = JSON.parse(retCrypto)
			var_subscriberId=varObj.subscriberId;
			var_operator=varObj.operator;
//			var_action=varObj.action;
			var_dateTime= new Date();
	//		console.log("redeem_cde :"+var_redeemCode);
                                                                                                                                                            			
			console.log("subscriber_id : "+var_subscriberId);
		
			if (var_operator == "mobitel"){
			
				const post_data = JSON.stringify({
					"applicationId": "APP_006585",
					"password": "635d395496161d727139eef8988dbada",
					"subscriberId":var_subscriberId,
					"action":0
	  				});
	  				
				console.log("req.pth :"+req.path);
                axios.api(post_data,properties.mobitelActivate,function (retVal){
	  				console.log("await :"+JSON.stringify(retVal));
	  				return callback(retVal);  
	  				});
	  				

  			} else if (var_operator == "dialog") {


				funcDbQuery(var_subscriberId,function (retVal,encodedId){
					if (retVal == var_subscriberId){  							
		  				const post_data = JSON.stringify({
							"applicationId": properties.dialogAppId,
							"password": properties.dialogPassword,
							"action":0,
							"subscriberId":"tel:"+encodedId
  						});
  						
	                    axios.api(post_data,properties.dialogActivate,function (retVal){
		  					console.log("await :"+JSON.stringify(retVal));
		  					if (retVal.statusCode="S1000") {
								dbUpdate(var_subscriberId,function(retCallback){
									return callback(retCallback);
								});		  					
		  					} else {
		  						return callback(retVal);
		  					}
  						});
	  				} else {
	  					callback(varErr.subscribe);
	  				}
	  			});//funcDbQuery
		}		
		});//decCrypto library
	} //ifcondition
} //export object


var funcDbQuery=function(subscriberId,callback) {
	pool.getConnection(function(err,con){
		con.query("SELECT * FROM ?? WHERE subscriber_id=? and status=?",["subscriber",subscriberId,1],function (err,resultSubscriber){
			if (!resultSubscriber.length){
				console.log("funcDbQuery:suscriber_id and device_id:sql error");
				callback(varErr.subscribe);
			} else {
				callback(resultSubscriber[0].subscriber_id,resultSubscriber[0].encoded_id);
			}
		}); //query status
		
		con.release();
	});//pool

}

var dbUpdate=function(subscriberId,callback) {
	pool.getConnection(function(err,con){
	//change status of subscriber to 1
	if (err) {
		console.log("function:dbUpdate:can't connect database server");
	//              return varErr.server;
	} else {
		//update subscription
		con.query("UPDATE ?? SET status=?,encoded_id=? WHERE subscriber_id=?",["subscriber",0,'NULL',subscriberId], function (err,result){
		if (err) {
			console.log('function:dbUpdate:subscription update error on redemption table');
//                      return varErr.server;
		} else {
			console.log('function:dbUpdate:subscriber table update successful')
           subData={
   				"status":"sucess",
   				"description":"User unregistered successfully"
 				}
				
            decCrypto.encryptAes(JSON.stringify(subData),function(retAES){
				data={
					"status":"success",
					"data":retAES
				}
				console.log("returnAes :"+retAES);
				callback(data);
			}); //decrypto
        			
		}
		});//update subscription
		
	}
	
	con.release();
	
	}); //pool
	
	
}
	
