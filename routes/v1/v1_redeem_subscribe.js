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

//../library not required
//var crypto = require("crypto");
//var path = require('path');

//for log writing
var fs = require("fs");  


//decrypt custom library
var crypto = require("../lib/crypto");

var app = express();
// parse application/json
//app.use(express.json());
var router = express.Router();
const varErr = require('../lib/status');

router.post('/',function(req,res){
	engparam=req.originalUrl;
    if (!req.is('application/json')) {
		res.json(varErr.content);
		console.log("content-type is not a application/json type");
	} else {

		crypto.decryptAesRsa(req.body.data,function(callback) {
		 				
        		var varObj = JSON.parse(callback)
				var_mobile=varObj.mobile;
				var_operator=varObj.operator;
				var_redeemCode=varObj.redeem_code;
				var_deviceId=varObj.device_id;
				var_deviceType=varObj.device_type;
				var_dateTime= new Date();
				var_deviceOs=varObj.device_os;
				console.log("redeem_cde :"+var_redeemCode);
                                                                                                                                                            				
				//random subscriber id
				var_subscriberId=Math.floor(new Date().valueOf() * Math.random());
				
				console.log("subscriber_id : "+var_subscriberId);
			
    			pool.getConnection(function(err,con){
					if (err) {
						console.log("can't connect database server");
					} else {		
						valrand=uniqid(); //uniq id for subscription
    					//find redeem code
    					con.query("SELECT ? FROM ??  WHERE redeem_code LIKE ? AND is_active=?",["redeem_code","redemption",var_redeemCode,0], function (err,result){
							if (!result.length){
								console.log('requested redeem code not found, this will be commit in log table');
		/*
								con.query("INSERT INTO ?? (id,subscriber_id,device_id,mobile,operator,type,status,date_time) VALUES(?,?,?,?,?,?,?,?)",["subscriber_log",'NULL',var_subscriberId,var_deviceId,var_mobile,var_operator,var_deviceType,var_status,var_dateTime],function (err,result) {
									if (err) {
										console.log("can't insert record into subscribe_log table");
									} else {
										console.log("invalid redeem code record added to subscribe_log table");
									}
									});
		
		*/
								//writing to log file
								csvData=var_dateTime+":"+dec_data+"\r\n";
								varMonth=var_dateTime.getMonth()+1;
								varYear=var_dateTime.getFullYear();	
								fs.appendFile('log/redeem_subscribe-'+varYear+"-"+varMonth+'.log', csvData, 'utf8', function (err) {
  									if (err) {
  										console.log('Some error occured - file either not saved or corrupted file saved.');
  										res.json(varErr.server);
									} else{
										console.log('record has been added to  log file');
  									}
  								});
		
		
	            					res.json(varErr.redeem);
							} else {
							
								//update redeem
    							con.query("UPDATE ?? SET is_active=?,device_id=? WHERE redeem_code LIKE ?",["redemption",1,var_deviceId,var_redeemCode], function (err,result){
   									if (err) {
                   						console.log('subscription update error on redemption table');
                   						res.json(varErr.server);
									} else {
										console.log('subscribed successful');
			
									}
	        					});
	        					//end redeem update
	        					
								var_status='1';
								//insert subscription
								con.query("INSERT INTO ?? (id,subscriber_id,device_id,mobile,operator,type,status,date_time,subs_type,device_os,encoded_id) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",["subscriber",'NULL',var_subscriberId,var_deviceId,var_mobile,var_operator,var_deviceType,var_status,var_dateTime,"R",var_deviceOs,'null'],function (err,result) {
									if (err) {
										console.log(err);
                   						res.json(varErr.server);
			
									} else {
                                                                                                                                   			
										var enc_data = JSON.stringify({
													"subscriber_id":var_subscriberId,
													"device_id":var_deviceId
													});
													
										//AES encryption
                                        crypto.encryptAes(enc_data,function(callback){                                                                                            			
											data = {
												"status":"success",
												"data":  callback
												
												}
											res.json(data);
										});//crypto.encryptAes
									}
								});
								//end insert subscription
	        			}      
						});
				con.release();
				}
				});	//mysql pool
		}); //crypto module
	} //ifcondition
});

//subscription status
router.post('/status',function(req,res){
	engparam=req.originalUrl;
//	varstringify=JSON.stringify(req.body);
//	varBody=JSON.parse(varstringify);
	var_deviceId=req.body.device_id;
	var_subscriberId=req.body.subscriber_id;
	var_token=req.body.token;

	var_dateTime= new Date();
	

    pool.getConnection(function(err,con){
		if (err) {
			console.log("can't connect database server");
		} else {		
    		//find redeem code
    		con.query("SELECT ? FROM ??  WHERE subscriber_id LIKE ? AND device_id LIKE ? ",["subscriber_id","subscriber",var_subscriberId,var_deviceId], function (err,result){
				if (!result.length){
            		data = {
            			"status":"error",
            			"error": {
            				"code":"103",
            				"description" : "Not Subscribed"
            				}
              			}
            		res.json(data);
				}else {
					data = {
						"status":"success",
						"description": "Already Subscribed"
						}
					res.json(data);
	        }      
			});
	con.release();
	}
	});	
});


module.exports = router
