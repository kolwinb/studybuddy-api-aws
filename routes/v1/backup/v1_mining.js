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
const api_key = scope.miningApi.apiKey;
const api_secret = scope.miningApi.apiSecret;
const properties = require('../lib/properties');

router.post('/getMcqStage',function(req,res,next) {
	const rtoken = req.body.token || req.query.token || req.headers['x-access-token'];
   	const apiKey = req.body.api_key;
  	const apiSecret=req.body.api_secret;
  	const gradeId=req.body.grade_id;
 	
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
							dbQuery.getMiningMcqStage(dbQuery.whereMiningMcqStage,[studentId,gradeId],function(callback){
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

router.post('/getIQLevelList',function(req,res,next) {
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
							dbQuery.getSelectJson(dbQuery.whereIqLevelList,[studentId],function(callback){
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

router.post('/getIqList',function(req,res,next) {
	const rtoken = req.body.token || req.query.token || req.headers['x-access-token'];
   	const apiKey = req.body.api_key;
  	const apiSecret=req.body.api_secret;
  	const levelId=req.body.level_id;
 	
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
								//stageId using indeed of subjectId
								dbQuery.getIqList(dbQuery.whereIqList,[levelId],function(callbackMiningIq){
								//dbQuery.getSelectJson(dbQuery.whereIqList,[levelId],function(callbackMiningIq){
									//console.log("mcqmining :"+callbackMiningMcq);
									res.send(JSON.parse(status.stateSuccess(callbackMiningIq)));
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

router.post('/getMcqList',function(req,res,next) {
	const rtoken = req.body.token || req.query.token || req.headers['x-access-token'];
   	const apiKey = req.body.api_key;
  	const apiSecret=req.body.api_secret;
  	const gradeId=req.body.grade_id;
  	const stageId=req.body.stage_id;
 	const syllabusId=req.body.syllabus_id;
 	
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
							if (stageId > 9) {
								dbQuery.getMiningMcqStage9List(dbQuery.whereMiningMcqRandList,[gradeId,gradeId],function(callbackMiningMcq){
									//console.log("mcqmining :"+callbackMiningMcq);
									res.send(JSON.parse(status.stateSuccess(callbackMiningMcq)));
								});		
							} else if (stageId == 9) {
								//dbQuery.getMiningMcqStage9List(dbQuery.whereMiningMcqStage9List,[gradeId,syllabusId],function(callbackMiningMcq){
								dbQuery.getMiningMcqStage9List(dbQuery.whereMiningMcqStage9List,[gradeId],function(callbackMiningMcq){
									//console.log("mcqmining :"+callbackMiningMcq);
									res.send(JSON.parse(status.stateSuccess(callbackMiningMcq)));
								});		
							} else if (stageId < 9) {
								//stageId using indeed of subjectId
								//dbQuery.getMiningMcqList(dbQuery.whereMiningMcqList,[gradeId,syllabusId,stageId],function(callbackMiningMcq){
								dbQuery.getMiningMcqList(dbQuery.whereMiningMcqList,[gradeId,stageId],function(callbackMiningMcq){
									//console.log("mcqmining :"+callbackMiningMcq);
									res.send(JSON.parse(status.stateSuccess(callbackMiningMcq)));
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

router.post('/setMcqAnswer',function(req,res,next) {
	const authToken = req.header('Authorization');
	const apiKey = req.header('x-api-key');
	const apiSecret = req.header('x-api-secret');
    const bodyJson=JSON.parse(JSON.stringify(req.body));
	
	var respJson={};
	//console.log("authToken : "+authToken+", apiKey: "+apiKey+", apiSecret: "+apiSecret+", bodyJson: "+JSON.stringify(req.body));
	
	if (!authToken){
		console.log("Authorization header missing");
		res.send(JSON.parse(status.authHeader()));
	} else	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {                    	
		res.send(JSON.parse(status.unAuthApi()));
	} else if (!bodyJson){
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
								var arrMcq=[];
								var stageCoin=0;
								stageId=bodyJson[key].stageId;
								if (stageId == 9){
									stageCoin=5;
								} else {
									stageCoin=3
								}
								Object.keys(mcqArr).forEach(function(keyA){
									//console.log('key :'+key+', videoId:'+mcqArr[keyA].lessonId+' key :'+keyA+', questionId:'+mcqArr[keyA].questionId);
									const videoId=mcqArr[keyA].lessonId;
									const questionId=mcqArr[keyA].questionId;
									const optionId=mcqArr[keyA].optionId;
									const started=mcqArr[keyA].startedAt;
									const ended=mcqArr[keyA].endedAt;
									/* find option has been answered by student */
									dbQuery.getSelect(dbQuery.whereMiningAnswer,["mcq_mining_answer",studentId,questionId,stageId],function(callbackMining){ //verification data
										if (callbackMining[0]){
											if (bodyJson.length-1 == key){
												if (mcqArr.length-1 == keyA){
													res.send(JSON.parse(status.answerProhibited()));
													//console.log(arrJson);
													console.log("length : "+bodyJson.length+" key : "+key+" Prohibited user action");
												}
											}   
										} else {
											dbQuery.getSelect(dbQuery.whereOptionQuestionVideo,[optionId],function(callbackOQV){ //verification data
												if (!callbackOQV[0]) {
													//console.log("mining answer database error");
													res.send(JSON.parse(status.server()));
												} else {
													oId=callbackOQV[0].optionId;
													qId=callbackOQV[0].questionId;
													vId=callbackOQV[0].videoId;
													/* validation success or fail */
													if ((oId == optionId && qId == questionId) && vId == videoId){ //verification with database
														//console.log("each of option: "+optionId+" ,question: "+questionId+", lessons: "+videoId+" has been validated");
														/* insert to student answer and get the last insert id*/
														
														dbQuery.getAnswerInsertId(dbQuery.insertMiningMcqAnswer,["NULL",studentId,stageId,questionId,optionId,started,ended],function(callbackInsertId){
   															if(!callbackInsertId){
																res.send(JSON.parse(status.server()));
															} else {
																//console.log("lastInsertId: "+callbackInsertId);
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
																	dbQuery.getSelect(dbQuery.whereMiningMcqRewards,[stageCoin,arrLastId],function(callbackOState){
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
														})
														
       												} else {
       													//res.status(200);
       													res.status(404).json();
       													//console.log("questionId :"+questionId +"error"+"student answers again videoId :"+videoId);
       													//responseJson[key].mcq[keyA].status=studentAnswerWarning();
														//res.send(JSON.parse(status.studentAnswerWarning()));
       												}
  												}
											});
										}
									});
								//Object.assign(respJson,arrJson);
								//arrJson.data={"videoId":key,"mcq":arrMcq};
								});
							});
							/* json iteration ends here */
							//res.send(JSON.parse(JSON.stringify(arrJson)));
							//res.send(JSON.parse(status.studentAnswerWarning()));
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

router.post('/setIqAnswer',function(req,res,next) {
	const authToken = req.header('Authorization');
	const apiKey = req.header('x-api-key');
	const apiSecret = req.header('x-api-secret');
    const bodyJson=JSON.parse(JSON.stringify(req.body));
	
	var respJson={};
	//console.log("authToken : "+authToken+", apiKey: "+apiKey+", apiSecret: "+apiSecret+", bodyJson: "+JSON.stringify(req.body));
	
	if (!authToken){
		console.log("Authorization header missing");
		res.send(JSON.parse(status.authHeader()));
	} else	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {                    	
		res.send(JSON.parse(status.unAuthApi()));
	} else if (!bodyJson){
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
								var arrMcq=[];
								var levelCoin=0;
								levelId=bodyJson[key].levelId;
								levelCoin=properties.iqMineCoin;
								Object.keys(mcqArr).forEach(function(keyA){
									//console.log('key :'+key+', questionId:'+mcqArr[keyA].questionId);
									const questionId=mcqArr[keyA].questionId;
									const optionId=mcqArr[keyA].optionId;
									const started=mcqArr[keyA].startedAt;
									const ended=mcqArr[keyA].endedAt;
									/* find option has been answered by student */
									dbQuery.getSelect(dbQuery.whereStudentAnswer,["iq_answer",studentId,questionId,optionId],function(callbackMining){ //verification data
										if (callbackMining[0]){
											if (bodyJson.length-1 == key){
												if (mcqArr.length-1 == keyA){
													res.send(JSON.parse(status.answerProhibited()));
													//console.log(arrJson);
													console.log("jason array element : "+bodyJson.length+" key : "+key+" Prohibited user action");
												}
											}   
										} else {
											dbQuery.getSelect(dbQuery.whereIqQuestionOption,[optionId],function(callbackOQV){ //verification data
												if (!callbackOQV[0]) {
													//console.log("mining answer database error");
													res.send(JSON.parse(status.server()));
												} else {
													oId=callbackOQV[0].optionId;
													qId=callbackOQV[0].questionId;
													/* validation success or fail */
													if (oId == optionId && qId == questionId) { //verification with database
														//console.log("each of option: "+optionId+" ,question: "+questionId+", has been validated");
														/* insert to student answer and get the last insert id*/
														
														dbQuery.getAnswerInsertId(dbQuery.insertMiningIqAnswer,["NULL",studentId,questionId,optionId,started,ended],function(callbackInsertId){
   															if(!callbackInsertId){
																res.send(JSON.parse(status.server()));
															} else {
																//console.log("lastInsertId: "+callbackInsertId);
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
																/* insert success */
																promiseArray.then(function(arrLastId) {
																	console.log("json length :"+bodyJson.length+", mcq length :"+mcqArr.length+", arrLastId Length:"+arrLastId.length);
																	console.log("arrLastId list:"+arrLastId.length);
																	/* calculate total coins */
																	dbQuery.getSelect(dbQuery.whereMiningIqRewards,[levelCoin,arrLastId],function(callbackOState){
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
														})
														
       												} else {
       													//res.status(200);
       													res.status(404).json();
       													//console.log("questionId :"+questionId +"error"+"student answers again videoId :"+videoId);
       													//responseJson[key].mcq[keyA].status=studentAnswerWarning();
														//res.send(JSON.parse(status.studentAnswerWarning()));
       												}
  												}
											});
										}
									});
								//Object.assign(respJson,arrJson);
								//arrJson.data={"videoId":key,"mcq":arrMcq};
								});
							});
							/* json iteration ends here */
							//res.send(JSON.parse(JSON.stringify(arrJson)));
							//res.send(JSON.parse(status.studentAnswerWarning()));
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

module.exports = router

function temp(){


}
