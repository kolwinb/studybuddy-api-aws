var express = require('/media/data/opt/nodejs/lib/node_modules/express');
var mclient = require('/media/data/opt/nodejs/lib/node_modules/mongodb').MongoClient;
var jwt = require('/media/data/opt/nodejs/lib/node_modules/jsonwebtoken');

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

//get list of all channels
router.post('/answer',function(req,res,next) {
	const rtoken = req.body.token || req.query.token || req.headers['x-access-token'];
   	const apiKey = req.body.api_key;
  	const apiSecret=req.body.api_secret;
  	const videoId=req.body.video_id;
  	const questionId=req.body.question_id;
  	const optionId=req.body.option_id;
 	
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
							dbQuery.setUserSqlQuery(dbQuery.whereStudentAnswer,["student_answer",studentId,questionId],function(callbackSO){
								if (callbackSO[0]){
								//	dbQuery.setUserSqlQuery(dbQuery.whereQuestionId,["mcq_option",optionId],function(callbackQid){
										//console.log("optionId : "+callbackQid[0].question_id);
								//		if (callbackQid[0].question_id == questionId) {
											res.send(JSON.parse(status.answerProhibited()));
								} else {
									dbQuery.setUserSqlQuery(dbQuery.whereOptionQuestionVideo,[optionId],function(callbackOQV){ //verification data
										if (!callbackOQV[0]) {
											res.send(JSON.parse(status.server()));
									
										} else {
											oId=callbackOQV[0].optionId
											qId=callbackOQV[0].questionId
											vId=callbackOQV[0].videoId
											const dateNow = new Date();
											//console.log("userId: "+studentId+" : StudentAnswer:QueryData Found -> oId: "+oId+" qId: "+qId+" vId : "+vId)
											if ((oId == optionId && qId == questionId) && vId == videoId){ //verification with database
												dbQuery.setUserInsert(dbQuery.insertStudentAnswer,["student_answer","NULL",studentId,questionId,optionId,dateNow],function(callbackSAnswer){
   													if(!callbackSAnswer){
														res.send(JSON.parse(status.server()));
													} else {
														dbQuery.setUserSqlQuery(dbQuery.whereOptionState,[optionId],function(callbackOState){
															var resAnswer={
																option_id:oId,
																question_id:qId,
																video_id:vId,
															};	
															if (!callbackOState[0].state){
																Object.assign(resAnswer,{"earning":""});
       															resStatus=status.answerIncorrect(JSON.stringify(resAnswer));
       															res.send(JSON.parse(resStatus));							
															} else {
																resAnswer["earning"]=properties.earning;
       															resStatus=status.answerCorrect(JSON.stringify(resAnswer));
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

//like video
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
							if (studentId) {
							
							
							}
						});
					}
				});
		} else {
		
		}
	}
});

//like video
router.post('/like1',function(req,res,next) {
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
					}
				});
		} else {
		
		}
	}
});

//like video
router.post('/like2',function(req,res,next) {
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
					}
				});
		} else {
		
		}
	}
});

//like video
router.post('/like3',function(req,res,next) {
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
					}
				});
		} else {
		
		}
	}
});

module.exports = router
