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

const referralGenerator=require('/media/data/opt/nodejs/lib/node_modules/referral-code-generator');

var app = express();
var router = express.Router();

const dbQuery=require('../lib/dbQuery');
const status = require('../lib/status');
const log = require('../lib/log');
const jwtModule = require('../lib/jwtToken');
const scope = require('../lib/apiKeys');
const apiKey = scope.userReg.apiKey;
const apiSecret = scope.userReg.apiSecret;


router.post('/',function(req,res){
	const valrand=uniqid(); //uniq id
    const signdate = new Date();
	const mobileNo=req.body.mobileNo;
	const password=req.body.password;
	const api_key=req.body.api_key;
	const api_secret=req.body.api_secret;
	const referredCode=req.body.referral_code;
	const deviceId=req.body.device_id;
	
//	log.info("register request");

	if ((apiKey != api_key) || (apiSecret != api_secret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((!password) && (!mobileNo)) {
		res.send(JSON.parse(status.regParamErr()));
	} else {
    	dbQuery.setUserSqlQuery(dbQuery.whereMobile,["user",mobileNo],function(callback){
    		//res.send(JSON.parse(callback));
			if (!callback[0]){
				log.error("registration : user not found");
				//sql insert here
				log.info("mobile detected, wait for otp confirmation...");
				dbQuery.setUserSqlQuery(dbQuery.whereOtpNo,["sms_verification",mobileNo],function(callbackVerify){
					if (!callbackVerify[0]){
						res.send(JSON.parse(status.otpRequired()));
					} else	if (callbackVerify[0].is_verify == 1){
						const referralCode=referralGenerator.alphaNumeric('uppercase',4,1);
						log.info("referral code generated : "+referralCode);
						
						dbQuery.setUserInsert(dbQuery.insertUser,["user","",password,"",mobileNo,signdate,signdate,valrand,1,'NULL',2,referralCode,deviceId],function(callbackAdd){
							if (!callbackAdd){
								log.info("user insert error ");
								res.send(JSON.parse(status.server()));
							} else {
								//get referrer user_id
								
								dbQuery.getSelectAll(dbQuery.whereReferrerReferred,[referredCode,mobileNo],function(callbackReferrer){
									if (!callbackReferrer){
										res.send(JSON.parse(status.server()));
									} else {
										const jsonRef=JSON.parse(callbackReferrer);
										//make relation with referrer and referred
										//const referrer_id=callbackReferrer[0].id;
										log.info("referred referrer :"+callbackReferrer);
										const referrerId=jsonRef[0]['0'].referrer_id;
										const refereeId=jsonRef[1]['0'].referee_id;
										log.info("referrerId :"+referrerId+", referee_id : "+refereeId);
										dbQuery.setUserSqlQuery(dbQuery.whereAffiliate,[referrerId,refereeId],function(callbackAffiliate){
											if (!callbackAffiliate[0]){
												dbQuery.setUserInsert(dbQuery.insertAffiliate,['NULL',referrerId,refereeId,signdate],function(callbackAff){
													if(callbackAff){
														content=JSON.stringify({"description":"Mobile User has been registered."});
														res.send(JSON.parse(status.stateSuccess(content)));
													} else {
														res.send(JSON.parse(status.server()));
													}
												});
											} else {
												res.send(JSON.parse(status.misbehaviour()));
											}
										});
									}
								});
								

							}			
						});				
					} else {
						res.send(JSON.parse(status.otpNotVerify()));
					}
				});
			} else if (callback[0].phone == mobileNo) {		
				res.send(JSON.parse(status.userReject()));
			}
    	});
	}
});

router.post('/setPassword',function(req,res){
	const rtoken = req.body.token || req.query.token || req.headers['x-access-token'];
	const api_key = req.body.api_key;
	const api_secret=req.body.api_secret;
	const password=req.body.password;
	const mobileNo=req.body.mobileNo;
	
	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {
		res.send(JSON.parse(status.unAuthApi()));
	} else {
		if (rtoken) {
			jwtModule.jwtVerify(rtoken,function(callback){
				if (callback){
					jwtModule.jwtGetUserId(rtoken,function(callbackU){
						const studentId=callbackU.userId;
 						dbQuery.setUserSqlQuery(dbQuery.whereUser,["user",studentId],function(callbackUser){
 							if (!callbackUser[0]){
	 							res.send(JSON.parse(status.misbehaviour()));
 							} else {
	 							const registeredMobile=callbackUser[0].phone;
	 							if (mobileNo != registeredMobile) {
	 								res.send(JSON.parse(status.mobileNotMatch()));
	 							} else {
	 								dbQuery.setUserSqlQuery(dbQuery.whereOtpNo,["user_passwdrecovery",mobileNo],function(callbackVerify){
										if (!callbackVerify[0]){
											res.send(JSON.parse(status.recoveryCodeVerification()));
										} else	if (callbackVerify[0].is_verify == 1){
											dbQuery.setSqlUpdate(dbQuery.updateUserPassword,["user",password,studentId,mobileNo],function(callbackUpdate){
												if (!callbackUpdate){
													res.send(JSON.parse(status.server()));
												} else {
													//deactivating recovery code
													const dateTime=new Date();
													dbQuery.setSqlUpdate(dbQuery.updateRecoveryCodeActivation,["user_passwdrecovery",dateTime,0,mobileNo],function(callbackDeactivate){
														if(callbackDeactivate){
															content=JSON.stringify({"description":"Password reset has been done."});
															res.send(JSON.parse(status.stateSuccess(content)));
														} else {
															res.send(JSON.parse(status.server()));
														}
													
													});
                        													

												}			
											});				
										} else {
											res.send(JSON.parse(status.recoveryCodeNotVerify()));
										}
									});
								}
								
							}
						});
					});
				} else {
					res.send(status.tokenExpired());
				}
			});
		} else {
            return res.status(403).send(JSON.parse(status.tokenNone()));		
		} 						
 	}
                                                                                                                                                                                                                                                                                                                         
});

module.exports = router;
