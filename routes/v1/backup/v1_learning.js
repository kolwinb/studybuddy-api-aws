var express = require('../../lib/node_modules/express');
var mclient = require('../../lib/node_modules/mongodb').MongoClient;
var jwt = require('../../lib/node_modules/jsonwebtoken');

var url = "mongodb://192.168.1.110:27017/studybuddy";
var app = express();
var fs = require("fs");
var router = express.Router();

var cert=fs.readFileSync('private.pem');

//custom jwt module
var jwtModule = require('../lib/jwtToken');
const status = require('../lib/status');
const dbQuery = require('../lib/dbQuery');
//apikey
const scope = require('../lib/apiKeys');
const api_key = scope.learningApi.apiKey;
const api_secret = scope.learningApi.apiSecret;
const properties = require('../lib/properties');

//student leaderboard
router.post('/getLeaderboard',function(req,res,next) {
	const rtoken = req.body.token || req.query.token || req.headers['x-access-token'];
   	const apiKey = req.body.api_key;
  	const apiSecret=req.body.api_secret;
  	const gradeId=req.body.grade_id;
//  	const videoId=req.body.video_id;
 	
	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {                    	
		res.send(JSON.parse(status.unAuthApi()));
	} else {
   		if (rtoken) {
				jwtModule.jwtVerify(rtoken,function(callback){
		//			getJwt=JSON.parse(callback);
					if (callback){
						jwtModule.jwtGetUserId(rtoken,function(callback){
							const studentId=callback.userId
							dbQuery.getSelectJson(dbQuery.whereLeaderBoard,[gradeId],function(callback){
								res.send(JSON.parse(status.stateSuccess(callback)));
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


router.post('/setBulkAnswer',function(req,res,next) {
	const authToken = req.header('Authorization');
	const apiKey = req.header('x-api-key');
	const apiSecret = req.header('x-api-secret');
    const bodyJson=JSON.parse(JSON.stringify(req.body));
	
	var respJson={};
	//console.log("authToken : "+authToken+", apiKey: "+apiKey+", apiSecret: "+apiSecret+", bodyJson: "+JSON.stringify(req.body));
	console.log("bodyjson videoId :"+bodyJson[0].videoId);
	if (!authToken){
		console.log("Authorization header missing");
		res.send(JSON.parse(status.authHeader()));
	} else	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {                    	
		res.send(JSON.parse(status.unAuthApi()));
	} else if (bodyJson[0].mcq.length == 0){
		res.send(JSON.parse(status.paramNone()));
	} else {
		const arrToken = authToken.split(" ");
		const rtoken = arrToken[1];
   		if (rtoken) {
				jwtModule.jwtVerify(rtoken,function(callback){
		//			getJwt=JSON.parse(callback);
					if (callback){
						jwtModule.jwtGetUserId(rtoken,function(callback){
							const studentId=callback.userId
							//console.log(studentId);
							let arrJson= {};
							var totalMcqCoins=0;
							var arrLastId=new Array(); //get last insert id
							/* json iteration start here */
							Object.keys(bodyJson).forEach(function(key){
								mcqArr=bodyJson[key].mcq;
								const videoId=bodyJson[key].videoId;
								var arrMcq=[];
								Object.keys(mcqArr).forEach(function(keyA){
									//console.log('key :'+key+', videoId:'+bodyJson[key].videoId+' key :'+keyA+', questionId:'+mcqArr[keyA].questionId);
									const questionId=mcqArr[keyA].questionId;
									const optionId=mcqArr[keyA].optionId;
									const started=mcqArr[keyA].startedAt;
									const ended=mcqArr[keyA].endedAt;
									/* find option has been answered by student */
									dbQuery.getSelect(dbQuery.whereStudentAnswer,["student_answer",studentId,questionId],function(callbackSO){
										if (callbackSO[0]){
													Object.assign(arrJson,{
																"status":status.answerProhibited(),
																"questinId":questionId
																});
													var questionData={
														"questionId":questionId
													}
													if (bodyJson.length-1 == key){
														if (mcqArr.length-1 == keyA){
															res.send(JSON.parse(status.answerProhibited()));
															//console.log(arrJson);
															console.log("length : "+bodyJson.length+" key : "+key+" proibited user action occured");
														}
													}
										} else {
											/* given optionId, questionId, videoId  are validated */
											dbQuery.getSelect(dbQuery.whereOptionQuestionVideo,[optionId],function(callbackOQV){ //verification data
												if (!callbackOQV[0]) {
													res.send(JSON.parse(status.server()));
												} else {
													oId=callbackOQV[0].optionId;
													qId=callbackOQV[0].questionId;
													vId=callbackOQV[0].videoId;
													/* validation success or fail */
													if ((oId == optionId && qId == questionId) && vId == videoId){ //verification with database
														/* insert to student answer and get the last insert id*/
														dbQuery.getAnswerInsertId(dbQuery.insertStudentAnswer,["NULL",studentId,questionId,optionId,started,ended],function(callbackInsertId){
   															if(!callbackInsertId){
																res.send(JSON.parse(status.server()));
															} else {
																/* assign lastinsert id to array */
																const promiseArray = new Promise(function(resolve, reject) {
																	//console.log("insert id :"+callbackInsertId);
																	var arrLength=arrLastId.push(callbackInsertId);
																	/* total video lesson * total questions = total answers*/
																	if (arrLength == (parseInt(bodyJson.length) * parseInt(mcqArr.length))) {
																		console.log("inserId Total : "+arrLength);
																		resolve(arrLastId);
																	}
																});
																/* insert success, get coin according time base */
																promiseArray.then(function(arrLastId) {
																	console.log("json length :"+bodyJson.length+", mcq length :"+mcqArr.length+", arrLastId Length:"+arrLastId.length);
																	console.log("arrLastId list:"+arrLastId.length);
																	dbQuery.getSelect(dbQuery.whereBulkAnswerRewards,[arrLastId],function(callbackOState){
																		if (!callbackOState[0]) {
																			res.send(JSON.parse(status.server()));
																		} else {
																			resStatus=status.stateSuccess(JSON.stringify({
																					"description":"Questions have been updated",
																					"coins":callbackOState[0].coins
																					}));
       																		res.send(JSON.parse(resStatus));
       																	}
       																});
																});    
															}
														});
       												} else {
       												
       													//console.log("questionId :"+questionId +"error"+"student answers again videoId :"+videoId);
       													//responseJson[key].mcq[keyA].status=studentAnswerWarning();
														res.send(JSON.parse(status.studentAnswerWarning()));
       												}
  												}
											});
										}
//Object.assign(respJson,arrJson);
									});
								//arrJson.data={"videoId":key,"mcq":arrMcq};
								});
							});
							/* json iteration ends here */
//							res.send(JSON.parse(JSON.stringify(arrJson)));
//	res.send(JSON.parse(status.studentAnswerWarning()));
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

//set student answer
router.post('/setAnswer',function(req,res,next) {
	const rtoken = req.body.token || req.query.token || req.headers['x-access-token'];
   	const apiKey = req.body.api_key;
  	const apiSecret=req.body.api_secret;
  	const videoId=req.body.video_id;
  	const questionId=req.body.question_id;
  	const optionId=req.body.option_id;
  	const started=req.body.started_at;
  	const ended=req.body.ended_at;
 	
	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {                    	
		res.send(JSON.parse(status.unAuthApi()));
	} else {
   		if (rtoken) {
				jwtModule.jwtVerify(rtoken,function(callback){
		//			getJwt=JSON.parse(callback);
					if (callback){
						jwtModule.jwtGetUserId(rtoken,function(callback){
							const studentId=callback.userId
							//console.log(studentId);
							dbQuery.getSelect(dbQuery.whereStudentAnswer,["student_answer",studentId,questionId],function(callbackSO){
								if (callbackSO[0]){
								//	dbQuery.getSelect(dbQuery.whereQuestionId,["mcq_option",optionId],function(callbackQid){
										//console.log("optionId : "+callbackQid[0].question_id);
								//		if (callbackQid[0].question_id == questionId) {
											res.send(JSON.parse(status.answerProhibited()));
								} else {
									dbQuery.getSelect(dbQuery.whereOptionQuestionVideo,[optionId],function(callbackOQV){ //verification data
										if (!callbackOQV[0]) {
											res.send(JSON.parse(status.server()));
									
										} else {
											oId=callbackOQV[0].optionId
											qId=callbackOQV[0].questionId
											vId=callbackOQV[0].videoId
											const dateNow = new Date();
											//console.log("userId: "+studentId+" : StudentAnswer:QueryData Found -> oId: "+oId+" qId: "+qId+" vId : "+vId)
											if ((oId == optionId && qId == questionId) && vId == videoId){ //verification with database
												dbQuery.setInsert(dbQuery.insertStudentAnswer,["student_answer","NULL",studentId,questionId,optionId,started,ended],function(callbackSAnswer){
   													if(!callbackSAnswer){
   														console.log("answer insert error");
														res.send(JSON.parse(status.server()));
													} else {
														dbQuery.getSelect(dbQuery.whereOptionState,[optionId],function(callbackOState){
															var resAnswer={
																option_id:oId,
																question_id:qId,
																video_id:vId,
															};	
															if (!callbackOState[0].state){
																Object.assign(resAnswer,{"earning":""});
																Object.assign(resAnswer,{"isCorrect":"False"});
																
       															resStatus=status.stateSuccess(JSON.stringify(resAnswer));
       															res.send(JSON.parse(resStatus));							
															} else {
																resAnswer["earning"]=properties.coin;
																resAnswer["isCorrect"]="True";
       															resStatus=status.stateSuccess(JSON.stringify(resAnswer));
       															res.send(JSON.parse(resStatus));						
															}
														});													
													}
												});
       										} else {
												res.send(JSON.parse(status.studentAnswerWarning()));
       										}
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

/*
//like video
router.post('/likes',function(req,res,next) {
	const rtoken = req.body.token || req.query.token || req.headers['x-access-token'];
   	const apiKey = req.body.api_key;
  	const apiSecret=req.body.api_secret;
  	const videoId=req.body.video_id;
 	
	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {                    	
		res.send(JSON.parse(status.unAuthApi()));
	} else {
   		if (rtoken) {
				jwtModule.jwtVerify(rtoken,function(callback){
		//			getJwt=JSON.parse(callback);
					if (callback){
						jwtModule.jwtGetUserId(rtoken,function(callback){
							const studentId=callback.userId
							if (studentId) {
								dbQuery.getSqlFavoriteLike(dbQuery.studentLikes,[studentId],function(callback){
									if (callback["status"]=='error'){
										res.send(JSON.parse(callback));
									} else {
										retJson=JSON.parse(status.stateSuccess(callback));
										//retJson.videoQuality=properties.videoQuality;
										res.send(retJson);
									}
								});															
							}
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
*/

//favorite video
router.post('/getFavorites',function(req,res,next) {
	const rtoken = req.body.token || req.query.token || req.headers['x-access-token'];
   	const apiKey = req.body.api_key;
  	const apiSecret=req.body.api_secret;
 	
	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {                    	
		res.send(JSON.parse(status.unAuthApi()));
	} else {
   		if (rtoken) {
				jwtModule.jwtVerify(rtoken,function(callback){
		//			getJwt=JSON.parse(callback);
					if (callback){
						jwtModule.jwtGetUserId(rtoken,function(callback){
							const studentId=callback.userId
							if (studentId) {
								dbQuery.getSqlFavoriteLike(dbQuery.studentFavorites,[studentId],function(callback){
									if (callback.status=='error'){
										res.send(JSON.parse(callback));
									} else {
										//callback['data'].videoUrl=properties.vodVideoUrl;
										retJson=JSON.parse(status.stateSuccess(callback));
										//retJson.videoUrl=properties.vodVideoUrl;
										//console.log(retJson["data"]);
										res.send(retJson);
									}
								});																						
							}
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

/*
router.post('/like',function(req,res,next) {
	const rtoken = req.body.token || req.query.token || req.headers['x-access-token'];
   	const apiKey = req.body.api_key;
  	const apiSecret=req.body.api_secret;
  	const videoId=req.body.video_id;
 	
	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {                    	
		res.send(JSON.parse(status.unAuthApi()));
	} else {
   		if (rtoken) {
				jwtModule.jwtVerify(rtoken,function(callback){
		//			getJwt=JSON.parse(callback);
					if (callback){
						jwtModule.jwtGetUserId(rtoken,function(callback){
							const studentId=callback.userId
							dbQuery.getSelect(dbQuery.whereUser,["user",studentId],function(callbackUser){
								if (!callbackUser[0]){
									res.send(JSON.parse(status.misbehaviour()));
								} else {
									resData={
										video_id:videoId
									};
									dbQuery.getSelect(dbQuery.whereStudentLikeFavorite,["student_like",studentId,videoId],function(callbackLike){
										if (!callbackLike[0]){
											dbQuery.setInsert(dbQuery.insertStudentLikeFavorite,["student_like","NULL",studentId,videoId,1],function(callbackIlike){
												if (callbackIlike){
													resData.like="True";
													resData.description="like";
                                            		res.send(JSON.parse(status.stateSuccess(JSON.stringify(resData))));
												} else {
                                            		res.send(JSON.parse(status.server()));
												}
											});	
										} else if (callbackLike[0].status == 0) {
											dbQuery.setUpdate(dbQuery.updateStudentLikeFavorite,["student_like",1,studentId,videoId],function(callbackUlike){
												if (callbackUlike){
													resData.like="True";
													resData.description="like";
                                            		res.send(JSON.parse(status.stateSuccess(JSON.stringify(resData))));
												} else {
                                            		res.send(JSON.parse(status.server()));
												}
											});	
										} else if (callbackLike[0].status == 1) {
											dbQuery.setUpdate(dbQuery.updateStudentLikeFavorite,["student_like",0,studentId,videoId],function(callbackUdislike){
												if (callbackUdislike){
													resData.like="False";
 													resData.description="dislike";
                                            		res.send(JSON.parse(status.stateSuccess(JSON.stringify(resData))));
												} else {
                                            		res.send(JSON.parse(status.server()));
												}
											});									
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
*/

router.post('/setFavorite',function(req,res,next) {
	const rtoken = req.body.token || req.query.token || req.headers['x-access-token'];
   	const apiKey = req.body.api_key;
  	const apiSecret=req.body.api_secret;
  	const videoId=req.body.video_id;
 	
	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {                    	
		res.send(JSON.parse(status.unAuthApi()));
	} else {
   		if (rtoken) {
				jwtModule.jwtVerify(rtoken,function(callback){
		//			getJwt=JSON.parse(callback);
					if (callback){
						jwtModule.jwtGetUserId(rtoken,function(callback){
							const studentId=callback.userId
							dbQuery.getSelect(dbQuery.whereUser,["user",studentId],function(callbackUser){
								if (!callbackUser[0]){
									res.send(JSON.parse(status.misbehaviour()));
								} else {
									resData={
										video_id:videoId
									};
									dbQuery.getSelect(dbQuery.whereStudentLikeFavorite,["student_favorite",studentId,videoId],function(callbackFav){
										if (!callbackFav[0]){
											dbQuery.setInsert(dbQuery.insertStudentLikeFavorite,["student_favorite","NULL",studentId,videoId,1],function(callbackIfav){
												if (callbackIfav){
													resData.favorite="True";
													resData.description="favorite";
                                            		res.send(JSON.parse(status.stateSuccess(JSON.stringify(resData))));
												} else {
                                            		res.send(JSON.parse(status.server()));
												}
											});	
										} else if (callbackFav[0].status == 0) {
											dbQuery.setUpdate(dbQuery.updateStudentLikeFavorite,["student_favorite",1,studentId,videoId],function(callbackUfav){
												if (callbackUfav){
													resData.favorite="True";
													resData.description="favorite";
                                            		res.send(JSON.parse(status.stateSuccess(JSON.stringify(resData))));
												} else {
                                            		res.send(JSON.parse(status.server()));
												}
											});	
										} else if (callbackFav[0].status == 1) {
											dbQuery.setUpdate(dbQuery.updateStudentLikeFavorite,["student_favorite",0,studentId,videoId],function(callbackUunfav){
												if (callbackUunfav){
													resData.favorite="False";
													resData.description="unfavorite";
                                            		res.send(JSON.parse(status.stateSuccess(JSON.stringify(resData))));
												} else {
                                            		res.send(JSON.parse(status.server()));
												}
											});									
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

/*
router.post('/favorite',function(req,res,next) {
	const rtoken = req.body.token || req.query.token || req.headers['x-access-token'];
   	const apiKey = req.body.api_key;
  	const apiSecret=req.body.api_secret;
  	const videoId=req.body.video_id;
 	
	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {                    	
		res.send(JSON.parse(status.unAuthApi()));
	} else {
   		if (rtoken) {
				jwtModule.jwtVerify(rtoken,function(callback){
		//			getJwt=JSON.parse(callback);
					if (callback){
						jwtModule.jwtGetUserId(rtoken,function(callback){
							const studentId=callback.userId
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
*/
module.exports = router
