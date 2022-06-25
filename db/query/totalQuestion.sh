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
printf "\nTotal Question answered by given user : "
echo "SELECT COUNT(question_id) FROM student_answer WHERE user_id=4;" | $msql

printf "\nTotal correct answers by student: "
echo "SELECT count(student_answer.user_id) as correctAnswers FROM student_answer INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id WHERE student_answer.user_id=4 and mcq_option.state=1;" | $msql

printf "\nTotal Wrong Answers by student: "
echo "SELECT count(student_answer.user_id) as wrongAnswers FROM student_answer INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id WHERE student_answer.user_id=4 and mcq_option.state=0;" | $msql

printf "\n Total episode by student: \n"
echo "SELECT count(video.id) as episode FROM video WHERE video.id IN (SELECT mcq_question.video_id FROM mcq_question INNER JOIN student_answer ON student_answer.question_id=mcq_question.id WHERE student_answer.user_id=4 GROUP BY mcq_question.video_id);" | $msql

printf "\n Total lesson by student: \n"

echo "SELECT COUNT(lesson) FROM video WHERE video.id IN (SELECT mcq_question.video_id FROM mcq_question INNER JOIN student_answer ON student_answer.question_id=mcq_question.id WHERE student_answer.user_id=4 GROUP BY mcq_question.video_id) GROUP BY video.lesson;" | $msql

printf "\n Leader board : \n"
#echo "SELECT student_answer.user_id  FROM student_answer INNER JOIN student_answer ON student_answer.user_id=user.id INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id WHERE mcq_option.state=1" | $msql
#echo "SELECT student_answer.user_id,student_answer.user_id,user_profile.student_name FROM student_answer INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id  INNER JOIN user_profile ON user_profile.student_id=student_answer.user_id WHERE mcq_option.state=1;" | $msql
#echo "SELECT user_profile.student_id FROM user_profile WHERE user_profile.student_id IN (SELECT student_answer.user_id FROM student_answer INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id WHERE mcq_option.state=1);" | $msql
echo "SELECT student_answer.user_id, count(student_answer.user_id) as studentMark,user_profile.student_name as studentName,school.school_name as schoolName,district.district_name as district,province.province_name as province\
	FROM student_answer \
	INNER JOIN user_profile ON user_profile.student_id=student_answer.user_id \
	INNER JOIN school ON school.id=user_profile.school_id \
	INNER JOIN district ON district.id=school.district_id \
	INNER JOIN province ON province.id=district.province_id \
	INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id \
	WHERE mcq_option.state=1 \
	GROUP BY student_answer.user_id \
	ORDER BY studentMark DESC \
	LIMIT 20;" | $msql

#echo "SELECT * FROM user_profile WHERE user_profile.student_id IN (SELECT student_answer.user_id \

#	INNER JOIN user_profile ON user_profile.student_id=student_answer.user_id \

printf "\n total question done by subject : \n"
echo "SELECT count(video.id) as totalAnswers, student_answer.user_id as userId, subject.subject as subject\
	FROM student_answer \
	INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id \
	INNER JOIN mcq_question ON mcq_question.id=mcq_option.question_id \
	INNER JOIN video ON video.id=mcq_question.video_id \
	INNER JOIN subject ON subject.id=video.subject_id \
	WHERE student_answer.user_id=4 AND video.subject_id IN ( SELECT id FROM subject) group by subject.id;" | $msql

printf "\n correct answer by subject : \n"
echo "SELECT count(video.id) as correctAnswers, student_answer.user_id as userId, subject.subject as subject\
	FROM student_answer \
	INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id \
	INNER JOIN mcq_question ON mcq_question.id=mcq_option.question_id \
	INNER JOIN video ON video.id=mcq_question.video_id \
	INNER JOIN subject ON subject.id=video.subject_id \
	WHERE student_answer.user_id=4 AND mcq_option.state=1 AND video.subject_id IN ( SELECT id FROM subject) group by subject.id;" | $msql

printf "\n wrong by subject : \n"
echo "SELECT count(video.id) as wrongAnswers, student_answer.user_id as userId, subject.subject as subject\
	FROM student_answer \
	INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id \
	INNER JOIN mcq_question ON mcq_question.id=mcq_option.question_id \
	INNER JOIN video ON video.id=mcq_question.video_id \
	INNER JOIN subject ON subject.id=video.subject_id \
	WHERE student_answer.user_id=4 AND mcq_option.state=0 AND video.subject_id IN ( SELECT id FROM subject) group by subject.id;" | $msql


printf "\n all likes : \n"
echo "SELECT COUNT(video.id) as likes, video.id as videoId, \
	video.episode as episode, \
	video.term as term, \
	video.lesson as lesson, \
	video.lesson_name as lessonName, \
	video.short_desc as shortDesc, \
	video.long_desc as longDesc, \
	subject.subject as subject \
	FROM video \
		INNER JOIN student_like ON student_like.video_id=video.id \
		INNER JOIN subject ON subject.id=video.subject_id \
		WHERE student_like.status=1 AND student_like.video_id IN (SELECT video_id FROM student_answer WHERE student_answer.user_id=4) GROUP BY student_like.video_id ORDER BY likes DESC;" | $msql
