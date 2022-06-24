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

printf "\nTotal correct answers : "
echo "SELECT count(student_answer.user_id) FROM student_answer INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id WHERE student_answer.user_id=4 and mcq_option.state=1;" | $msql

printf "\nTotal Wrong Answers : "
echo "SELECT count(student_answer.user_id) FROM student_answer INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id WHERE student_answer.user_id=4 and mcq_option.state=0;" | $msql

printf "\n Total lessons : "
echo "SELECT count(video.id) FROM video WHERE video.id IN (SELECT mcq_question.video_id FROM mcq_question INNER JOIN student_answer ON student_answer.question_id=mcq_question.id WHERE student_answer.user_id=4 GROUP BY mcq_question.video_id);" | $msql

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
#echo "SELECT video.id,video.name FROM video  GROUP BY video.name HAVING video.id IN (SELECT mcq_question.video_id FROM mcq_question INNER JOIN student_answer ON student_answer.question_id=mcq_question.id WHERE student_answer.user_id=4 GROUP BY mcq_question.video_id);" | $msql
#echo "SELECT distinct(video.name) FROM video WHERE video.name = (SELECT video.name FROM video WHERE video.id IN (SELECT mcq_question.video_id FROM mcq_question INNER JOIN student_answer ON student_answer.question_id=mcq_question.id WHERE student_answer.user_id=4 GROUP BY mcq_question.video_id));" | $msql
echo "SELECT student_answer.user_id as userId,user_profile.student_name as studentName,school.school_name as schoolName,district.district_name as district,province.province_name as province\
	FROM student_answer \
	INNER JOIN user_profile ON user_profile.student_id=student_answer.user_id \
	INNER JOIN school ON school.id=user_profile.school_id \
	INNER JOIN district ON district.id=school.district_id \
	INNER JOIN province ON province.id=district.province_id \
	INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id \
	WHERE mcq_option.state=1 ;" | $msql
