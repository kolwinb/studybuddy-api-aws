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

//apikey
const scope = require('../lib/apiKeys');
const api_key = scope.vodApi.apiKey;
const api_secret = scope.vodApi.apiSecret;

const dbQuery = require('../lib/dbQuery');

const properties = require('../lib/properties');
//get list of all channels
router.post('/getGradeList',function(req,res,next) {
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
       					//var contents = fs.readFileSync("/home/data/opt/nodejs/studybuddy/json/grades.json");
       					dbQuery.getSelectGrade(dbQuery.selectGrade,["grade"],function(callbackGrade){
       						if(callbackGrade.status=='error'){
       							res.send(JSON.parse(callbackGrade))
       						} else {
       							resJson={
       								"list":JSON.parse(callbackGrade),
       								"titleS":"ශ්‍රේණිය",
       								"titleE":"Grades",
       								"type":"directory"	
       							}
		       					resStatus=status.stateSuccess(JSON.stringify(resJson));
       							res.send(resStatus);						
       						}
       					});
					} else {
						res.send(status.tokenExpired());         
					}      
				}); 
		
    	}else {
       		return res.status(403).send(JSON.parse(status.tokenNone()));
  		}
  	}
 });

//get list of all subject from particular channel
router.post('/getSyllabusList',function(req,res,next) {
	const rtoken = req.body.token || req.query.token || req.headers['x-access-token'];
   	const apiKey = req.body.api_key;
  	const apiSecret=req.body.api_secret;
  	const gradeId=req.body.grade_id;
	console.log("gradeId : "+gradeId); 	
	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {                    	
		res.send(JSON.parse(status.unAuthApi()));
	} else {
   		if (rtoken) {
				jwtModule.jwtVerify(rtoken,function(callback){
					if (callback){
		      			//var grade = req.params.grade
		      			//var contents = fs.readFileSync("/home/data/opt/nodejs/studybuddy/json/"+grade+".json");
       					dbQuery.getSelectSyllabus(dbQuery.selectSyllabus,[gradeId],function(callbackSyllabus){
       						varCallback=JSON.parse(callbackSyllabus);
       						if(varCallback.status=='error'){
       							res.send(varCallback)
       						} else {
       							resJson={
       								"list":varCallback,
       								"titleS":"විෂය නිර්දේශයන්",
       								"titleE":"Syllabus",
       								"type":"directory"	
       							}
		       					resStatus=status.stateSuccess(JSON.stringify(resJson));
       							res.send(resStatus);						
       						}
       					});
					} else {
						res.send(status.tokenExpired());         
					}      
				}); 
		
    		}else {
       		return res.status(403).send(JSON.parse(status.tokenNone()));
  		}
  	}
 });
 
 //get list of all subject from particular channel
router.post('/getSubjectList',function(req,res,next) {
	const rtoken = req.body.token || req.query.token || req.headers['x-access-token'];
   	const apiKey = req.body.api_key;
  	const apiSecret=req.body.api_secret;
  	const gradeId=req.body.grade_id;
  	const syllabusId=req.body.syllabus_id;
 	
	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {                    	
		res.send(JSON.parse(status.unAuthApi()));
	} else {
   		if (rtoken) {
				jwtModule.jwtVerify(rtoken,function(callback){
					if (callback){
		      			//var grade = req.params.grade
		      			//var contents = fs.readFileSync("/home/data/opt/nodejs/studybuddy/json/"+grade+".json");
       					dbQuery.getSelectSubject(dbQuery.selectSubject,[gradeId],function(callbackSubject){
       						varCallback=JSON.parse(callbackSubject);
       						if(varCallback.status=='error'){
       							res.send(varCallback)
       						} else {
       							resJson={
       								"list":varCallback,
       								"titleS":"විෂයන්",
       								"titleE":"Subjects",
       								"type":"directory"	
       							}
		       					resStatus=status.stateSuccess(JSON.stringify(resJson));
       							res.send(resStatus);						
       						}
       					});
					} else {
						res.send(status.tokenExpired());         
					}      
				}); 
		
    		}else {
       		return res.status(403).send(JSON.parse(status.tokenNone()));
  		}
  	}
 });
 
router.post('/getLessonList',function(req,res,next) {
	const rtoken = req.body.token || req.query.token || req.headers['x-access-token'];
   	const apiKey = req.body.api_key;
  	const apiSecret=req.body.api_secret;
  	const gradeId=req.body.grade_id;
  	const subjectId=req.body.subject_id;
 	const syllabusId=req.body.syllabus_id;
 	
 	console.log(syllabusId);
	if ((!apiKey || !apiSecret)){
		res.send(JSON.parse(status.unAuthApi()));
	} else if ((apiKey != api_key) && (apiSecret != api_secret)) {                    	
		res.send(JSON.parse(status.unAuthApi()));
	} else {
   		if (rtoken) {
				jwtModule.jwtVerify(rtoken,function(callback){
					if (callback){
		      			//var grade = req.params.grade
		      			//var contents = fs.readFileSync("/home/data/opt/nodejs/studybuddy/json/"+grade+".json");
						jwtModule.jwtGetUserId(rtoken,function(callbackU){
 							const studentId=callbackU.userId;
 							//console.log("getLessonList :"+studentId);
 							dbQuery.getSelect(dbQuery.whereUserRole,[studentId,gradeId],function(callbackRole){
 								console.log("whereUserRole :"+callbackRole[0]);
 								if (!callbackRole[0]){
 									res.send(JSON.parse(status.server()));
 								} else {
 									//console.log('roleId : '+callbackRole[0].role_id+', lessonLimit :"+callbackRole[0].planLimit);
 									const planLimit=callbackRole[0].planLimit;
 									//const planStarted=callbackRole[0].plan_started;
 									//switch(planLimit){
 									//case 0:
 									if (planLimit == 0){
  										console.log("student id :"+studentId+" plan Limit :" + planLimit);
										res.send(JSON.parse(status.planExpired()));
 										/*
       									//dbQuery.getLessonList(dbQuery.selectLessonList,[studentId,studentId,studentId,gradeId,syllabusId,subjectId,properties.lessonUnlimit,studentId],function(callbackLessonList){
       									dbQuery.getLessonList(dbQuery.selectLessonList,[studentId,studentId,studentId,gradeId,syllabusId,subjectId,planLimit,studentId],function(callbackLessonList){
       										varCallback=JSON.parse(callbackLessonList);
       										if(varCallback.status=='error'){
       											res.send(JSON.parse(varCallback))
       										} else {
		       									resStatus=status.stateSuccess(JSON.stringify(varCallback));
       											res.send(resStatus);						
       										}
       									});
       									*/
       								//	break;
       								
       								//case (> 0):
       								} else {
       									dbQuery.getLessonList(dbQuery.selectLessonList,[studentId,studentId,studentId,gradeId,syllabusId,subjectId,planLimit,studentId],function(callbackLessonList){
       										varCallback=JSON.parse(callbackLessonList);
       										if(varCallback.status=='error'){
       											res.send(JSON.parse(varCallback))
       										} else {
		       									resStatus=status.stateSuccess(JSON.stringify(varCallback));
       											res.send(resStatus);						
       										}
       									});       								
       									//break;
       								}
       							}
       						});
       					});
					} else {
						res.send(status.tokenExpired());         
					}      
				}); 
		
    		}else {
       		return res.status(403).send(JSON.parse(status.tokenNone()));
  		}
  	}
 });
 
//get list of video
router.post('/getLesson',function(req,res,next) {
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
					if (callback){
 						jwtModule.jwtGetUserId(rtoken,function(callbackU){
 							const studentId=callbackU.userId;
 							dbQuery.getSelect(dbQuery.whereUser,["user",studentId],function(callbackUser){
 								if (!callbackUser[0]){
 					  				res.send(JSON.parse(status.misbehaviour()));
 								} else {
 									dbQuery.getSelect(dbQuery.whereUserRoleLesson,[studentId,videoId],function(callbackRole){
 										console.log("wherePlanStatus :"+callbackRole[0].planStatus);
 										if (!callbackRole[0]){
 											res.send(JSON.parse(status.server()));
 										} else if (!callbackRole[0].planStatus) {
											res.send(JSON.parse(status.planExpired()));
 										} else {
											dbQuery.getLesson(dbQuery.videoData,[videoId,videoId,videoId],function(callbackLesson){
												varLesson=JSON.parse(callbackLesson)
												//console.log("callbackUser "+callbackUser);
												//console.log(callbackLesson);
	       										res.send(JSON.parse(status.stateSuccess(JSON.stringify(varLesson)))); 
		
											});	
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
 
 router.post('/getLessonToken',function(req,res,next) {
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
					if (callback){
 						jwtModule.jwtGetUserId(rtoken,function(callbackU){
 							const studentId=callbackU.userId;
 							dbQuery.getSelect(dbQuery.whereUser,["user",studentId],function(callbackUser){
 								if (!callbackUser[0]){
 					  				res.send(JSON.parse(status.misbehaviour()));
 								} else {
									dbQuery.getLesson(dbQuery.videoData,[videoId,videoId,videoId],function(callbackLesson){
										varLesson=JSON.parse(callbackLesson)
										//console.log("callbackUser "+callbackUser);
										//console.log(callbackLesson);
	       								res.send(JSON.parse(status.stateSuccess(JSON.stringify(varLesson)))); 

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
 

module.exports = router
