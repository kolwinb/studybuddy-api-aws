var fs = require('fs');
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

function getRewards(){
return " \
		( \
			SELECT ("+getOptionRewards('sa')+") as reward \
			FROM student_answer AS sa \
			INNER JOIN mcq_option AS mo ON mo.id=sa.option_id \
			WHERE sa.user_id=user.id AND mo.state=1 \
		) + \
		( \
			SELECT ("+getProfileRewards('up')+") as profileRewards \
			FROM user_profile as up \
			WHERE up.user_id=user.id \
		) + \
		( \
			"+getMcqMiningRewards()+" \
		) \
		+ \
		( \
			"+getIqMiningRewards()+" \
		) \
		+ \
		( \
			SELECT IFNULL(SUM(coin_pool.coin),0) \
			FROM coin_pool \
			WHERE coin_pool.user_id = user.uniqid \
		) \
		"
}

/* getTotalRewards */
function getTotalRewards(){
return " \
	SUM( \
		"+getRewards()+" \
	) as totalRewards, \
	( \
		"+getMcqMiningRewards()+" \
	) as mcqMiningRewards, \
	( \
		"+getIqMiningRewards()+" \
	) as iqMiningRewards, \
	( \
	SELECT "+getProfileRewards('user_profile')+" \
		FROM user_profile \
		WHERE user_profile.user_id=user.id \
	) as profileRewards, \
	( \
		SELECT ("+getOptionRewards('sa')+") as reward \
		FROM student_answer AS sa \
		INNER JOIN mcq_option AS mo ON mo.id=sa.option_id \
		WHERE sa.user_id=user.id AND mo.state=1 \
	) as lessonRewards, \
	( \
		SELECT IFNULL(SUM(coin_pool.coin),0) \
		FROM coin_pool \
		WHERE coin_pool.user_id = user.uniqid \
	) as battleRewards \
	"
}

/* individual property of profile attribute coins */
function getProfileAttRewards(tableName) {
return " \
	@bonus := "+escape(properties.reward.bonus)+" AS bonus, \
  	(CASE \
  		WHEN "+tableName+".address IS NULL \
		  	THEN 0 \
  			ELSE "+escape(properties.reward.address)+" \
  	END) AS address, \
  	(CASE \
  		WHEN "+tableName+".favorite_subject IS NULL \
		  	THEN 0 \
			ELSE "+escape(properties.reward.favoriteSubject)+" \
	END) AS favoriteSubject, \
 	(CASE \
 		WHEN "+tableName+".ambition IS NULL \
 			THEN 0 \
 			ELSE "+escape(properties.reward.ambition)+" \
 	END) AS ambition, \
 	(CASE \
 		WHEN "+tableName+".dateofbirth IS NULL \
 			THEN 0 \
 			ELSE "+escape(properties.reward.birthday)+" \
 	END) AS birthday, \
	(CASE \
		WHEN "+tableName+".nic IS NULL \
 			THEN 0 \
 			ELSE "+escape(properties.reward.nic)+" \
 	END) AS nic, \
	(CASE \
 		WHEN "+tableName+".sociallink IS NULL \
 			THEN 0 \
 			ELSE "+escape(properties.reward.socialLink)+" \
 	END) socialLink, \
	(CASE \
 		WHEN "+tableName+".email IS NULL \
 			THEN 0 \
 			ELSE "+escape(properties.reward.email)+" \
 	END) AS email, \
	(CASE \
 		WHEN "+tableName+".parent_name IS NULL \
 			THEN 0 \
 			ELSE "+escape(properties.reward.parentName)+" \
 	END) AS parentName, \
	(CASE \
 		WHEN "+tableName+".parent_contact IS NULL \
 			THEN 0 \
 			ELSE "+escape(properties.reward.parentContact)+" \
 	END) AS parentContact, \
	(CASE \
 		WHEN "+tableName+".parent_email IS NULL \
 			THEN 0 \
 			ELSE "+escape(properties.reward.parentEmail)+" \
 	END) AS parentEmail, \
	(CASE \
		WHEN "+tableName+".school_address IS NULL \
			THEN 0 \
			ELSE "+escape(properties.reward.schoolAddress)+" \
	END) AS schoolAddress, \
	(CASE \
		WHEN "+tableName+".school_contact IS NULL \
			THEN 0 \
			ELSE "+escape(properties.reward.schoolContact)+" \
	END) AS schoolContact, \
	(CASE \
		WHEN "+tableName+".school_email IS NULL \
			THEN 0 \
			ELSE "+escape(properties.reward.schoolEmail)+" \
	END) AS schoolEmail, \
	(CASE \
		WHEN "+tableName+".teacher_name IS NULL \
			THEN 0 \
			ELSE "+escape(properties.reward.teacherName)+" \
	END) AS teacherName, \
	(CASE \
		WHEN "+tableName+".teacher_contact IS NULL \
			THEN 0 \
			ELSE "+escape(properties.reward.teacherContact)+" \
	END) AS teacherContact, \
	(CASE \
		WHEN "+tableName+".teacher_email IS NULL \
			THEN 0 \
			ELSE "+escape(properties.reward.teacherEmail)+" \
	END) AS teacherEmail \
	";
}

/* calculate profile attribute rewards */
function getProfileRewards(tableName) {
return 	"(SUM( \
		"+escape(properties.reward.bonus)+" + \
		CASE \
			WHEN "+tableName+".address IS NULL OR "+tableName+".address ='' \
				THEN 0 \
				ELSE "+escape(properties.reward.address)+" \
		END + \
		CASE \
		WHEN "+tableName+".favorite_subject IS NULL OR "+tableName+".favorite_subject='' \
			THEN 0 \
			ELSE "+escape(properties.reward.favoriteSubject)+" \
		END + \
		CASE \
			WHEN "+tableName+".ambition IS NULL OR "+tableName+".ambition=''  \
				THEN 0 \
				ELSE "+escape(properties.reward.ambition)+" \
		END + \
		CASE \
			WHEN "+tableName+".dateofbirth IS NULL OR "+tableName+".dateofbirth='' \
				THEN 0 \
				ELSE "+escape(properties.reward.birthday)+" \
		END + \
		CASE \
			WHEN "+tableName+".nic IS NULL OR "+tableName+".nic='' \
				THEN 0 \
				ELSE "+escape(properties.reward.nic)+" \
		END + \
		CASE \
			WHEN "+tableName+".sociallink IS NULL OR "+tableName+".sociallink='' \
				THEN 0 \
				ELSE "+escape(properties.reward.socialLink)+" \
		END + \
		CASE \
			WHEN "+tableName+".email IS NULL OR "+tableName+".email='' \
				THEN 0 \
				ELSE "+escape(properties.reward.email)+" \
		END + \
   		CASE \
   			WHEN "+tableName+".parent_name IS NULL OR "+tableName+".parent_name='' \
   				THEN 0 \
   				ELSE "+escape(properties.reward.parentName)+" \
   		END + \
   		CASE \
   			WHEN "+tableName+".parent_contact IS NULL OR "+tableName+".parent_contact='' \
   				THEN 0 \
   				ELSE "+escape(properties.reward.parentContact)+" \
   		END + \
   		CASE \
   			WHEN "+tableName+".parent_email IS NULL OR "+tableName+".parent_email='' \
   				THEN 0 \
   				ELSE "+escape(properties.reward.parentEmail)+" \
   		END + \
   		CASE \
   			WHEN "+tableName+".school_address IS NULL OR "+tableName+".school_address='' \
   				THEN 0 \
   				ELSE "+escape(properties.reward.schoolAddress)+" \
   		END + \
   		CASE \
   			WHEN "+tableName+".school_contact IS NULL OR "+tableName+".school_contact='' \
   				THEN 0 \
   				ELSE "+escape(properties.reward.schoolContact)+" \
   		END + \
   		CASE \
   			WHEN "+tableName+".school_email IS NULL OR "+tableName+".school_email='' \
   				THEN 0 \
   				ELSE "+escape(properties.reward.schoolEmail)+" \
   		END + \
   		CASE \
   			WHEN "+tableName+".teacher_name IS NULL OR "+tableName+".teacher_name='' \
   				THEN 0 \
   				ELSE "+escape(properties.reward.teacherName)+" \
   		END + \
  		CASE \
  			WHEN "+tableName+".teacher_contact IS NULL OR "+tableName+".teacher_contact='' \
  				THEN 0 \
  				ELSE "+escape(properties.reward.teacherContact)+" \
  		END + \
  		CASE \
  			WHEN "+tableName+".teacher_email IS NULL OR "+tableName+".teacher_email='' \
  				THEN 0 \
  				ELSE "+escape(properties.reward.teacherEmail)+" \
  		END \
	))";
}                                                          

/* query string for getting student answer option rewards base on time condition */

function getOptionRewards(tableName){
return " \
	(CASE WHEN COUNT("+tableName+".id) = 0 \
		THEN 0 \
		ELSE \
			SUM(CASE \
				WHEN TIMESTAMPDIFF(SECOND,"+tableName+".started,"+tableName+".ended) > 0 AND TIMESTAMPDIFF(SECOND,"+tableName+".started,"+tableName+".ended) <= 15 \
					THEN 100 \
					ELSE 0 \
				END + \
				CASE \
				WHEN TIMESTAMPDIFF(SECOND,"+tableName+".started,"+tableName+".ended) > 15 AND TIMESTAMPDIFF(SECOND,"+tableName+".started,"+tableName+".ended) <= 30 \
					THEN 75 \
					ELSE 0 \
				END + \
				CASE \
				WHEN TIMESTAMPDIFF(SECOND,"+tableName+".started,"+tableName+".ended) > 30 AND TIMESTAMPDIFF(SECOND,"+tableName+".started,"+tableName+".ended) <= 45 \
					THEN 50 \
					ELSE 0 \
				END + \
				CASE \
				WHEN TIMESTAMPDIFF(SECOND,"+tableName+".started,"+tableName+".ended) > 45 AND TIMESTAMPDIFF(SECOND,"+tableName+".started,"+tableName+".ended) <= 60 \
					THEN 25 \
					ELSE 0 \
				END) \
		END)";
}

function getMcqMiningRewards(){
return " \
	SELECT ( \
			CASE WHEN mma.stage_id = 9 \
				THEN COUNT(mma.id)* "+properties.mcqMine9_Coin+" \
				ELSE COUNT(mma.id)* "+properties.mcqMine1_8Coin+" \
			END) \
	FROM mcq_mining_answer as mma \
	INNER JOIN mcq_option ON mcq_option.id=mma.option_id \
	WHERE mma.user_id=user.id AND mcq_option.state=1"
}

function getIqMiningRewards(){
return " \
	SELECT COUNT(iq_answer.id)* "+properties.iqMineCoin+" \
	FROM iq_answer \
	INNER JOIN iq_option ON iq_option.id=iq_answer.option_id \
	WHERE iq_answer.user_id=user.id AND iq_option.state=1"
}

function getMiningMcqCoin(stageNo){
if (stageNo == 9){
	return 5
} else  {
	return 3
}
}
var dbStatements = {
	//properties

/* bulk answer coin calculation */
whereBulkAnswerRewards:"SELECT \
							("+getOptionRewards('student_answer')+") AS coins \
						FROM student_answer \
						INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id \
						WHERE student_answer.id IN (?) AND mcq_option.state=1;",
/* mining mcq */ 						
whereMiningMcqRewards:"SELECT \
							(COUNT(mcq_mining_answer.id)*?) AS coins \
						FROM mcq_mining_answer \
						INNER JOIN mcq_option ON mcq_option.id=mcq_mining_answer.option_id \
						WHERE mcq_mining_answer.id IN (?) AND mcq_option.state=1;",
/* iq rewards */
whereMiningIqRewards:"SELECT \
							(COUNT(iq_answer.id)*?) AS coins \
						FROM iq_answer \
						INNER JOIN iq_option ON iq_option.id=iq_answer.option_id \
						WHERE iq_answer.id IN (?) AND iq_option.state=1;",
/* iq mining */
whereIqLevelList:"SELECT \
					iq.levelId as levelId, \
					iq.levelName as levelName, \
					iq.hasCompleted as hasCompleted \
					FROM  ( \
						SELECT \
						id, \
						level as levelId, \
						@name:=CONCAT('Level ',level) as levelName, \
						( \
							CASE WHEN (SELECT iq_answer.id FROM iq_answer WHERE iq_answer.question_id=iq_question.id AND user_id=?) IS NULL \
								THEN 'False' \
								ELSE 'True' \
							END	\
						) as hasCompleted \
						FROM iq_question \
						GROUP BY level \
					) AS iq \
					ORDER BY iq.id ASC;",
					
whereIqList:"SELECT \
			iq_question.level as levelId, \
			iq_question.id as questionId, \
			iq_question.question as question, \
			iq_option.id as optionId, \
			iq_option.option, \
			( \
				CASE WHEN iq_option.state = 1 \
					THEN 'True' \
					ELSE 'False' \
				END \
			) as isCorrect \
			FROM iq_question \
			INNER JOIN iq_option ON iq_option.question_id=iq_question.id \
			WHERE level = ? \
			;",
/* MCQMining  stage 1 to 8*/
whereMiningMcqList:"SELECT \
			video.id as lessonId, \
			mcq_question.id as questionId, \
			mcq_question.heading as heading, \
			mcq_question.question as question, \
			mcq_question.image as image, \
			subject.subject_english as subject, \
			grade.grade_english as grade, \
			mcq_option.id as optionId, \
			mcq_option.option as answer, \
			mcq_option.image as image, \
			( \
				CASE WHEN mcq_option.state = 1 \
					THEN 'True' \
					ELSE 'False' \
				END \
			) as isCorrect \
			FROM ( \
					SELECT * \
					FROM video \
					WHERE video.grade = ?  AND video.subject_id =? /* AND video.syllabus = ? */ \
					/* GROUP BY video.subject_id */ \
				 ) AS video \
			INNER JOIN mcq_question ON mcq_question.video_id=video.id \
			INNER JOIN mcq_option ON mcq_option.question_id=mcq_question.id \
			INNER JOIN subject ON subject.id=video.subject_id \
			INNER JOIN grade ON grade.id=video.grade \
			/* LIMIT 20 */ LIMIT 12 \
			;",			
/* MCQMining  stage 9*/
whereMiningMcqStage9List:"SELECT \
			video.id as lessonId, \
			mcq_question.id as questionId, \
			mcq_question.heading as heading, \
			mcq_question.question as question, \
			mcq_question.image as image, \
			subject.subject_english as subject, \
			grade.grade_english as grade, \
			mcq_option.id as optionId, \
			mcq_option.option as answer, \
			mcq_option.image as image, \
			( \
				CASE WHEN mcq_option.state = 1 \
					THEN 'True' \
					ELSE 'False' \
				END \
			) as isCorrect \
			FROM ( \
					SELECT * \
					FROM video \
					WHERE video.grade = ? /*  AND video.syllabus = ? */ \
					GROUP BY video.subject_id \
				 ) AS video \
			INNER JOIN mcq_question ON mcq_question.video_id=video.id \
			INNER JOIN mcq_option ON mcq_option.question_id=mcq_question.id \
			INNER JOIN subject ON subject.id=video.subject_id \
			INNER JOIN grade ON grade.id=video.grade \
			;",
/* whereMiningStage */
whereMiningMcqStage: "SELECT \
					subject.id as stageId, \
					@level := CONCAT('Stage ',subject.id) as stageName, \
					subject.subject_english as nameE, \
					subject.subject_sinhala as nameS, \
					(CASE WHEN subject.id = \
					 ( \
									SELECT stage_id \
									FROM mcq_mining_answer \
									WHERE stage_id = subject.id AND user_id =? \
									GROUP BY stage_id) \
							THEN 'True' \
							ELSE 'False' \
					END) as hasCompleted \
					FROM subject \
					INNER JOIN grade_subject ON grade_subject.subject_id = subject.id \
					WHERE grade_subject.grade_id=?; \
				SELECT @lastStage := COUNT(subject.id)+1 as stageId, \
					@level := CONCAT('Stage ',COUNT(subject.id)+1) as stageName, \
					@nameE := 'All subjects' as nameE, \
					(CASE WHEN 9 = \
					 ( \
									SELECT DISTINCT stage_id \
									FROM mcq_mining_answer \
									WHERE stage_id = 9 AND user_id =?) \
							THEN 'True' \
							ELSE 'False' \
					END) as hasCompleted \
					FROM subject \
					INNER JOIN grade_subject ON grade_subject.subject_id = subject.id \
					WHERE grade_subject.grade_id=?;",

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
	profileInfo:" \
				/* actvities */ \
				SELECT ( \
							SELECT count(student_answer.user_id) as correctAnswers \
							FROM student_answer \
							INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id \
							WHERE student_answer.user_id=user.id and mcq_option.state=1 \
						) as correctAnswers, \
						( \
							SELECT count(student_answer.user_id) as wrongAnswers \
							FROM student_answer \
							INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id \
							WHERE student_answer.user_id=user.id AND mcq_option.state=0 \
						) as wrongAnswers, \
						( \
							SELECT count(video.id) as totalLessons \
							FROM video \
							WHERE video.id IN (SELECT mcq_question.video_id \
											FROM mcq_question \
											INNER JOIN student_answer ON student_answer.question_id=mcq_question.id \
											WHERE student_answer.user_id=user.id \
											GROUP BY mcq_question.video_id) \
						) as totalLessons, \
						( \
							SELECT COUNT(question_id) as totalQuestions \
							FROM student_answer  \
							WHERE user_id=user.id \
						) as totalQuestions \
				FROM user \
				WHERE user.id=?; \
				/* personal information */ \
				SELECT user_profile.name as studentName, \
					(SELECT grade.grade_english FROM grade WHERE grade.id=user_profile.grade_id) as studentGrade, \
					user_profile.grade_id as gradeId, \
					user_profile.avatar_id as avatarId, \
					user_profile.school_id as schoolId, \
					user.referral_code as referralCode, \
					user_profile.avatar_id as avatarId, \
					user_profile.address as address, \
					user_profile.favorite_subject as favoriteSubject, \
					user_profile.ambition as ambition, \
					DATE_FORMAT(user_profile.dateofbirth,'%Y-%m-%d') as birthday, \
					user_profile.nic as nic, \
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
					user_role.name as userRole, \
					school.school_name as school, \
					district.district_english as district, \
					province.province_english as province, \
					student_language.language as language \
				FROM user_profile \
				INNER JOIN school ON user_profile.school_id = school.id \
				INNER JOIN district	ON school.district_id = district.id \
				INNER JOIN province ON province.id = district.province_id \
				INNER JOIN user ON user.id = user_profile.user_id \
				INNER JOIN user_role ON user_role.id = user.role_id \
				INNER JOIN student_language ON student_language.id=user_profile.language_id \
				WHERE user_profile.user_id = ?; \
				/* chart of Total Lessons by subject */ \
				SELECT count(DISTINCT(video.id)) as totalLessons, \
					subject.subject_english as subject \
					FROM student_answer \
					/* \
					INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id \
					*/ \
					INNER JOIN mcq_question ON mcq_question.id=student_answer.question_id \
					INNER JOIN video ON video.id=mcq_question.video_id \
					INNER JOIN subject ON subject.id=video.subject_id \
					WHERE student_answer.user_id=? AND video.subject_id IN \
					( SELECT id FROM subject) GROUP By video.subject_id; \
				/* chart of total lesson by last 7 day */ \
				SELECT COUNT(DISTINCT(video.id)) AS totalLessons, \
					DATE_FORMAT(started,'%a') AS dayName \
					FROM student_answer \
					INNER JOIN mcq_question ON mcq_question.id=student_answer.question_id \
					INNER JOIN video ON video.id=mcq_question.video_id \
					WHERE user_id=? /* AND NOW() <= DATE_ADD(student_answer.started,INTERVAL 7 DAY)*/ \
					GROUP BY DATE_FORMAT(started,'%a'); \
				/* Wallet */ \
				( \
					SELECT \
					"+getTotalRewards()+", \
					"+getProfileAttRewards('user_profile')+" \
					FROM user \
					INNER JOIN user_profile ON user_profile.user_id=user.id \
					WHERE user.id =? \
				); \
				/* Subscribed Details */ \
				SELECT subscription_plan.name as planName, \
					subscription_plan.id as planId, \
					grade.id as gradeId, \
					grade.grade_english as nameE, \
					grade.grade_sinhala as nameS, \
					@thumbUrl := CONCAT('http://edutv.lk/img/',grade.grade_english,'.jpg') as thumb, \
					DATE_FORMAT(ssg.started,'%Y-%m-%d %H:%m:%s') as startedAt, \
					(CASE \
						WHEN ssg.plan_id =1 \
							THEN '' \
						WHEN ssg.plan_id = 3 \
							THEN DATE_ADD(DATE_FORMAT(ssg.started,'%Y-%m-%d %H:%m:%s'),INTERVAL "+escape(properties.subscriptionPeriod.trial)+" MONTH) \
						WHEN ssg.plan_id = 4 \
							THEN DATE_ADD(DATE_FORMAT(ssg.started,'%Y-%m-%d %H:%m:%s'),INTERVAL "+escape(properties.subscriptionPeriod.standard)+" MONTH) \
						WHEN ssg.plan_id = 5 \
							THEN DATE_ADD(DATE_FORMAT(ssg.started,'%Y-%m-%d %H:%m:%s'),INTERVAL "+escape(properties.subscriptionPeriod.premium)+" MONTH) \
					END) as expAt \
					FROM grade \
					INNER JOIN student_subscription_grade as ssg ON ssg.grade_id=grade.id \
					INNER JOIN subscription_plan ON subscription_plan.id = ssg.plan_id \
					INNER JOIN user ON user.id=ssg.user_id \
					WHERE ssg.user_id=?; \
				/* Trial status */ \
				SELECT \
					DATE_FORMAT(user.date_joined,'%Y-%m-%d %H:%m:%s') as startedAt, \
					DATE_FORMAT(DATE_ADD(user.date_joined, INTERVAL "+escape(properties.subscriptionPeriod.trial)+" DAY),'%Y-%m-%d %H:%m:%s') as expAt, \
					@planName := 'trial' as planName \
				FROM user \
				WHERE user.id = ? AND NOW() <= DATE_ADD(user.date_joined, INTERVAL "+escape(properties.subscriptionPeriod.trial)+" DAY); \
				/* Language List */ \
				SELECT * FROM student_language; \
				/* Subscription plan list */ \
				SELECT * FROM subscription_plan WHERE id > 2;",
	whereLeaderBoard:"SELECT  \
							( \
								 SELECT SUM("+getRewards()+") FROM user WHERE user.id=user_profile.user_id \
							) AS coins, \
						( \
							SELECT COUNT(mcq_option.id) \
							FROM mcq_option \
							INNER JOIN student_answer ON student_answer.option_id=mcq_option.id \
							WHERE mcq_option.state=0 AND student_answer.user_id=user_profile.user_id \
						) as wrongAnswers, \
						( \
							SELECT COUNT(referrer_id) \
							 FROM user_affiliate \
							 WHERE user_affiliate.referrer_id=user_profile.user_id \
						) as totalInvites, \
						(\
							SELECT COUNT(video.id)/5 \
							FROM student_answer \
							INNER JOIN mcq_question ON mcq_question.id=student_answer.question_id \
							INNER JOIN video ON video.id=mcq_question.video_id \
							WHERE student_answer.user_id=user_profile.user_id \
						) as totalLessons, \
					count(student_answer.id) as correctAnswers, \
					user_profile.name as studentName, \
					user_profile.avatar_id as avatarId, \
					school.school_name as schoolName,\
					district.district_english as district,\
					province.province_english as province \
	    				FROM student_answer \
						INNER JOIN user_profile ON user_profile.user_id=student_answer.user_id \
						INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id \
						INNER JOIN school ON school.id=user_profile.school_id \
						INNER JOIN district ON district.id=school.district_id \
						INNER JOIN province ON province.id=district.province_id \
						WHERE mcq_option.state=1 AND user_profile.grade_id=? \
						GROUP BY student_answer.user_id \
						/* ORDER BY correctAnswers DESC */ \
						ORDER BY coins DESC \
						LIMIT 20;",
	whereStudentLikeFavorite: "SELECT * FROM ?? WHERE user_id = ? and video_id = ?",
	whereStudentAnswer: "SELECT id FROM ?? WHERE user_id = ?  AND question_id = ?",
	whereMiningAnswer: "SELECT id FROM ?? WHERE user_id = ?  AND question_id = ? AND stage_id=?",
	whereQuestionId: "SELECT question_id FROM ?? WHERE id = ?",
	whereOptionState: "SELECT state FROM mcq_option WHERE id = ?",
	whereOptionQuestionVideo: "SELECT mcq_option.id as optionId,\
								mcq_question.id as questionId,\
								video.id as videoId \
								FROM mcq_option \
								INNER JOIN mcq_question ON mcq_question.id = mcq_option.question_id \
								INNER JOIN video ON  video.id = mcq_question.video_id \
								WHERE mcq_option.id = ?",
	whereIqQuestionOption: "SELECT iq_option.id as optionId,\
								iq_question.id as questionId\
								FROM iq_option \
								INNER JOIN iq_question ON iq_question.id = iq_option.question_id \
								WHERE iq_option.id = ?",								
	whereUser: "SELECT * FROM ??  WHERE id = ?",
	whereUserPassword: "SELECT id FROM user WHERE id = ? AND password = ?",
	whereSubscriptionPlan: "SELECT (CASE \
										WHEN id >=3 and id <=5 \
											THEN True \
											ELSE False \
									END) as planMode \
							FROM subscription_plan WHERE id=?;",
	whereSubscriptionStatus: "SELECT \
					(CASE \
						WHEN subP.plan_id IS NULL \
							THEN False \
							ELSE \
								CASE \
									WHEN subP.plan_id=3 \
										THEN (CASE WHEN now() <= DATE_ADD(subP.started,INTERVAL "+escape(properties.subscriptionPeriod.basic)+" MONTH) THEN True ELSE False END) \
									WHEN subP.plan_id=4 \
										THEN (CASE WHEN now() <= DATE_ADD(subP.started,INTERVAL "+escape(properties.subscriptionPeriod.standard)+" MONTH) THEN True ELSE False END) \
									WHEN subP.plan_id=5 \
										THEN (CASE WHEN now() <= DATE_ADD(subP.started,INTERVAL "+escape(properties.subscriptionPeriod.premium)+" MONTH) THEN True ELSE False END) \
								END \
					END) AS planStatus \
					FROM student_subscription_grade as subP \
					WHERE subP.plan_id =? OR subP.grade_id = ? AND subP.user_id = ?;",
		whereUserRoleLesson: "SELECT \
					(CASE \
						WHEN user.role_id = 1 \
							THEN True \
						WHEN user.role_id=2 \
							THEN (CASE WHEN now() <= DATE_ADD(user.date_joined,INTERVAL "+escape(properties.subscriptionPeriod.trial)+" DAY) THEN True ELSE False END) \
						WHEN user.role_id=3 \
							THEN (CASE WHEN now() <= DATE_ADD(user.date_joined,INTERVAL "+escape(properties.subscriptionPeriod.trial)+" DAY) THEN True ELSE False END) \
						WHEN user.role_id=4 \
							THEN (CASE WHEN COUNT(ssg.plan_id) = 0 OR (ssg.plan_id < 3) OR (ssg.plan_id > 5) \
									THEN False \
									ELSE (CASE \
											WHEN ssg.plan_id = 3 AND NOW() <= DATE_ADD(ssg.started,INTERVAL "+escape(properties.subscriptionPeriod.basic)+" MONTH) \
												THEN True \
											WHEN ssg.plan_id = 4 AND NOW() <= DATE_ADD(ssg.started,INTERVAL "+escape(properties.subscriptionPeriod.standard)+" MONTH) \
												THEN True \
											WHEN ssg.plan_id = 5 AND NOW() <= DATE_ADD(ssg.started,INTERVAL "+escape(properties.subscriptionPeriod.premium)+" MONTH) \
												THEN True \
											WHEN (ssg.plan_id = 3 AND NOW() > DATE_ADD(ssg.started,INTERVAL "+escape(properties.subscriptionPeriod.basic)+" MONTH)) \
												OR \
												(ssg.plan_id = 4 AND NOW() > DATE_ADD(ssg.started,INTERVAL "+escape(properties.subscriptionPeriod.standard)+" MONTH)) \
												OR \
												(ssg.plan_id = 5 AND NOW() > DATE_ADD(ssg.started,INTERVAL "+escape(properties.subscriptionPeriod.premium)+" MONTH)) \
												THEN False \
										END) \
								END) \
					END) AS planStatus \
					FROM user \
					LEFT JOIN student_subscription_grade as ssg ON ssg.user_id=user.id \
					WHERE user.id = ? AND ssg.grade_id = (SELECT grade FROM video WHERE id=?);",
	whereUserRole: "SELECT \
					(CASE \
						WHEN user.role_id = 1 \
							THEN 1000 \
						WHEN user.role_id=2 \
							THEN (CASE WHEN now() <= DATE_ADD(user.date_joined,INTERVAL "+escape(properties.subscriptionPeriod.trial)+" DAY) THEN 5 ELSE 0 END) \
						WHEN user.role_id=3 \
							THEN (CASE WHEN now() <= DATE_ADD(user.date_joined,INTERVAL "+escape(properties.subscriptionPeriod.trial)+" DAY) THEN 5 ELSE 0 END) \
						WHEN user.role_id=4 \
							THEN (CASE WHEN COUNT(ssg.plan_id) = 0 OR (ssg.plan_id < 3) OR (ssg.plan_id > 5) \
									THEN 0 \
									ELSE (CASE \
											WHEN ssg.plan_id = 3 AND NOW() <= DATE_ADD(ssg.started,INTERVAL "+escape(properties.subscriptionPeriod.basic)+" MONTH) \
												THEN 1000 \
											WHEN ssg.plan_id = 4 AND NOW() <= DATE_ADD(ssg.started,INTERVAL "+escape(properties.subscriptionPeriod.standard)+" MONTH) \
												THEN 1000 \
											WHEN ssg.plan_id = 5 AND NOW() <= DATE_ADD(ssg.started,INTERVAL "+escape(properties.subscriptionPeriod.premium)+" MONTH) \
												THEN 1000 \
											WHEN (ssg.plan_id = 3 AND NOW() > DATE_ADD(ssg.started,INTERVAL "+escape(properties.subscriptionPeriod.basic)+" MONTH)) \
												OR \
												(ssg.plan_id = 4 AND NOW() > DATE_ADD(ssg.started,INTERVAL "+escape(properties.subscriptionPeriod.standard)+" MONTH)) \
												OR \
												(ssg.plan_id = 5 AND NOW() > DATE_ADD(ssg.started,INTERVAL "+escape(properties.subscriptionPeriod.premium)+" MONTH)) \
												THEN 0 \
										END) \
								END) \
					END) AS planLimit \
					FROM user \
					LEFT JOIN student_subscription_grade as ssg ON ssg.user_id=user.id \
					WHERE user.id = ? AND ssg.grade_id = ?",
	whereStudent: "SELECT * FROM ??  WHERE student_id = ?",
	whereProfileData:"SELECT * FROM user_profile WHERE user_id=?",
	whereUserProfile: "SELECT * \
						FROM user_profile \
						INNER JOIN school ON user_profile.school_id = school.id \
						INNER JOIN district ON school.district_id = district.id \
						INNER JOIN province ON province.id = district.province_id \
						WHERE user_profile.user_id = ?",
	whereMobile: "SELECT * FROM ?? WHERE phone=?;",
	whereReferrerReferee: "SELECT id as referee_id FROM user WHERE referral_code=?;SELECT id as referrer_id FROM user WHERE phone=?",
	whereAffiliate: "SELECT id FROM user_affiliate WHERE referrer_id=? AND referee_id=?;",
	//whereEmailOrPhone: "SELECT * FROM ?? WHERE email = ? OR phone = ?",
	//whereEmailPasswd: "SELECT * FROM ?? WHERE email = ? and password = ?",
	wherePhonePasswd: "SELECT * FROM ?? WHERE phone = ? and password = ?",
	/* getGradeList */
	selectGrade: "SELECT id,grade_english as nameE,\
					grade_sinhala as nameS FROM ??",
	/* getSyllabusList */
	selectSyllabus: "SELECT syllabus.id, \
					 syllabus.syllabus_english as nameE, \
					 syllabus.syllabus_sinhala as nameS \
					 FROM syllabus \
					 INNER JOIN grade_syllabus ON grade_syllabus.syllabus_id=syllabus.id \
					 WHERE grade_syllabus.grade_id=?",
	/* getSubjectList */
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
						video.name as fileName, \
						(SELECT (CASE \
								WHEN count(student_favorite.status) = 0 OR student_favorite.status = 0 \
									THEN 'False' \
									ELSE 'True' \
								END) \
							FROM student_favorite \
							WHERE student_favorite.video_id=video.id AND student_favorite.user_id=?) AS favoritedState, \
						(SELECT (CASE \
							WHEN count(student_answer.id)=0 \
								THEN 'False' \
								ELSE 'True' \
							END) \
							FROM student_answer \
							INNER JOIN mcq_question ON mcq_question.id=student_answer.question_id \
							WHERE mcq_question.video_id=video.id AND student_answer.user_id=?) AS completedState, \
						(SELECT COUNT(student_answer.id) \
								FROM student_answer \
								INNER JOIN mcq_question ON mcq_question.id=student_answer.question_id \
								INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id \
								WHERE mcq_question.video_id=video.id AND mcq_option.state=1 AND student_answer.user_id=?) as totalCorrectAnswers, \
						(SELECT COUNT(mcq_question.id) \
								FROM mcq_question \
 								WHERE mcq_question.video_id=video.id) as totalQuestions \
						FROM video \
						INNER JOIN subject ON subject.id=video.subject_id \
						INNER JOIN syllabus ON syllabus.id=video.syllabus \
						WHERE video.grade=? AND video.subject_id=? ORDER BY video.id LIMIT ?; \
						SELECT student_favorite.video_id FROM student_favorite WHERE student_favorite.user_id=?;",
	whereOnlineUsers: "SELECT \
								(SELECT SUM("+getRewards()+") FROM user WHERE user.id=u.id) as balance, \
								u.uniqid as gamerId, \
								up.avatar_id as avatarId, \
								up.grade_id as gradeId, \
								u.phone as mobileNo, \
								up.name as name \
						FROM user_profile as up \
						INNER JOIN user as u ON u.id = up.user_id \
						WHERE u.uniqid != ? AND up.status='online' AND up.grade_id=( \
										SELECT grade_id \
										FROM user_profile AS upro \
										INNER JOIN user as usr ON usr.id = upro.user_id \
										WHERE usr.uniqid=?)",
	selectAll: "SELECT * FROM ??",
	whereSchool:"SELECT id,school_name as name FROM ?? WHERE district_id = ?",
	whereProvince:"SELECT id,province_english as nameInEnglish,province_sinhala as nameInSinhala FROM ??",
	whereDistrict:"SELECT id,district_english as nameInEnglish,district_sinhala as nameInSinhala FROM ?? WHERE province_id = ?",
	whereSchool:"SELECT id,school_name as name FROM ?? WHERE district_id = ?",
	whereGrade:"SELECT id,grade_english as nameInEnglish,grade_sinhala as nameInSinhala FROM ??",
	whereOtpNo:"SELECT * FROM ?? WHERE mobile = ?",
	whereAccessToken:"SELECT * FROM ?? WHERE token = ?",

	/* find game5r request exist */
	whereBattleGameReq:"SELECT id,status FROM battle_pool WHERE id=?;",
	whereGameReq:"SELECT id,status FROM battle_pool WHERE user1id=? AND user2id=? AND status=?;",
	whereBattleStatus:"SELECT status FROM battle_pool WHERE id=? AND status='running';",
	
	whereBattleEnd:" \
					SELECT \
					ba.user_id AS gamerId, \
					up.name, \
					up.avatar_id, \
					(CASE WHEN COUNT(ba.id) = "+properties.battleQuestionThreshold+" \
						THEN 'True' \
						ELSE 'False' \
					END) as hasCompleted, \
					COUNT(ba.id) as totalQuestions, \
					(SELECT \
						COUNT(ban.id) \
						FROM battle_answer as ban \
						INNER JOIN mcq_option as mop ON mop.id=ban.option_id \
						WHERE mop.state = 1 AND ban.user_id=ba.user_id AND ban.battle_id=ba.battle_id \
					) AS correctAnswers, \
					(SELECT \
						COUNT(ban.id) \
						FROM battle_answer as ban \
						INNER JOIN mcq_option as mop ON mop.id=ban.option_id \
						WHERE mop.state = 0 AND ban.user_id=ba.user_id AND ban.battle_id=ba.battle_id \
					) AS wrongAnswers, \
					DATE_FORMAT(MIN(ba.started),'%Y-%m-%d %H:%m:%s') AS startedAt, \
					DATE_FORMAT(MAX(ba.ended),'%Y-%m-%d %H:%m:%s') AS endedAt, \
					TIMEDIFF(MAX(ba.ended),MIN(ba.started)) AS duration \
					FROM battle_answer AS ba \
					INNER JOIN user ON user.uniqid = ba.user_id \
					INNER JOIN user_profile AS up ON up.user_id = user.id \
					WHERE ba.battle_id=? \
					GROUP BY ba.user_id \
					;",
	whereGameAccept:"SELECT id,status FROM battle_pool WHERE user1id = ? AND user2id = ? AND id = ?;",
	whereBattleId:"SELECT id,status FROM battle_pool WHERE id=?;",
	whereBattleCoin:"SELECT id FROM coin_pool WHERE user_id=? AND battle_id=? AND type=?;",
	whereLessCoin:"SELECT ("+getRewards()+") as balance FROM user WHERE user.uniqid=?;",
	whereBattleAnswer:"SELECT \
			(CASE WHEN bp.status = 'running' \
				THEN (CASE WHEN bp.id = (SELECT ba.battle_id FROM battle_answer as ba WHERE ba.battle_id=bp.id AND ba.user_id=? AND ba.question_id=?) \
							THEN False \
							ELSE True \
						END) \
				ELSE False \
			END) as status \
			FROM battle_pool as bp \
			WHERE bp.id = ?;",
	
	insertBattleCoin:"INSERT INTO coin_pool(id,user_id,battle_id,type,coin,datetime) VALUES(?,?,?,?,?,?);",
	insertBattleAnswer:"INSERT INTO battle_answer(id,user_id,battle_id,question_id,option_id,started,ended) VALUES(?,?,?,?,?,?,?);SELECT LAST_INSERT_ID();",
	insertGameReq:"INSERT INTO battle_pool(id,user1id,user2id,status,datetime) VALUES(?,?,?,?,?);SELECT LAST_INSERT_ID();",
	
	insertSubscription:"INSERT INTO student_subscription_grade(id,user_id,plan_id,grade_id,started) VALUES(?,?,?,?,?)",
	insertAffiliate:"INSERT INTO user_affiliate(id,referrer_id,referee_id,created) VALUES(?,?,?,?)",
	insertStudentLikeFavorite:"INSERT INTO  ??(id,user_id,video_id,status) VALUES (?,?,?,?)",	
	insertStudentAnswer:"INSERT INTO  student_answer(id,user_id,question_id,option_id,started,ended) \
							VALUES (?,?,?,?,?,?); \
							/* insertId undefine fix */ \
							 SELECT LAST_INSERT_ID(); \
							",
	insertMiningMcqAnswer:"INSERT INTO  mcq_mining_answer(id,user_id,stage_id,question_id,option_id,started,ended) \
							VALUES (?,?,?,?,?,?,?); \
							SELECT LAST_INSERT_ID();",
	insertMiningIqAnswer:"INSERT INTO  iq_answer(id,user_id,question_id,option_id,started,ended) \
							VALUES (?,?,?,?,?,?); \
							SELECT LAST_INSERT_ID();",					
	insertProfile:"INSERT INTO  ??(id,school_id,user_id,name,grade_id,avatar_id,language_id) VALUES (?,?,?,?,?,?,?)",	
	insertUser:"INSERT INTO  ??(email,password,username,phone,date_joined,last_login,uniqid,is_active,id,role_id,referral_code,device_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",	
	insertUserAffiliate:"INSERT INTO  ??(id,referrer_id,referred_id,created) VALUES (?,?,?,?)",	
	insertOauth:"INSERT INTO ??(id,token,created,updated,user_id) VALUES(?,?,?,?,?)",
	insertOtp:"INSERT INTO ??(id,otp,mobile,created,is_verify) VALUES(?,?,?,?,?)",
	insertRecoveryCode:"INSERT INTO ??(id,code,mobile,created,is_verify) VALUES(?,?,?,?,?)",

	updateGameStatus:"UPDATE battle_pool SET status=? WHERE id=?;",
	updateGameReq:"UPDATE battle_pool SET status=?,datetime=? WHERE user1id = ? AND user2id = ? AND id=?;",
	updateOnlineDefault:"UPDATE user_profile SET status = ?",
	//updateOnlineStatus:"UPDATE user_profile SET status = ? WHERE user_id= ?",
	updateOnlineStatus:"UPDATE user_profile SET status = ? WHERE user_id = (SELECT id FROM user WHERE uniqId= ?)",
	updateUserRole:"UPDATE user SET role_id = ? WHERE id = ?",
	updateNewPassword:"UPDATE user SET password = ? WHERE id = ?",
	updateUserPassword:"UPDATE ?? SET password=? WHERE phone = ?",
	updateRecoveryCode:"UPDATE ?? SET code=?, created=?, is_verify=? WHERE mobile=?",
	updateRecoveryCodeActivation:"UPDATE ?? SET created=?, is_verify=? WHERE mobile=?",

	updateStudentLanguage:"UPDATE user_profile SET language_id=? WHERE user_id=?",
	updateStudentLikeFavorite:"UPDATE ?? SET status=? WHERE user_id=? AND video_id=?",
	updateOtp:"UPDATE ?? SET otp=?, created=? WHERE mobile=?",
	updateIsVerify:"UPDATE ?? SET is_verify=?, created=? WHERE mobile=?",
	updateOauth:"UPDATE ?? SET token=?, updated=? WHERE user_id=?",
	updateLastLogin:"UPDATE ?? SET last_login=? WHERE id = ?",
	updateProfile:"UPDATE ?? SET school_id=?,student_name=?,student_grade=?,avatar_id=? WHERE student_id=?",
	updateAccountDetail:"UPDATE user_profile SET \
			name=?, \
			grade_id=?, \
			avatar_id=?, \
			school_id=?, \
			address=?, \
			favorite_subject=?,\
			ambition=?, \
			dateofbirth=?, \
			nic=?, \
			sociallink=?, \
			email=?, \
			parent_name=?, \
			parent_contact=?, \
			parent_email=?, \
			school_address=?, \
			school_contact=?, \
			school_email=?, \
			teacher_name=?, \
			teacher_contact=?, \
			teacher_email=? \
			WHERE user_id=?;",
	//methods
	setUpdate: function(query,fields,callback){
		getConnection(function(con) {
			con.query(query,fields, function (err,result){
				if (err) {
					throw err;
					log.error(fields+" : db update error");
 					callback(false);
				} else {
					//log.info(fields+" : db update done");
					callback(true);
				}
 			});
			con.release();
 		});
	
	},
	getSelect: function(query,fields,callback) {
		//log.info("setSqlQuery -> Fields : "+fields+" : query : "+query);
		getConnection(function(con) {
			con.query(query,fields, function (err,result){
				if (err) {
					//throw err;
					log.info(err);
				} else {
				//log.info("sql result : "+result[0].id);
				callback(result);
				}
 			});
			con.release();
 		});
 	},
getAnswerInsertId: function(query,fields,callback) {
		//log.info("setSqlQuery -> Fields : "+fields+" : query : "+query);
		getConnection(function(con) {
			con.query(query,fields, function (err,result){
				if (err) {
					//throw err;
					log.info(err);
				} else {
				//log.info("sql result : "+JSON.parse(JSON.stringify(result[0])))
				//add LAST_INSERT_ID, undefine fixed
				callback(result[0].insertId);
				}
 			});
			con.release();
 		});
 	}, 	
 	
 	setInsert: function(query,fields,callback) {
//		log.info("Sql Insert data -> Fields : "+fields+" : query : "+query);
		getConnection(function(con) {
			con.query(query,fields, function (err,result){
				if (err) {
					log.error("mysql error : "+err);
					callback(false);
				} else {
					//log.info(fields[0]+" : data inserted");
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
/*
							mysqlObj.videoData=[{
										"name":"small",
										"quality":"240p",
							"videoUrl":properties.vodUrl+'/'+mysqlObj.grade+'/'+mysqlObj.syllabus+'/'+mysqlObj.subject+'/playlist/'+mysqlObj.fileName+'_240p.m3u'
										
										},
										{
										"name":"medium",
										"quality":"360p",
							"videoUrl":properties.vodUrl+'/'+mysqlObj.
							grade+'/'+mysqlObj.syllabus+'/'+mysqlObj.subject+'/playlist/'+mysqlObj.fileName+'_360p.m3u'
										
										},
										{			
										"name":"large",
										"quality":"480p",
							"videoUrl":properties.vodUrl+'/'+mysqlObj.grade+'/'+mysqlObj.syllabus+'/'+mysqlObj.subject+'/playlist/'+mysqlObj.fileName+'_480p.m3u'
										}
										]
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

	getLesson: function(query,fields,callback) {
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
							try {
								smallList=fs.readFileSync(properties.fileBasePath+'/'+mysqlObj.grade+'/'+mysqlObj.syllabus+'/'+mysqlObj.subject+'/playlist/'+mysqlObj.fileName+'_240p.m3u').toString().split("\n");
							} catch (e) {
								log.error("small of playlist file has not been found");
							}
							try {
								mediumList=fs.readFileSync(properties.fileBasePath+'/'+mysqlObj.grade+'/'+mysqlObj.syllabus+'/'+mysqlObj.subject+'/playlist/'+mysqlObj.fileName+'_360p.m3u').toString().split("\n");;
							} catch (e) {
								log.error("medium of playlist has not been found");
							}
							try {
								largeList=fs.readFileSync(properties.fileBasePath+'/'+mysqlObj.grade+'/'+mysqlObj.syllabus+'/'+mysqlObj.subject+'/playlist/'+mysqlObj.fileName+'_480p.m3u').toString().split("\n");;
							} catch (e) {
								log.error("large of playlist has not been found");
							}
							
							try {
								mysqlObj.playlists=[
											{
												"name":"small",
												"quality":"240p",
												"videoList":smallList.slice(0,-1)
											},
											{
												"name":"medium",
												"quality":"360p",
												"videoList":mediumList.slice(0,-1)
											},
											{
												"name":"large",
												"quality":"480p",
												"videoList":largeList.slice(0,-1)
											}];
							} catch (e) {
								console.log("playlist files not found");
							}
/*										
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
*/
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
   					callback(status.server());
 				} else {
 					//single row
 					//var normalObj = Object.assign({}, results[0]);
 					const [activityData,personalData,chartOfSubject,chartOfDay,walletData,subscriptionData,planTrial,languageData,subscriptionPlan] = result;
					//var subscriptionInfo='';
					/*
					const planTrialData = planTrial.map((mysqlObj, index) => {
    						return Object.assign({}, mysqlObj);
    					});
    				*/

					/*
					const subscriptionDetails = subscriptionData.map((mysqlObj, index) => {
							//Object.assign(mysqlObj,planTrialData);
    						return Object.assign({}, mysqlObj);
    					});
    				const lengthObj = Object.keys(subscriptionDetails).length;
    				*/
    				
    				
    				/*			
    				if (Object.keys(subscriptionDetails).length === 0) {
    					console.log("subscription data not found");
    					subscriptionInfo=planTrialData;
    				} else {
    					console.log("subscription data found");
    					subscriptionInfo=subscriptionDetails;
    				}
    				*/
    				//console.log("planTrail :"+JSON.stringify(planTrialData)+", subscrioptionDetails :"+JSON.stringify(subscriptionDetails));
 					
					const chartSubject = chartOfSubject.map((mysqlObj, index) => {
    						return Object.assign({}, mysqlObj);
    					});
    				 	
					const chartDay = chartOfDay.map((mysqlObj, index) => {
    						return Object.assign({}, mysqlObj);
    					}); 			
    				
					const langList = languageData.map((mysqlObj, index) => {
						return Object.assign({}, mysqlObj);
					});
					 					
 					const jsonData={
 						personalInfo:personalData[0],
						wallet:walletData[0],
 						activityList:activityData[0],
 						chartOfSubject:chartSubject,
 						chartOfDay:chartDay,
 						languageList:langList,
 						subscriptionTypeList:subscriptionPlan,
 						trialStatus:planTrial,
 						subscribedDetails:subscriptionData
// 						subscribedDetails:subscriptionDetails
// 						subscribedDetails:Object.assign(subscriptionDetails,planTrialData)
// 						subscribedDetails:subscriptionDetails[1]['']=planTrialData
 						
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
	getSelectJson: function(query,fields,callback) {
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
					//callback(jsonResults); 		
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
							mysqlObj.thumb=properties.thumbUrl+'/'+mysqlObj.nameE+'.png';
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
							mysqlObj.thumb=properties.thumbUrl+'/'+mysqlObj.nameE+'.png';
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
							mysqlObj.thumb=properties.thumbUrl+'/'+mysqlObj.nameE+'.png';
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
	getMiningMcqStage: function(query,fields,callback) {
		getConnection(function(con) {
			con.query(query,fields, function (err,result){
   				if (!result){
   					callback(JSON.stringify(status.server()));
 				} else {
 					//single row
 					//var normalObj = Object.assign({}, results[0]);
					const [subject,lastStage] = result;
					var jsonResults = subject.map((mysqlObj, index) => {
							mysqlObj.thumb=properties.thumbUrl+'/'+mysqlObj.nameE+'.png';
    						return Object.assign({}, mysqlObj);
    					});
    				jsonResults.push(lastStage[0]);
					//log.info(JSON.stringify(jsonResults));
					callback(JSON.stringify(jsonResults)); 		
			}
		});
		con.release();
	});
	},
	
	getMiningMcqStage9List: function(query,fields,callback) {
		getConnection(function(con) {
			con.query(query,fields, function (err,result){
				if (err) { 
					//throw err;
					console.log("getminingmcqstage9List database server error");
				} else 	if (!result){
   					callback(JSON.stringify(status.server()));
 				} else {
 					//single row
 					//var normalObj = Object.assign({}, results[0]);
 					const [lesson] = result;
 					var options =[];
 					var mcqList =[];
 					var qCount = 0; //for every 3 question 
					var jsonResults = result.map((mysqlObj, index) => {
						//every row has option
						
						var optionData={
							"optionId":mysqlObj.optionId,
							"option":mysqlObj.answer,
							"image":mysqlObj.image,
							"isCorrect":mysqlObj.isCorrect
						}
						//each option object put into array
						options.push(optionData);
						
						if (!((index+1) % 4)){
							//qCount++;
							//console.log("rowCount: "+qCount);
							//console.log("question Id: "+mysqlObj.questionId);
							//limit only 3 question
							qCount++;
							if (qCount <= 3) {
								var question={
									"lessonId":mysqlObj.lessonId,
									"grade":mysqlObj.grade,
									"subject":mysqlObj.subject,
									"questionId":mysqlObj.questionId,
									"heading":mysqlObj.heading,
									"question":mysqlObj.question,
									"image":mysqlObj.image,
									"options":options
								}
								//console.log("qcount < 3 :"+qCount+" : "+question.questionId);
								mcqList.push(question);
								//every 5 question reset qcount to 0
							} else if (qCount == 5) {
								//console.log("qcount at limit :"+qCount);
								qCount=0;
							} 

							//console.log("option id: "+mysqlObj.optionId);
							// put option array into question object at every 4 line
							//append question into array and avoid null occurance of every 3 question
							//if (question) {
							//	mcqList.push(question);
							//}
							//clear question object and option object at every 4 line
							options=[];
						}
						
						return Object.assign({}, mysqlObj);
					});
					
					callback(JSON.stringify(mcqList)); 		

				}
			});
			con.release();
		});
	},
getMiningMcqList: function(query,fields,callback) {
		getConnection(function(con) {
			con.query(query,fields, function (err,result){
				if (err) { 
					//throw err;
					console.log("getMiningMcq database server error");
				} else 	if (!result){
   					callback(JSON.stringify(status.server()));
 				} else {
 					//single row
 					//var normalObj = Object.assign({}, results[0]);
 					const [lesson] = result;
 					var options =[];
 					var mcqList =[];
 					var rowCount = 1;
					var jsonResults = result.map((mysqlObj, index) => {
						//every row has option
						var optionData={
							"optionId":mysqlObj.optionId,
							"option":mysqlObj.answer,
							"image":mysqlObj.image,
							"isCorrect":mysqlObj.isCorrect
						}
						//each option object put into array
						options.push(optionData);
						
						if (!((index+1) % 4)){
							//console.log("question Id: "+mysqlObj.questionId);
							//get only 3 of 5 question
							var question={
								"lessonId":mysqlObj.lessonId,
								"grade":mysqlObj.grade,
								"subject":mysqlObj.subject,
								"questionId":mysqlObj.questionId,
								"heading":mysqlObj.heading,
								"question":mysqlObj.question,
								"image":mysqlObj.image,
								"options":options
							}
							//console.log("option id: "+mysqlObj.optionId);
							// put option array into question object at every 4 line
							//append question into array
							mcqList.push(question);
							//clear question object and option object at every 4 line
							options=[];
						}
						
						return Object.assign({}, mysqlObj);
					});
					
					callback(JSON.stringify(mcqList)); 		

				}
			});
			con.release();
		});
	},
	
getIqList: function(query,fields,callback) {
		getConnection(function(con) {
			con.query(query,fields, function (err,result){
				if (err) { 
					//throw err;
					console.log("query :"+query+", fields :"+fields);
					console.log("getIqList database server error");
				} else 	if (!result){
   					callback(JSON.stringify(status.server()));
 				} else {
 					//single row
 					//var normalObj = Object.assign({}, results[0]);
 					const [lesson] = result;
 					var options =[];
 					var mcqList =[];
 					var rowCount = 1;
					var jsonResults = result.map((mysqlObj, index) => {
						//every row has option
						var optionData={
							"optionId":mysqlObj.optionId,
							"option":mysqlObj.option,
							"isCorrect":mysqlObj.isCorrect
						}
						//each option object put into array
						options.push(optionData);
						
						if (!((index+1) % 4)){
							//console.log("question Id: "+mysqlObj.questionId);
							//get only 3 of 5 question
							var question={
								"levelId":mysqlObj.levelId,
								"questionId":mysqlObj.questionId,
								"question":mysqlObj.question,
								"options":options
							}
							
							//console.log("option id: "+mysqlObj.optionId);
							// put option array into question object at every 4 line
							//append question into array
							mcqList.push(question);
							//clear question object and option object at every 4 line
							options=[];
						}
						
						return Object.assign({}, mysqlObj);
					});
					
					callback(JSON.stringify(mcqList)); 		

				}
			});
			con.release();
		});
	},
	
	//query any table
	getLessonList: function(query,fields,callback) {
		getConnection(function(con) {
			con.query(query,fields, function (err,result){
				if (err){
					throw err;
				} else if (!result){
   					callback(JSON.stringify(status.server()));
 				} else {
 					//single row
 					//var normalObj = Object.assign({}, results[0]);
 					const [video,favorite] = result
					var jsonResults = video.map((mysqlObj, index) => {
							mysqlObj.type="directory";
							mysqlObj.thumb=properties.vodUrl+'/grade-0'+mysqlObj.grade+'/'+mysqlObj.syllabusE+'/'+mysqlObj.subjectE+'/thumb/'+mysqlObj.fileName+'.png';
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
