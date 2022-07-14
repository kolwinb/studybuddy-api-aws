//mysql model
var pool = require('../../models/usermysql.js');

//./status module
var status = require('./status');

//log module
var log = require('./log');

const properties = require('./properties');

var getConnection = function(callback) {
	pool.getConnection(function(err, connection) {
		if(err){
	 		throw err;
//  			log.error("Mysql Connection Error");
  		} else {
  			callback(connection);                                                                       
  		}
  	});                 
  };
                                                          

var dbStatements = {
	//properties

chartSubjectQuestion:"SELECT count(video.id) as totalQuestions, \
					  subject.subject_english as subject\
						FROM student_answer \
						INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id \
						INNER JOIN mcq_question ON mcq_question.id=mcq_option.question_id \
						INNER JOIN video ON video.id=mcq_question.video_id \
						INNER JOIN subject ON subject.id=video.subject_id \
						WHERE student_answer.user_id=? AND video.subject_id IN ( SELECT id FROM subject) group by subject.id;",

	                        
	mcqOption:"SELECT mcq_option.id, mcq_option.option, mcq_option.image, CASE WHEN mcq_option.state=1 THEN 'True' ELSE 'False' END AS isCorrect FROM mcq_option WHERE mcq_option.question_id=?",
				 
	videoData: "SELECT video.id as videoId, \
					video.lesson_name as heading, \
					video.short_desc as shortDesc, \
					video.long_desc as longDesc, \
					video.name as fileName, \
					grade.grade_english as grade, \
					syllabus.syllabus_english as syllabus, \
					subject.subject_english as subject \
					FROM video \
					INNER JOIN subject ON subject.id=video.subject_id \
					INNER JOIN grade ON grade.id=video.grade \
					INNER JOIN syllabus ON syllabus.id=video.syllabus \
					WHERE video.id=?;\
					SELECT mcq_question.id,\
					mcq_question.heading,\
					mcq_question.question, \
					mcq_question.image \
					FROM mcq_question \
					WHERE mcq_question.video_id=?; \
					SELECT mcq_option.id, mcq_option.option, mcq_option.image, CASE WHEN mcq_option.state=1 THEN 'True' ELSE 'False' END AS isCorrect \
					FROM mcq_option \
					INNER JOIN mcq_question ON mcq_question.id=mcq_option.question_id \
					WHERE mcq_question.video_id=?",

	studentLanguage: "SELECT sl.id as id, sl.language as language, sl.code as code \
						FROM student_language as sl \
						INNER JOIN user_profile ON user_profile.language=sl.id \
						WHERE user_profile.user_id = ?;",
	studentFavorites:"SELECT video.id as videoId, \
					video.episode as episode, \
					video.term as term, \
					video.name as fileName, \
					video.lesson as lesson, \
					video.lesson_name as lessonName, \
					video.short_desc as shortDesc, \
					video.long_desc as longDesc, \
					grade.grade_english as grade, \
					syllabus.syllabus_english as syllabus, \
					subject.subject_english as subject \
					FROM video \
					INNER JOIN student_favorite ON student_favorite.video_id=video.id \
					INNER JOIN subject ON subject.id=video.subject_id \
					INNER JOIN grade ON grade.id=video.grade \
					INNER JOIN syllabus ON syllabus.id=video.syllabus \
					WHERE student_favorite.status=1 AND student_favorite.user_id=?;",

	studentLikes:'SELECT COUNT(video.id) as likes, \
					video.id as videoId, \
					video.episode as episode, \
					video.term as term, \
					video.lesson as lesson, \
					video.name as fileName, \
					video.lesson_name as lessonName, \
					video.short_desc as shortDesc, \
					video.long_desc as longDesc, \
					grade.grade_english as grade, \
					syllabus.syllabus_english as syllabus, \
					subject.subject_english as subject \
					FROM video \
					INNER JOIN student_like ON student_like.video_id=video.id \
					INNER JOIN grade ON grade.id=video.grade \
					INNER JOIN syllabus ON syllabus.id=video.syllabus \
					INNER JOIN subject ON subject.id=video.subject_id \
					WHERE student_like.status=1 AND student_like.video_id IN \
						(SELECT video_id \
						FROM student_answer \
						WHERE student_answer.user_id=?) \
						GROUP BY student_like.video_id \
						ORDER BY likes DESC;',
	profileInfo:"SELECT ( \
							SELECT count(student_answer.user_id) as correctAnswers \
							FROM student_answer \
							INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id \
							WHERE student_answer.user_id=? and mcq_option.state=1 \
						) as correctAnswers, \
						( \
							SELECT count(student_answer.user_id) as wrongAnswers \
							FROM student_answer \
							INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id \
							WHERE student_answer.user_id=? and mcq_option.state=0 \
						) as wrongAnswers, \
						( \
							SELECT count(video.id) as totalLessons \
							FROM video \
							WHERE video.id IN (SELECT mcq_question.video_id \
											FROM mcq_question \
											INNER JOIN student_answer ON student_answer.question_id=mcq_question.id \
											WHERE student_answer.user_id=? \
											GROUP BY mcq_question.video_id) \
						) as totalLessons, \
						( \
							SELECT COUNT(question_id) as totalQuestions \
							FROM student_answer  \
							WHERE user_id=? \
						) as totalQuestions; \
								SELECT user_profile.name as studentName, \
								user_profile.avatar_id as avatarId, \
								user_profile.grade as studentGrade, \
								user_profile.address as address, \
								user_profile.favorite_subject as favoriteSubject, \
								user_profile.dateofbirth as dateOfBirth, \
								user_profile.nic as NIC, \
								user_profile.sociallink as socialLink, \
								user_profile.email as email, \
								user_profile.parent_name as parentName, \
								user_profile.parent_contact as parentContact, \
								user_profile.parent_email as parentEmail, \
								user_profile.school_address as schoolAddress, \
								user_profile.school_contact as schoolContact, \
								user_profile.school_email as schoolEmail, \
								user_profile.teacher_name as teacherName, \
								user_profile.teacher_contact as teacherContact, \
								user_profile.teacher_email as teacherEmail, \
								user_subscription.name as subscriptonPlan, \
								CONVERT(user.date_joined,DATETIME) as planStartedAt, \
								CASE \
									WHEN user.plan_id = 1 \
									THEN '' \
									WHEN user.plan_id=2 \
									THEN DATE_ADD(user.date_joined,INTERVAL 7 DAY) \
									WHEN user.plan_id=3 \
									THEN DATE_ADD(user.date_joined,INTERVAL 1 MONTH) \
									WHEN user.plan_id=4 \
									THEN DATE_ADD(user.date_joined,INTERVAL 3 MONTH) \
									WHEN user.plan_id=5 \
									THEN DATE_ADD(user.date_joined,INTERVAL 12 MONTH) \
								END AS planExpIn, \
								school.school_name as school, \
								district.district_english as district, \
								province.province_english as province \
								FROM user_profile \
								INNER JOIN school ON user_profile.school_id = school.id \
								INNER JOIN district	ON school.district_id = district.id \
								INNER JOIN province ON province.id = district.province_id \
								INNER JOIN user ON user.id = user_profile.user_id \
								INNER JOIN user_subscription ON user_subscription.id = user.plan_id \
								WHERE user_profile.user_id =?; \
								SELECT count(video.id) as totalQuestions, \
					  			subject.subject_english as subject\
									FROM student_answer \
									INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id \
									INNER JOIN mcq_question ON mcq_question.id=mcq_option.question_id \
									INNER JOIN video ON video.id=mcq_question.video_id \
									INNER JOIN subject ON subject.id=video.subject_id \
									WHERE student_answer.user_id=? AND video.subject_id IN \
										( SELECT id FROM subject) group by subject.id; \
									SELECT * FROM student_language;",
	
	whereLeaderBoard:"SELECT  count(student_answer.user_id) as studentMarks, \
					count(student_answer.id)*? as coins, \
					user_profile.name as studentName, \
					school.school_name as schoolName,\
					district.district_english as district,\
					province.province_english as province \
	    				FROM student_answer \
						INNER JOIN user_profile ON user_profile.user_id=student_answer.user_id \
						INNER JOIN school ON school.id=user_profile.school_id \
						INNER JOIN district ON district.id=school.district_id \
						INNER JOIN province ON province.id=district.province_id \
						INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id \
						WHERE mcq_option.state=1 \
						GROUP BY student_answer.user_id \
						ORDER BY studentMarks DESC \
						LIMIT 20",
	whereStudentLikeFavorite: "SELECT * FROM ?? WHERE user_id = ? and video_id = ?",
	whereStudentAnswer: "SELECT id FROM ?? WHERE user_id = ?  AND question_id = ?",
	whereQuestionId: "SELECT question_id FROM ?? WHERE id = ?",
	whereOptionState: "SELECT state FROM mcq_option WHERE id = ?",
	whereOptionQuestionVideo: "SELECT mcq_option.id as optionId,\
								mcq_question.id as questionId,\
								video.id as videoId \
								FROM mcq_option \
								INNER JOIN mcq_question ON mcq_question.id = mcq_option.question_id \
								INNER JOIN video ON  video.id = mcq_question.video_id \
								WHERE mcq_option.id = ?",
	whereUser: "SELECT * FROM ??  WHERE id = ?",
	whereUserRole: "SELECT plan_id FROM ??  WHERE id = ?",
	whereStudent: "SELECT * FROM ??  WHERE student_id = ?",
	whereUserProfile: "SELECT * \
						FROM user_profile \
						INNER JOIN school ON user_profile.school_id = school.id \
						INNER JOIN district ON school.district_id = district.id \
						INNER JOIN province ON province.id = district.province_id \
						WHERE user_profile.user_id = ?",
	whereMobile: "SELECT * FROM ?? WHERE phone = ?",
	whereReferrerReferred: "SELECT id as referrer_id FROM user WHERE referral_code=?;SELECT id as referee_id FROM user WHERE phone=?",
	whereAffiliate: "SELECT id FROM user_affiliate WHERE referrer_id=? AND referee_id=?;",
	//whereEmailOrPhone: "SELECT * FROM ?? WHERE email = ? OR phone = ?",
	//whereEmailPasswd: "SELECT * FROM ?? WHERE email = ? and password = ?",
	wherePhonePasswd: "SELECT * FROM ?? WHERE phone = ? and password = ?",
	selectGrade: "SELECT id,grade_english as nameE,\
					grade_sinhala as nameS FROM ??",
	selectSyllabus: "SELECT syllabus.id, \
					 syllabus.syllabus_english as nameE, \
					 syllabus.syllabus_sinhala as nameS \
					 FROM syllabus \
					 INNER JOIN grade_syllabus ON grade_syllabus.syllabus_id=syllabus.id \
					 WHERE grade_syllabus.grade_id=?",
	selectSubject: "SELECT subject.id, \
					subject.subject_english as nameE,\
					subject.subject_sinhala as nameS \
					FROM subject \
					INNER JOIN grade_subject ON grade_subject.subject_id = subject.id \
					WHERE grade_subject.grade_id=?",
	selectLessonList: "SELECT video.id as id, \
						video.grade as grade, \
						CONCAT(video.term,' වන වාරය') as termS, \
						video.episode as episode, \
						video.lesson_name as heading, \
						video.short_desc as shortDesc, \
						video.lesson as lesson, \
						subject.subject_sinhala as subjectS, \
						subject.subject_english as subjectE, \
						video.id as id, \
						syllabus.syllabus_english as syllabusE, \
						syllabus.syllabus_sinhala as syllabusS, \
						video.name as fileName \
						FROM video \
						INNER JOIN subject ON subject.id=video.subject_id \
						INNER JOIN syllabus ON syllabus.id=video.syllabus \
						WHERE video.grade=? AND video.syllabus=? AND video.subject_id=? LIMIT ?; \
						SELECT student_favorite.video_id FROM student_favorite WHERE student_favorite.user_id=?;",
	selectAll: "SELECT * FROM ??",
	whereSchool:"SELECT id,school_name as name FROM ?? WHERE district_id = ?",
	whereProvince:"SELECT id,province_english as nameInEnglish,province_sinhala as nameInSinhala FROM ??",
	whereDistrict:"SELECT id,district_english as nameInEnglish,district_sinhala as nameInSinhala FROM ?? WHERE province_id = ?",
	whereSchool:"SELECT id,school_name as name FROM ?? WHERE district_id = ?",
	whereGrade:"SELECT id,grade_english as nameInEnglish,grade_sinhala as nameInSinhala FROM ??",
	whereOtpNo:"SELECT * FROM ?? WHERE mobile = ?",
	whereAccessToken:"SELECT * FROM ?? WHERE token = ?",

	insertAffiliate:"INSERT INTO user_affiliate(id,referrer_id,referee_id,created) VALUES(?,?,?,?)",
	insertStudentLikeFavorite:"INSERT INTO  ??(id,user_id,video_id,status) VALUES (?,?,?,?)",	
	insertStudentAnswer:"INSERT INTO  ??(id,user_id,question_id,option_id,started) VALUES (?,?,?,?,?)",	
	insertProfile:"INSERT INTO  ??(id,school_id,user_id,name,grade,avatar_id) VALUES (?,?,?,?,?,?)",	
	insertUser:"INSERT INTO  ??(email,password,username,phone,date_joined,last_login,uniqid,is_active,id,plan_id,referral_code,device_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",	
	insertUserAffiliate:"INSERT INTO  ??(id,referrer_id,referred_id,created) VALUES (?,?,?,?)",	
	insertOauth:"INSERT INTO ??(id,token,created,updated,user_id) VALUES(?,?,?,?,?)",
	insertOtp:"INSERT INTO ??(id,otp,mobile,created,is_verify) VALUES(?,?,?,?,?)",
	insertRecoveryCode:"INSERT INTO ??(id,code,mobile,created,is_verify) VALUES(?,?,?,?,?)",

	updateUserPassword:"UPDATE ?? SET password=? WHERE id = ? and phone = ?",
	updateRecoveryCode:"UPDATE ?? SET code=?, created=?, is_verify=? WHERE mobile=?",
	updateRecoveryCodeActivation:"UPDATE ?? SET created=?, is_verify=? WHERE mobile=?",

	updateStudentLanguage:"UPDATE ?? SET student_language=? WHERE student_id=?",
	updateStudentLikeFavorite:"UPDATE ?? SET status=? WHERE user_id=? AND video_id=?",
	updateOtp:"UPDATE ?? SET otp=?, created=? WHERE mobile=?",
	updateIsVerify:"UPDATE ?? SET is_verify=?, created=? WHERE mobile=?",
	updateOauth:"UPDATE ?? SET token=?, updated=? WHERE user_id=?",
	updateLastLogin:"UPDATE ?? SET last_login=? WHERE id = ?",
	updateProfile:"UPDATE ?? SET school_id=?,student_name=?,student_grade=?,avatar_id=? WHERE student_id=?",
	//methods
	
	setSqlUpdate: function(query,fields,callback){
		getConnection(function(con) {
			con.query(query,fields, function (err,result){
				if (err) {
					log.error("db update error");
					callback(false);
				} else {
					log.info("db update done");
					callback(true);
				}
 			});
			con.release();
 		});
	
	},
	setUserSqlQuery: function(query,fields,callback) {
//		log.info("setSqlQuery -> Fields : "+fields+" : query : "+query);
		getConnection(function(con) {
			con.query(query,fields, function (err,result){
				if (err) {
					log.info(err);
				} else {
				callback(result);
//				log.info("sql result : "+result[0].email);
				}
 			});
			con.release();
 		});
 	},
 	
 	setUserInsert: function(query,fields,callback) {
//		log.info("Sql Insert data -> Fields : "+fields+" : query : "+query);
		getConnection(function(con) {
			con.query(query,fields, function (err,result){
				if (err) {
					log.error("mysql error : "+err);
					callback(false);
				} else {
					log.info(fields[0]+" : data inserted");
					callback(true);
				}
//				callback(err);
//				log.info("sql result : "+result[0].email);
 			});
			con.release();
 		});
 	},
 	
 	
 		//query any table
	getSqlFavoriteLike: function(query,fields,callback) {
		getConnection(function(con) {
			con.query(query,fields, function (err,result){
   				if (!result){
   					callback(JSON.stringify(status.server()));
 				} else {
 					//single row
 					//var normalObj = Object.assign({}, results[0]);
					var jsonResults = result.map((mysqlObj, index) => {

							mysqlObj.videoData=[{
										"name":"small",
										"quality":"240p",
							"videoUrl":properties.vodUrl+'/'+mysqlObj.grade+'/'+mysqlObj.syllabus+'/'+mysqlObj.subject+'/playlist/'+mysqlObj.fileName+'_240p.m3u'
										
										},
										{
										"name":"medium",
										"quality":"360p",
							"videoUrl":properties.vodUrl+'/'+mysqlObj.grade+'/'+mysqlObj.syllabus+'/'+mysqlObj.subject+'/playlist/'+mysqlObj.fileName+'_360p.m3u'
										
										},
										{			
										"name":"large",
										"quality":"480p",
							"videoUrl":properties.vodUrl+'/'+mysqlObj.grade+'/'+mysqlObj.syllabus+'/'+mysqlObj.subject+'/playlist/'+mysqlObj.fileName+'_480p.m3u'
										}
										]
    						return Object.assign({}, mysqlObj);
    					});
					//log.info(JSON.stringify(jsonResults));
					callback(JSON.stringify(jsonResults)); 		
			}
		});
		con.release();
	});
	},

	getSqlLesson: function(query,fields,callback) {
		getConnection(function(con) {
			con.query(query,fields, function (err,result){
   				if (!result){
   					callback(JSON.stringify(status.server()));
 				} else {
 					//single row
 					//var normalObj = Object.assign({}, results[0]);
 					const [video,question,option] = result;
 					//console.log("mcqOption :"+option[0].id);
					var jsonVideo = video.map((mysqlObj, index) => {
							//console.log(jsonVideo);
							mysqlObj.videoUrls=[{
										"name":"small",
										"quality":"240p",
										"videoUrl":properties.vodUrl+'/'+mysqlObj.grade+'/'+mysqlObj.syllabus+'/'+mysqlObj.subject+'/playlist/'+mysqlObj.fileName+'_240p.m3u'
										},
										{
										"name":"medium",
										"quality":"360p",
										"videoUrl":properties.vodUrl+'/'+mysqlObj.grade+'/'+mysqlObj.syllabus+'/'+mysqlObj.subject+'/playlist/'+mysqlObj.fileName+'_360p.m3u'
										
										},
										{			
										"name":"large",
										"quality":"480p",
										"videoUrl":properties.vodUrl+'/'+mysqlObj.grade+'/'+mysqlObj.syllabus+'/'+mysqlObj.subject+'/playlist/'+mysqlObj.fileName+'_480p.m3u'
										}
										]
							//append mcq
							varOptionData=JSON.stringify(option);
							//console.log(varOptionData);
							let countIndex=0;
							mysqlObj.mcq=question.map((questionObj,questionIndex) => {
								//console.log(varOptionData);
								//console.log("options :"+varOptions);
								//console.log(jsonOption);
								//console.log(option);
								//console.log(varOptionData);
								//console.log(jsonOption[0].question_id);
								threhold=countIndex+4
								optA=JSON.parse(JSON.stringify(option[countIndex]));
								optB=JSON.parse(JSON.stringify(option[countIndex+1]));
								optC=JSON.parse(JSON.stringify(option[countIndex+2]));
								optD=JSON.parse(JSON.stringify(option[countIndex+3]));
								let optArr = new Array();
								optArr=[optA,optB,optC,optD];
								questionObj.options=optArr;
								countIndex+=properties.optionCount; //question 5 iteration problem
								return 	Object.assign({},questionObj);
							});

    						return Object.assign({}, mysqlObj);
    					});
					//log.info(JSON.stringify(jsonResults));
					callback(JSON.stringify(jsonVideo)); 		
			}
		});
		con.release();
	});
	},

	getOption: function(qid){
		const setQuestionOption=(resultOption) => {
			//console.log(resultOption);
			return resultOption
		}
		getConnection(function(con) {
			con.query("SELECT mcq_option.option FROM ?? WHERE mcq_option.question_id=?",["mcq_option",qid], function (err,result){
   				if (!result){
   					callback(JSON.stringify(status.server()));
 				} else {
					
 					resultOption=result.map((optionObj,index)=> {
							//console.log(optionObj.option);
							return 	Object.assign({},optionObj);
	 					})
	 				
	 				setQuestionOption(resultOption);
 				}
 			});
	 		//con.release();
 		});
	},
	
	getProfileInfo: function(query,fields,callback) {
		getConnection(function(con) {
			con.query(query,fields, function (err,result){
   				if (!result){
   					callback(JSON.stringify(status.server()));
 				} else {
 					//single row
 					//var normalObj = Object.assign({}, results[0]);
 					const [activityData,personalData,chartOfSubject,languageData] = result;
					const chartSubject = chartOfSubject.map((mysqlObj, index) => {
    						return Object.assign({}, mysqlObj);
    					}); 					
    				
					const langList = languageData.map((mysqlObj, index) => {
						return Object.assign({}, mysqlObj);
					}); 					
 					const jsonData={
// 						correctAnswers:correctAnswers[0].correctAnswers,
 //						wrongAnswers:wrongAnswers[0].wrongAnswers,
 //						totalLessons:totalLessons[0].totalLessons,
 //						totalQuestions:totalQuestions[0].totalQuestion,
 //						chartOnSubject:chartSub[0],
 						personalInfo:personalData[0],
 						activityList:activityData[0],
 						chartOfSubject:chartSubject,
 						languageList:langList
 						
 					}
					var jsonResults = result.map((mysqlObj, index) => {
    						return Object.assign({}, mysqlObj);
    					});
					//log.info(JSON.stringify(jsonResults));
					callback(JSON.stringify(jsonData)); 		
			}
		});
		con.release();
	});
	},
	
	//query any table
	getSelectAll: function(query,fields,callback) {
		getConnection(function(con) {
			con.query(query,fields, function (err,result){
   				if (!result){
   					callback(JSON.stringify(status.server()));
 				} else {
 					//single row
 					//var normalObj = Object.assign({}, results[0]);
					var jsonResults = result.map((mysqlObj, index) => {
    						return Object.assign({}, mysqlObj);
    					});
					//log.info(JSON.stringify(jsonResults));
					callback(JSON.stringify(jsonResults)); 		
			}
		});
		con.release();
	});
	},

	//query any table
	getSelectGrade: function(query,fields,callback) {
		getConnection(function(con) {
			con.query(query,fields, function (err,result){
   				if (!result){
   					callback(JSON.stringify(status.server()));
 				} else {
 					//single row
 					//var normalObj = Object.assign({}, results[0]);
					var jsonResults = result.map((mysqlObj, index) => {
							mysqlObj.thumb=properties.thumbUrl+'/'+mysqlObj.nameE+'.jpg';
    						return Object.assign({}, mysqlObj);
    					});
					//log.info(JSON.stringify(jsonResults));
					callback(JSON.stringify(jsonResults)); 		
			}
		});
		con.release();
	});
	},
	
	//query any table
	getSelectSyllabus: function(query,fields,callback) {
		getConnection(function(con) {
			con.query(query,fields, function (err,result){
   				if (!result){
   					callback(JSON.stringify(status.server()));
 				} else {
 					//single row
 					//var normalObj = Object.assign({}, results[0]);
					var jsonResults = result.map((mysqlObj, index) => {
							mysqlObj.thumb=properties.thumbUrl+'/'+mysqlObj.nameE+'.jpg';
    						return Object.assign({}, mysqlObj);
    					});
					//log.info(JSON.stringify(jsonResults));
					callback(JSON.stringify(jsonResults)); 		
			}
		});
		con.release();
	});
	},

	//query any table
	getSelectSubject: function(query,fields,callback) {
		getConnection(function(con) {
			con.query(query,fields, function (err,result){
   				if (!result){
   					callback(JSON.stringify(status.server()));
 				} else {
 					//single row
 					//var normalObj = Object.assign({}, results[0]);
					var jsonResults = result.map((mysqlObj, index) => {
							mysqlObj.thumb=properties.thumbUrl+'/'+mysqlObj.nameE+'.jpg';
    						return Object.assign({}, mysqlObj);
    					});
					//log.info(JSON.stringify(jsonResults));
					callback(JSON.stringify(jsonResults)); 		
			}
		});
		con.release();
	});
	},
	
	//query any table
	getLessonList: function(query,fields,callback) {
		getConnection(function(con) {
			con.query(query,fields, function (err,result){
   				if (!result){
   					callback(JSON.stringify(status.server()));
 				} else {
 					//single row
 					//var normalObj = Object.assign({}, results[0]);
 					const [video,favorite] = result
					var jsonResults = video.map((mysqlObj, index) => {
							mysqlObj.type="directory";
							mysqlObj.thumb=properties.vodUrl+'/grade-0'+mysqlObj.grade+'/'+mysqlObj.syllabusE+'/'+mysqlObj.subjectE+'/thumb/'+mysqlObj.fileName+'.jpg';
							/*
							mysqlObj.favorite=favorite.map((favoriteObj,index) => {
								if (mysqlObj.id == favoriteObj.video_id){
									console.log("video id"+mysqlObj.id);
									return "True"
								}
							});
							*/
    						return Object.assign({}, mysqlObj);
    					});
					//log.info(JSON.stringify(jsonResults));
					callback(JSON.stringify(jsonResults)); 		
			}
		});
		con.release();
	});
	},



	getStudentLike: function(studentId,videoId){
		getConnection(function(con) {
  			con.query("SELECT * FROM student_like WHERE user_id =? and video_id=?",[studentId,videoId],function(err, rows){  
			  	if(!rows[0]){
			  		return "False";
			  	} else {
					return rows[0].status;
  				}
  			});
  			  		con.release();

  		});
  	}

/*
	getStudentLike: function(studentId,videoId){
	  	return new Promise(function(resolve, reject){
  			con.query("SELECT * FROM student_like WHERE user_id =? and video_id=?",[studentId,videoId],function(err, rows){                                                
			  	if(rows === undefined){
  					reject(new Error("Error rows is undefined"));
  				}else{
  					resolve(rows);
  				}
  			})
  		})
  	}
*/	
	
	
}


module.exports = dbStatements;                                    
