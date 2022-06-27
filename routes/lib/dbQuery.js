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
	videoQuestion:"SELECT * FROM mcq_question WHERE mcq_question.video_id=?",
	videoData: "SELECT video.id as videoId, \
					video.lesson_name as heading, \
					video.short_desc as shortDesc, \
					video.long_desc as longDesc \
					FROM video \
					WHERE video.id=?;\
					SELECT mcq_question.id,\
					mcq_question.heading,\
					mcq_question.question \
					FROM mcq_question \
					WHERE mcq_question.video_id=?; \
					SELECT * \
					FROM mcq_option \
					INNER JOIN mcq_question ON mcq_question.option_id=mcq_option.id \
					WHERE mcq_question.video_id=?",
	studentLanguage: "SELECT sl.id as id, sl.language as language, sl.code as code \
						FROM student_language as sl \
						INNER JOIN user_profile ON user_profile.student_language=sl.id \
						WHERE user_profile.student_id = ?;",
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
	profileInfo:"SELECT count(student_answer.user_id) as correctAnswers \
				FROM student_answer \
				INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id \
				WHERE student_answer.user_id=? and mcq_option.state=1; \
					SELECT count(student_answer.user_id) as wrongAnswers \
					FROM student_answer \
					INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id \
					WHERE student_answer.user_id=? and mcq_option.state=0; \
						SELECT count(video.id) as totalLessons \
						FROM video \
						WHERE video.id IN (SELECT mcq_question.video_id \
											FROM mcq_question \
											INNER JOIN student_answer ON student_answer.question_id=mcq_question.id \
											WHERE student_answer.user_id=? \
											GROUP BY mcq_question.video_id); \
							SELECT COUNT(question_id) as totalQuestions FROM student_answer WHERE user_id=?; \
								SELECT user_profile.student_name as studentName, \
								user_profile.student_grade as studentGrade, \
								school.school_name as school, \
								district.district_english as district, \
								province.province_english as province \
								FROM user_profile \
								INNER JOIN school ON user_profile.school_id = school.id \
								INNER JOIN district	ON school.district_id = district.id \
								INNER JOIN province ON province.id = district.province_id \
								WHERE user_profile.student_id =?",
	
	whereLeaderBoard:"SELECT  count(student_answer.user_id) as studentMarks, \
					count(student_answer.id)*? as coins, \
					user_profile.student_name as studentName, \
					school.school_name as schoolName,\
					district.district_english as district,\
					province.province_english as province \
	    				FROM student_answer \
						INNER JOIN user_profile ON user_profile.student_id=student_answer.user_id \
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
	whereStudent: "SELECT * FROM ??  WHERE student_id = ?",
	whereUserProfile: "SELECT * \
						FROM user_profile \
						INNER JOIN school ON user_profile.school_id = school.id \
						INNER JOIN district ON school.district_id = district.id \
						INNER JOIN province ON province.id = district.province_id \
						WHERE user_profile.student_id = ?",
	whereEmail: "SELECT * FROM ?? WHERE email = ?",
	whereEmailOrPhone: "SELECT * FROM ?? WHERE email = ? OR phone = ?",
	whereEmailPasswd: "SELECT * FROM ?? WHERE email = ? and password = ?",
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
						INNER JOIN syllabus ON syllabus.id=syllabus \
						WHERE video.grade=? AND video.subject_id=? ;",
	selectAll: "SELECT * FROM ??",
	whereSchool:"SELECT id,school_name FROM ?? WHERE district_id = ?",
	whereDistrict:"SELECT id,district_name FROM ?? WHERE province_id = ?",
	whereOtpNo:"SELECT * FROM ?? WHERE mobile = ?",
	whereAccessToken:"SELECT * FROM ?? WHERE token = ?",

	insertStudentLikeFavorite:"INSERT INTO  ??(id,user_id,video_id,status) VALUES (?,?,?,?)",	
	insertStudentAnswer:"INSERT INTO  ??(id,user_id,question_id,option_id,started) VALUES (?,?,?,?,?)",	
	insertProfile:"INSERT INTO  ??(id,school_id,student_id,student_name,student_grade) VALUES (?,?,?,?,?)",	
	insertUser:"INSERT INTO  ??(email,password,username,phone,date_joined,last_login,uniqid,is_active,id) VALUES (?,?,?,?,?,?,?,?,?)",	
	insertOauth:"INSERT INTO ??(id,token,created,updated,user_id) VALUES(?,?,?,?,?)",
	insertOtp:"INSERT INTO ??(id,otp,mobile,created,is_verify) VALUES(?,?,?,?,?)",


	updateStudentLanguage:"UPDATE ?? SET student_language=? WHERE student_id=?",
	updateStudentLikeFavorite:"UPDATE ?? SET status=? WHERE user_id=? AND video_id=?",
	updateOtp:"UPDATE ?? SET otp=?, created=? WHERE mobile=?",
	updateIsVerify:"UPDATE ?? SET is_verify=?, created=? WHERE mobile=?",
	updateOauth:"UPDATE ?? SET token=?, updated=? WHERE user_id=?",
	updateLastLogin:"UPDATE ?? SET last_login=? WHERE id = ?",
	updateProfile:"UPDATE ?? SET school_id=?,student_name=?,student_grade=? WHERE student_id=?",
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
				callback(result);
//				log.info("sql result : "+result[0].email);
 			});
			con.release();
 		});
 	},
 	
 	setUserInsert: function(query,fields,callback) {
		log.info("Sql Insert data -> Fields : "+fields+" : query : "+query);
		getConnection(function(con) {
			con.query(query,fields, function (err,result){
				if (err) {
					log.error(fields[0]+" : user insert error");
					callback(false);
				} else {
					log.info(fields[0]+" : user inserted");
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
							mysqlObj.mcq=question.map((questionObj,index) => {
								//console.log(questionObj.id);
								con.query("SELECT id from mcq_option WHERE mcq_option.question_id=?",[questionObj.id], function (err,optionResult){
									questionObj.test="test";
									questionObj.options=optionResult.map((optionObj,index) => {
								console.log("optionResult :"+optionObj);
										return Object.assign({},optionObj);
									});					
								});
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
					var jsonResults = result.map((mysqlObj, index) => {
							mysqlObj.type="file";
							mysqlObj.thumb=properties.vodUrl+'/grade-0'+mysqlObj.grade+'/'+mysqlObj.syllabusE+'/'+mysqlObj.subjectE+'/thumb/'+mysqlObj.fileName+'.jpg';
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
