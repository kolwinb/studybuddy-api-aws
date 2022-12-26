var express = require('../../lib/node_modules/express');
var jwt = require('../../lib/node_modules/jsonwebtoken');
var app = express();
var fs = require("fs");
var router = express.Router();
//app.use('/api',api);

//using privatekey
var cert=fs.readFileSync('private.pem');

//jwtcustom class
var jwtModule = require('../lib/jwtToken');

//dbquery module
var dbQuery = require('../lib/dbQuery');

//status
var status = require('../lib/status');

const property = require('../lib/properties');

//apikey
const scope = require('../lib/apiKeys');
const api_key = scope.profileApi.apiKey;
const api_secret = scope.profileApi.apiSecret;

router.post('/setAccountDetail',function(req,res,next) {
	const authToken = req.header('Authorization');
	const apiKey = req.header('x-api-key');
	const apiSecret = req.header('x-api-secret');
	var bodyJson=JSON.parse(JSON.stringify(req.body));
	
	const name=bodyJson.name;
	const gradeId=bodyJson.gradeId;
	const avatarId=bodyJson.avatarId;
	const schoolId=bodyJson.schoolId;
	const address=bodyJson.address;
	const favoriteSubject=bodyJson.favoriteSubject;
	const ambition=bodyJson.ambition;
	const birthday=bodyJson.birthday;
	const nic=bodyJson.nic;
	const socialLink=bodyJson.socialLink;
	const email=bodyJson.email;
	const parentName=bodyJson.parentName;
	const parentContact=bodyJson.parentContact;
	const parentEmail=bodyJson.parentEmail;
	const schoolAddress=bodyJson.schoolAddress;
	const schoolContact=bodyJson.schoolContact;
	const schoolEmail=bodyJson.schoolEmail;
	const teacherName=bodyJson.teacherName;
	const teacherContact=bodyJson.teacherContact;
	const teacherEmail=bodyJson.teacherEmail;
	
	console.log("setAccountDetail : "+JSON.stringify(bodyJson));
	if (!authToken){
		console.log("Authorization header missing");
		res.send(JSON.parse(status.authHeader()));
	} else  if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {
		res.send(JSON.parse(status.unAuthApi()));
	} else if ( (!bodyJson) || (!gradeId) || (!schoolId)) {
		console.log("data missing :"+JSON.stringify(bodyJson));
		res.send(JSON.parse(status.paramNone()));
	} else {
		const arrToken = authToken.split(" ");
		const rtoken = arrToken[1];
		if (rtoken) {
			jwtModule.jwtVerify(rtoken,function(callback){
				//          getJwt=JSON.parse(callback);
				if (callback){
					jwtModule.jwtGetUserId(rtoken,function(callback){
						const studentId=callback.userId
						dbQuery.getSelect(dbQuery.whereUser,["user",studentId],function(callbackUser){
							if (!callbackUser[0]){
								res.send(JSON.parse(status.misbehaviour()));
							} else {
								dbQuery.setUpdate(dbQuery.updateAccountDetail,[name,gradeId,avatarId,schoolId,address,favoriteSubject,ambition,birthday,nic,socialLink,email,parentName,parentContact,parentEmail,schoolAddress,schoolContact,schoolEmail,teacherName,teacherContact,teacherEmail,studentId],function(callbackDetails){
									if (!callbackDetails){
										res.send(JSON.parse(status.profileError()));
									} else {
										resJson=JSON.stringify({"description":"Account details are updated"});
   			                            res.send(JSON.parse(status.stateSuccess(resJson)));
									}
								});									
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

router.post('/resetPassword',function(req,res,next) {
	const rtoken = req.body.token;
	const apiKey = req.body.api_key;
	const apiSecret=req.body.api_secret;
	const currentPassword=req.body.current_password;
	const newPassword=req.body.new_password;
	
	//console.log("token :"+rtoken+", currentPassword :"+currentPassword+", new password :"+newPassword+", apikey :"+apiKey+", apisecret :"+apiSecret);
	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {
		res.send(JSON.parse(status.unAuthApi()));
	} else {
   		if (rtoken) {
   				//verify token
   				jwtModule.jwtVerify(rtoken,function(callback){
					if (callback){
						jwtModule.jwtGetUserId(rtoken,function(callback){
							const studentId=callback.userId
							//console.log("user_id :"+studentId);
							dbQuery.getSelect(dbQuery.whereUserPassword,[studentId,currentPassword],function(callbackUser){
								//console.log(callbackUser[0]);
								if (!callbackUser[0]){
									res.send(JSON.parse(status.misbehaviour()));
								} else {
									if (currentPassword == newPassword){
										res.send(JSON.parse(status.resetPasswordFail()));
									} else {
										dbQuery.setUpdate(dbQuery.updateNewPassword,[newPassword,studentId],function(callbackPassword){
											if (!callbackPassword){
												res.send(JSON.parse(status.server()));
											} else {
												retJson=JSON.stringify({"description":"Password resetting has been done."});
												res.send(JSON.parse(status.stateSuccess(retJson)));
											}
										});
									}
								}
							});
						});
					} else {
						res.send(JSON.parse(status.tokenExpired()));
					}
				});
		} else {
       		return res.status(403).send(JSON.parse(status.tokenNone()));
		}
	}
});

router.post('/getChartSubjectQuestion',function(req,res,next) {
	const rtoken = req.body.token;
	const apiKey = req.body.api_key;
	const apiSecret=req.body.api_secret;
	
	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {
		res.send(JSON.parse(status.unAuthApi()));
	} else {
   		if (rtoken) {
   				//verify token
   				jwtModule.jwtVerify(rtoken,function(callback){
					if (callback){
						jwtModule.jwtGetUserId(rtoken,function(callback){
							const studentId=callback.userId
							//console.log(studentId);
							dbQuery.getSelectJson(dbQuery.chartSubjectQuestion,[studentId],function(callbackChartQuestion){
								if (!callbackChartQuestion) {
									res.send(JSON.parse(status.profileError()));
								} else {
									//varChartQuestion=JSON.parse(callbackChartQuestion);
									res.send(JSON.parse(status.stateSuccess(callbackChartQuestion)));
								}
							});
						});
					} else {
						res.send(JSON.parse(status.tokenExpired()));
					}
				});
		} else {
       		return res.status(403).send(JSON.parse(status.tokenNone()));
		}
	}
});

router.post('/getInfo',function(req,res,next) {
	const rtoken = req.body.token;
	const apiKey = req.body.api_key;
	const apiSecret=req.body.api_secret;
	
	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {
		res.send(JSON.parse(status.unAuthApi()));
	} else {
   		if (rtoken) {
   				//verify token
   				jwtModule.jwtVerify(rtoken,function(callback){
					if (callback){
						jwtModule.jwtGetUserId(rtoken,function(callback){
							const studentId=callback.userId
							//console.log(studentId);
							dbQuery.getSelect(dbQuery.whereProfileData,[studentId],function(callbackUser){
								if (!callbackUser[0]){
									res.send(JSON.parse(status.profileError()));
								} else {							
									dbQuery.getProfileInfo(dbQuery.profileInfo,[studentId,studentId,studentId,studentId,studentId,studentId,studentId],function(callbackUserProfile){
										//userJsonProfile=JSON.stringify(callbackUserProfile);
										//userProfile=JSON.parse(userJsonProfile);
										userProfile=JSON.parse(callbackUserProfile);
										//console.log("profileInfo :"+JSON.stringify(userProfile.personalInfo.gradeId));
										if (!userProfile.personalInfo) {
											res.send(JSON.parse(status.profileError()));
										} else {
											//userProfile=JSON.parse(callbackUserProfile);
											//console.log(userProfile.personalInfo);
											//console.log("userProfile ->"+userProfile[0]['0'].correctAnswers);
											//console.log("property coin : "+property.coin);
											//res.send(JSON.parse(status.stateSuccess(userProfile)));
											res.send(JSON.parse(status.stateSuccess(JSON.stringify(userProfile))));
										}
									});
								}
							});
						});
					} else {
						res.send(JSON.parse(status.tokenExpired()));
					}
   				});
    		} else {
       		return res.status(403).send(JSON.parse(status.tokenNone()));
  		}
	}
 });

router.post('/getData',function(req,res,next) {
	const rtoken = req.body.token;
	const apiKey = req.body.api_key;
	const apiSecret=req.body.api_secret;
	
	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {
		res.send(JSON.parse(status.unAuthApi()));
	} else {
   		if (rtoken) {
   				//verify token
   				jwtModule.jwtVerify(rtoken,function(callback){
					if (callback){
						jwtModule.jwtGetUserId(rtoken,function(callback){
							const studentId=callback.userId
							//console.log(studentId);
							dbQuery.getSelect(dbQuery.whereUserProfile,[studentId],function(callbackUserProfile){
								if (!callbackUserProfile[0]) {
									res.send(JSON.parse(status.profileError()));
								} else {
									//userprofile updating
									profileData=JSON.stringify({
										province:callbackUserProfile[0].province_name,
										district:callbackUserProfile[0].district_name,
										school:callbackUserProfile[0].school_name,
										studentName:callbackUserProfile[0].student_name,
										studentGrade:callbackUserProfile[0].student_grade
									});
									
									
									res.send(JSON.parse(status.stateSuccess(profileData)));
								}
							});
						});
					} else {
						res.send(JSON.parse(status.tokenExpired()));
					}
   				});
   				
    		} else {
       		return res.status(403).send(JSON.parse(status.tokenNone()));
  		}
	}
 });

router.post('/setSignup',function(req,res,next) {
	const rtoken = req.body.token;
	const apiKey = req.body.api_key;
	const apiSecret=req.body.api_secret;
	const schoolId=req.body.school_id;
	const studentName=req.body.name;
	const gradeId=req.body.grade_id;
	const avatarId=req.body.avatar_id;
	
	//console.log("avatarId :"+avatarId);
	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {
		res.send(JSON.parse(status.unAuthApi()));
	} else {
   		if (rtoken) {
   				//verify token
   				jwtModule.jwtVerify(rtoken,function(callback){
					if (callback){
						jwtModule.jwtGetUserId(rtoken,function(callback){
							const studentId=callback.userId
							console.log(studentId);
							dbQuery.getSelect(dbQuery.whereUser,["user",studentId],function(callbackUser){
								if (!callbackUser[0]) {
									res.send(JSON.parse(status.profileError()));
								} else {
									dbQuery.getSelect(dbQuery.whereUserProfile,[studentId],function(callbackUserProfile){
										if (!callbackUserProfile[0]) {
											console.log("profile data not found");
											var defaultLang=1;
											dbQuery.setInsert(dbQuery.insertProfile,["user_profile",0,schoolId,studentId,studentName,gradeId,avatarId,defaultLang],function(callbackProfile){
												if (!callbackProfile){
													dbQuery.setUpdate(dbQuery.updateProfile,["user_profile",schoolId,studentName,gradeId,avatarId,studentId],function (callbackProfileUpdate){
														if(!callbackProfileUpdate){
															res.send(JSON.parse(status.server()));
														} else {
															content=JSON.stringify({								
																"description":"Profile has been updated."
															});
															res.send(JSON.parse(status.stateSuccess(content)));														
														}
													});
												} else {
													content=JSON.stringify({								
														"description":"Profile data added."
														});
													res.send(JSON.parse(status.stateSuccess(content)));
												}
											});
										} else {
											//userprofile already there
											res.send(JSON.parse(status.profileAdding()));
										}
									});
								}
							});
						});
					} else {
						res.send(JSON.parse(status.tokenExpired()));
					}
   				});
   				
    		} else {
       		return res.status(403).send(JSON.parse(status.tokenNone()));
  		}
	}
 });
 
router.post('/setEdit',function(req,res,next) {
	const rtoken = req.body.token;
	const apiKey = req.body.api_key;
	const apiSecret=req.body.api_secret;
	const schoolId=req.body.school_id;
	const studentName=req.body.name;
	const grade=req.body.grade;
	const avatarId=req.body.avatar_id;
	
	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {
		res.send(JSON.parse(status.unAuthApi()));
	} else {
   		if (rtoken) {
   				//verify token
   				jwtModule.jwtVerify(rtoken,function(callback){
					if (callback){
						jwtModule.jwtGetUserId(rtoken,function(callback){
							const studentId=callback.userId
							//console.log(studentId);
							dbQuery.getSelect(dbQuery.whereUserProfile,[studentId],function(callbackUserProfile){
								if (!callbackUserProfile[0]) {
									res.send(JSON.parse(status.profileAdding()));
								} else {
									//userprofile already there
									dbQuery.setUpdate(dbQuery.updateProfile,["user_profile",schoolId,studentName,grade,studentId,avatarId],function(callbackUpdating){
										if (callbackUpdating){
											content=JSON.stringify({
												"description":"user profile updated"
											});										
											res.send(JSON.parse(status.stateSuccess(content)));
										} else {
											res.send(JSON.parse(status.profileAdding()));
										}
									
									});
								}
							});
						});
					} else {
						res.send(JSON.parse(status.tokenExpired()));
					}
   				});
   				
    		} else {
       		return res.status(403).send(JSON.parse(status.tokenNone()));
  		}
	}
 });

router.post('/language/info',function(req,res,next) {
	const rtoken = req.body.token;
	const apiKey = req.body.api_key;
	const apiSecret=req.body.api_secret;
	
	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {
		res.send(JSON.parse(status.unAuthApi()));
	} else {
   		if (rtoken) {
   				//verify token
   				jwtModule.jwtVerify(rtoken,function(callback){
					if (callback){
						jwtModule.jwtGetUserId(rtoken,function(callback){
						const studentId=callback.userId;
							if (studentId){
								//country list
								dbQuery.getSelectJson(dbQuery.selectAll,["student_language"],function(callback){
									res.send(JSON.parse(status.stateSuccess(callback)));
								});
							} else {
								res.send(JSON.parse(status.misbehaviour()));
							}
						});
					} else {
						res.send(JSON.parse(status.tokenExpired()));
					}
                                                                                                		
		
   				});
   				
    		} else {
       		return res.status(403).send(JSON.parse(status.tokenNone()));
  		}
	}
 });

router.post('/getLanguage',function(req,res,next) {
	const rtoken = req.body.token;
	const apiKey = req.body.api_key;
	const apiSecret=req.body.api_secret;
	
	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {
		res.send(JSON.parse(status.unAuthApi()));
	} else {
   		if (rtoken) {
   				//verify token
   				jwtModule.jwtVerify(rtoken,function(callback){
					if (callback){
						jwtModule.jwtGetUserId(rtoken,function(callback){
						const studentId=callback.userId;
							if (studentId){
								//country list
								dbQuery.getSelectJson(dbQuery.studentLanguage,[studentId],function(callback){
									res.send(JSON.parse(status.stateSuccess(callback)));
								});
							} else {
								res.send(JSON.parse(status.misbehaviour()));
							}
						});
					} else {
						res.send(JSON.parse(status.tokenExpired()));
					}
                                                                                                		
		
   				});
   				
    		} else {
       		return res.status(403).send(JSON.parse(status.tokenNone()));
  		}
	}
 });
 
router.post('/setLanguage',function(req,res,next) {
	const rtoken = req.body.token;
	const apiKey = req.body.api_key;
	const apiSecret=req.body.api_secret;
	const languageId=req.body.language_id;
	
	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {
		res.send(JSON.parse(status.unAuthApi()));
	} else {
   		if (rtoken) {
   				//verify token
   				jwtModule.jwtVerify(rtoken,function(callback){
					if (callback){
						jwtModule.jwtGetUserId(rtoken,function(callback){
						const studentId=callback.userId;
							if (studentId){
								dbQuery.getSelect(dbQuery.whereUserProfile,[studentId],function(callbackUserProfile){
									if (callbackUserProfile[0]) {
										dbQuery.setUpdate(dbQuery.updateStudentLanguage,[languageId,studentId],function(callbackProfile){
											if (!callbackProfile){
												res.send(JSON.parse(status.server()));
											} else {
												content=JSON.stringify({								
													"description":"Language has been updated."
													});
													
												res.send(JSON.parse(status.stateSuccess(content)));
											}
										});
									} else {
										//userprofile already there
										res.send(JSON.parse(status.profileError()));
									}
								});
							} else {
								res.send(JSON.parse(status.misbehaviour()));
							}
						});
								
					} else {
						res.send(JSON.parse(status.tokenExpired()));
					}
                                                                                                		
		
   				});
   				
    		} else {
       		return res.status(403).send(JSON.parse(status.tokenNone()));
  		}
	}
 });

router.post('/getCountry',function(req,res,next) {
	const rtoken = req.body.token;
	const apiKey = req.body.api_key;
	const apiSecret=req.body.api_secret;
	
	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {
		res.send(JSON.parse(status.unAuthApi()));
	} else {
   		if (rtoken) {
   				//verify token
   				jwtModule.jwtVerify(rtoken,function(callback){
					if (callback){
						//country list
						dbQuery.getSelectJson(dbQuery.selectAll,["countries"],function(callback){
							res.send(JSON.parse(status.stateSuccess(callback)));
						});
					} else {
						res.send(JSON.parse(status.tokenExpired()));
					}
                                                                                                		
		
   				});
   				
    		} else {
       		return res.status(403).send(JSON.parse(status.tokenNone()));
  		}
	}
 });

router.post('/getGrade',function(req,res,next) {
	const rtoken = req.body.token;
	const apiKey = req.body.api_key;
	const apiSecret=req.body.api_secret;
	
	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {
		res.send(JSON.parse(status.unAuthApi()));
	} else {
   		if (rtoken) {
   				//verify token
   				jwtModule.jwtVerify(rtoken,function(callback){
					if (callback){
						//country list
						dbQuery.getSelectJson(dbQuery.whereGrade,["grade"],function(callback){
							res.send(JSON.parse(status.stateSuccess(callback)));
						});
					} else {
						res.send(JSON.parse(status.tokenExpired()));
					}
                                                                                                		
		
   				});
   				
    		} else {
       		return res.status(403).send(JSON.parse(status.tokenNone()));
  		}
	}
 });


router.post('/getProvince',function(req,res,next) {
	const rtoken = req.body.token;
	const apiKey = req.body.api_key;
	const apiSecret=req.body.api_secret;
	
	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {
		res.send(JSON.parse(status.unAuthApi()));
	} else {
   		if (rtoken) {
   				//verify token
   				jwtModule.jwtVerify(rtoken,function(callback){
					if (callback){
						//province list
						dbQuery.getSelectJson(dbQuery.whereProvince,["province"],function(callback){
							res.send(JSON.parse(status.stateSuccess(callback)));
						});
					} else {
						res.send(JSON.parse(status.tokenExpired()));
					}
                                                                                                		
   				});
   				
    		} else {
       		return res.status(403).send(JSON.parse(status.tokenNone()));
  		}
  	}
 });

router.post('/getDistrict',function(req,res,next) {
	const rtoken = req.body.token;
	const apiKey = req.body.api_key;
	const apiSecret=req.body.api_secret;
	const provinceId = req.body.province_id;	
	
	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {
		res.send(JSON.parse(status.unAuthApi()));
	} else {
		if (rtoken) {
			if (provinceId) {
   				//verify token
   				jwtModule.jwtVerify(rtoken,function(callback){
					if (callback){
						//district list
						dbQuery.getSelectJson(dbQuery.whereDistrict,["district",provinceId],function(callback){
							res.send(JSON.parse(status.stateSuccess(callback)));
						});
					} else {
						res.send(JSON.parse(status.tokenExpired()));
					}
   				});
   			} else {
	       	return res.send(JSON.parse(status.paramNone()));
   			}
    	} else {
       		return res.status(403).send(JSON.parse(status.tokenNone()));
  		}
  	}
 }); 

router.post('/getSchool',function(req,res,next) {
	const districtId = req.body.district_id;
 	const rtoken = req.body.token;
	const apiKey = req.body.api_key;
	const apiSecret=req.body.api_secret;
	
	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {
		res.send(JSON.parse(status.unAuthApi()));
	} else {
   		if (rtoken) {
   				if (districtId){
   					//verify token
   					jwtModule.jwtVerify(rtoken,function(callback){
						if (callback){
							//school list for district
							dbQuery.getSelectJson(dbQuery.whereSchool,["school",districtId],function(callback){
								res.send(JSON.parse(status.stateSuccess(callback)));
							});
						} else {
							res.send(JSON.parse(status.tokenExpired()));
						}
	   				});
   				} else {
	       		return res.status(403).send(JSON.parse(status.paramNone()));
   				}
    	} else {
   			return res.status(403).send(JSON.parse(status.tokenNone()));
  		}
  	}

 });

router.post('/setSubscription',function(req,res,next) {
	const rtoken = req.body.token;
	const apiKey = req.body.api_key;
	const apiSecret=req.body.api_secret;
	const planId=req.body.plan_id;
	const gradeId=req.body.grade_id;
	const order_id=req.body.order_id;
	const payment_id=req.body.payment_id;
	
	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {
		res.send(JSON.parse(status.unAuthApi()));
	} else {
   		if (rtoken) {
   				//verify token
   				jwtModule.jwtVerify(rtoken,function(callback){
					if (callback){
						jwtModule.jwtGetUserId(rtoken,function(callback){
							const studentId=callback.userId
							//console.log(studentId);
							//dbQuery.getSelect(dbQuery.whereSubscriptionPlan,[studentId,planId],function(callbackUser){
							//	console.log("where subscription plan :"+callbackUser[0].planMode);
							//	if (!callbackUser[0].planMode) {
							//		res.send(JSON.parse(status.invalidPlanId()));
							//	} else {
									dbQuery.getSelect(dbQuery.whereSubscriptionStatus,[planId,gradeId,studentId],function(callbackPeriod){
										if (!callbackPeriod[0]){
											var dateTime=new Date();
											dbQuery.setInsert(dbQuery.insertSubscription,[0,studentId,planId,gradeId,dateTime],function(callbackSubscription){
												if (!callbackSubscription){
													res.send(JSON.parse(status.server()));
												} else {
													dbQuery.setUpdate(dbQuery.updateUserRole,[4,studentId],function(callbackUserRole){
														if (!callbackUserRole){
															res.send(JSON.parse(status.server()));
														} else {
															content=JSON.stringify({"description":"User has been subscribed."});
															res.send(JSON.parse(status.stateSuccess(content)));														}
													});	

												}
											});
										} else {
											console.log("setSubscription :"+callbackPeriod[0]);
											res.send(JSON.parse(status.subscriptionFound()));
										}
									});
							//	}
							//});
						});
					} else {
						res.send(JSON.parse(status.tokenExpired()));
					}
   				});
   				
    		} else {
       		return res.status(403).send(JSON.parse(status.tokenNone()));
  		}
	}
 });


module.exports = router
