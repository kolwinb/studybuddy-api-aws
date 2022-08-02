#!/bin/bash
#very important
#"('S) you can add double quots (''S)" in csv file, then error will disappear
#use ~ delimeter to export csv


line=$(head -n 1 ../.access)
uname=${line%:*}
upass=${line#*:}


#msql="mysql -N -h192.168.1.120 -u$uname -p$upass studybuddy"
msql="mysql -h192.168.1.120 -u$uname -p$upass studybuddy"
#total answered by given user
echo "	SELECT t1.*, \
				t2.*, \
				t3.*, \
				t4.* \
		FROM	(SELECT count(student_answer.user_id) as correctAnswers \
				FROM student_answer \
				INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id \
				WHERE student_answer.user_id=7 and mcq_option.state=1) as t1, \
				(SELECT count(student_answer.user_id) as wrongAnswers \
				FROM student_answer \
				INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id \
				WHERE student_answer.user_id=7 and mcq_option.state=0) as t2,
 				(SELECT count(video.id) as totalLessons \
 				FROM video \
 				WHERE video.id IN (SELECT mcq_question.video_id \
 				FROM mcq_question \
 				INNER JOIN student_answer ON student_answer.question_id=mcq_question.id \
 				WHERE student_answer.user_id=7 \
 				GROUP BY mcq_question.video_id)) as t3, \
 				(SELECT COUNT(question_id) as totalQuestions FROM student_answer WHERE user_id=7) as t4;" | $msql


echo "	SELECT (SELECT count(student_answer.user_id) as correctAnswers \
				FROM student_answer \
				INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id \
				WHERE student_answer.user_id=7 and mcq_option.state=1) as t1, \
				(SELECT count(student_answer.user_id) as wrongAnswers \
				FROM student_answer \
				INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id \
				WHERE student_answer.user_id=7 and mcq_option.state=0) as t2,
 				(SELECT count(video.id) as totalLessons \
 				FROM video \
 				WHERE video.id IN (SELECT mcq_question.video_id \
 				FROM mcq_question \
 				INNER JOIN student_answer ON student_answer.question_id=mcq_question.id \
 				WHERE student_answer.user_id=7 \
 				GROUP BY mcq_question.video_id)) as t3, \
 				(SELECT COUNT(question_id) as totalQuestions FROM student_answer WHERE user_id=7) as t4;" | $msql

echo "profile personalInfo"

echo " SELECT user_profile.name as studentName, \
IFNULL(user_profile.avatar_id,0) as avatarId, \
user_profile.grade as studentGrade, \
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
subscription_plan.name as subscriptionType, \
user.phone as mobile, \
DATE_FORMAT(user.plan_started,'%Y-%m-%d %H:%m:%s') as subscriptionStartedAt, \
CASE \
WHEN user.plan_id = 1 \
THEN '' \
WHEN user.plan_id=2 \
THEN DATE_ADD(user.plan_started,INTERVAL 7 DAY) \
WHEN user.plan_id=3 \
THEN DATE_ADD(user.plan_started,INTERVAL 1 MONTH) \
WHEN user.plan_id=4 \
THEN DATE_ADD(user.plan_started,INTERVAL 3 MONTH) \
WHEN user.plan_id=5 \
THEN DATE_ADD(user.plan_started,INTERVAL 12 MONTH) \
END AS subscriptionExpIn, \
school.school_name as school, \
district.district_english as district, \
province.province_english as province, \
IFNULL(student_language.language,0) as language \
FROM user \
CROSS JOIN user_profile ON user_profile.user_id = user.id \
CROSS JOIN school ON user_profile.school_id = school.id \
CROSS JOIN district ON school.district_id = district.id \
CROSS JOIN province ON province.id = district.province_id \
CROSS JOIN subscription_plan ON subscription_plan.id = user.plan_id \
CROSS JOIN student_language ON student_language.id=user_profile.language_id \
WHERE user.id =1; "| $msql

echo "Activities"

echo "SELECT count(student_answer.user_id) as correctAnswers \
   FROM student_answer \
   INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id \
   WHERE student_answer.user_id=user.id and mcq_option.state=1 \
   ) as correctAnswers, \
   ( \
   SELECT count(student_answer.user_id) as wrongAnswers \
   FROM student_answer \
   INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id \
   WHERE student_answer.user_id=user.id and mcq_option.state=0 \
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
	WHERE user.id=?; " | $msql


#(SELECT (CASE \
#	WHEN student_language.language IS NULL \
#		THEN 'Null' \
#		ELSE 'hello' \
#END) as language) \
#INNER JOIN student_language ON student_language.id=user_profile.language_id \
