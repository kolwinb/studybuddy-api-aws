var express = require('/media/data/opt/nodejs/lib/node_modules/express');
var jwt = require('/media/data/opt/nodejs/lib/node_modules/jsonwebtoken');
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

//apikey
const scope = require('../lib/apiKeys');
const api_key = scope.profileApi.apiKey;
const api_secret = scope.profileApi.apiSecret;

router.post('/info',function(req,res,next) {
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
							dbQuery.setUserSqlQuery(dbQuery.whereUserProfile,[studentId],function(callbackUserProfile){
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

router.post('/adding',function(req,res,next) {
	const rtoken = req.body.token;
	const apiKey = req.body.api_key;
	const apiSecret=req.body.api_secret;
	const schoolId=req.body.school_id;
	const studentName=req.body.name;
	const grade=req.body.grade;
	
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
							dbQuery.setUserSqlQuery(dbQuery.whereUserProfile,[studentId],function(callbackUserProfile){
								if (!callbackUserProfile[0]) {
									dbQuery.setUserInsert(dbQuery.insertProfile,["user_profile","NULL",schoolId,studentId,studentName,grade],function(callbackProfile){
										if (!callbackProfile){
											res.send(JSON.parse(status.server()));
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
 
router.post('/updating',function(req,res,next) {
	const rtoken = req.body.token;
	const apiKey = req.body.api_key;
	const apiSecret=req.body.api_secret;
	const schoolId=req.body.school_id;
	const studentName=req.body.name;
	const grade=req.body.grade;
	
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
							dbQuery.setUserSqlQuery(dbQuery.whereUserProfile,[studentId],function(callbackUserProfile){
								if (!callbackUserProfile[0]) {
									res.send(JSON.parse(status.profileAdding()));
								} else {
									//userprofile already there
									dbQuery.setSqlUpdate(dbQuery.updateProfile,["user_profile",schoolId,studentName,grade,studentId],function(callbackUpdating){
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

router.post('/country',function(req,res,next) {
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
						dbQuery.getSelectAll(dbQuery.selectAll,["countries",""],function(callback){
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


router.post('/province',function(req,res,next) {
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
						dbQuery.getSelectAll(dbQuery.selectAll,["province"],function(callback){
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

router.post('/district',function(req,res,next) {
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
						dbQuery.getSelectAll(dbQuery.whereDistrict,["district",provinceId],function(callback){
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

router.post('/school',function(req,res,next) {
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
							dbQuery.getSelectAll(dbQuery.whereSchool,["school",districtId],function(callback){
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

module.exports = router
