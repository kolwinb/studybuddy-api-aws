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


//get list of all channels
router.post('/',function(req,res,next) {
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
       					var contents = fs.readFileSync("/home/data/opt/nodejs/studybuddy/json/grades.json");
       					resStatus=status.stateSuccess(contents);
       					res.send(JSON.parse(resStatus));						
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
router.post('/:grade',function(req,res,next) {
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
					if (callback){
		      			var grade = req.params.grade
		      			var contents = fs.readFileSync("/home/data/opt/nodejs/studybuddy/json/"+grade+".json");
		      			res.send(JSON.parse(status.stateSuccess(contents)));						
					} else {
						res.send(status.tokenExpired());         
					}      
				}); 
		
    		}else {
       		return res.status(403).send(JSON.parse(status.tokenNone()));
  		}
  	}
 });
 
 
 //get list of syllabus by year from particular channel
router.post('/:grade/:syllabus',function(req,res,next) {
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
					if (callback){
       					var grade = req.params.grade;
       					var syllabus = req.params.syllabus;
       					var contents = fs.readFileSync("/home/data/opt/nodejs/studybuddy/json/"+grade+"_"+syllabus+".json");
       					res.send(JSON.parse(status.stateSuccess(contents)));
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
router.post('/:grade/:syllabus/:subject',function(req,res,next) {
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
					if (callback){
 						jwtModule.jwtGetUserId(rtoken,function(callbackU){
 							const studentId=callbackU.userId;
 							dbQuery.setUserSqlQuery(dbQuery.whereUser,["user",studentId],function(callbackUser){
 								if (!callbackUser[0]){
 					  				res.send(JSON.parse(status.misbehaviour()));
 								} else {
 									const grade = req.params.grade;
									const syllabus=req.params.syllabus;
									const subject = req.params.subject;
									const quality = req.params.quality;
       								var contents = fs.readFileSync("/home/data/opt/nodejs/studybuddy/json/"+grade+"_"+syllabus+"_"+subject+".json");
									//var jsonStringData=JSON.stringify(contents);
									var jsonData=JSON.parse(contents);
									//console.log(jsonData);
									
									jsonData.forEach(data => {
										//console.log(data["videoId"]);
										video_Id=data["videoId"];
										//data["like"]=getLike(studentId,video_Id);
										data["favorite"]='false';
										console.log(dbQuery.getStudentLike(studentId,video_Id));
									});
									/*					
									for (var i in jsonData){
										//console.log(jsonData[i].videoId);
										var video_Id=jsonData[i].videoId;
										var like="False";
										var favorite="False";
										jsonData[i].like=getLike(studentId,video_Id);										
										console.log(getLike(studentId,video_Id).catch(console.log));							
										getLike(studentId,video_Id).then(x => {
											console.log("value : "+x);
										});
										
										//favorites
										
										dbQuery.setUserSqlQuery(dbQuery.whereStudentLikeFavorite,["student_favorite",studentId,videoId],function (callbackFav){
											console.log(callbackFav[0]);
											if (!callbackFav) {
												jsonData[i].favorite="False";
											} else if (callbackFav[0].status == 1) {
												jsonData[i].favorite="True";
											} else if (callbackFav[0].status == 0) {
												jsonData[i].favorite="False";
											}
										});
																				
									}
									*/
       								res.send(JSON.parse(status.stateSuccess(JSON.stringify(jsonData)))); 								
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


async function getLike(studentId,video_Id){
	var retValue="False";
	await dbQuery.setUserSqlQuery(dbQuery.whereStudentLikeFavorite,["student_like",studentId,video_Id],function(callbackLike){
	
			//console.log("video_id : "+video_Id);
	
		if (callbackLike[0]) {
			if (callbackLike[0].status == 1) {
				//console.log(callbackLike[0].status);
				retValue="True";
			} else if (callbackLike[0].status == 0) {
				//console.log(callbackLike[0].status+" : "+studentId+" : "+video_Id);
				retValue="False";
			}
		} else {
			retValue="False";
		}
	
		
	});
	console.log(retValue);
//	return retValue;

}

//get list of video
router.post('/:grade/:syllabus/:subject/:videoId',function(req,res,next) {
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
				if (callback){
       				var grade = req.params.grade;
       				var syllabus=req.params.syllabus;
       				var subject = req.params.subject;
       				var quality = req.params.quality;
       				var videoId = req.params.videoId;
       				var contents = fs.readFileSync("/home/data/opt/nodejs/studybuddy/json/"+grade+"_"+syllabus+"_"+subject+"_"+videoId+".json");
       				res.send(JSON.parse(status.stateSuccess(contents)));
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
