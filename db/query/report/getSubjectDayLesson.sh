#!/bin/bash
#very important
#"('S) you can add double quots (''S)" in csv file, then error will disappear
#use ~ delimeter to export csv


line=$(head -n 1 ../../.access)
uname=${line%:*}
upass=${line#*:}


#msql="mysql -N -h192.168.1.120 -u$uname -p$upass studybuddy"
msql="mysql -h172.31.48.100 -u$uname -p$upass studybuddy"
#total answered by given user
echo " \
SELECT \
/* student_answer.user_id, */ \
subject.subject_english, \
COUNT(DISTINCT(video.id)) as totalLessons, \
DATE_FORMAT(started,'%a') as dayName \
FROM student_answer \
INNER JOIN mcq_question ON mcq_question.id=student_answer.question_id \
INNER JOIN video ON video.id=mcq_question.video_id \
INNER JOIN subject ON subject.id=video.subject_id \
WHERE user_id=1 AND  started >= (NOW() - INTERVAL 7 DAY) \
/* GROUP BY DATE_FORMAT(started,'%a') */ \
GROUP BY DATE_FORMAT(started,'%d'),video.subject_id \
; " | $msql
#select DAYNAME(date_joined),date_joined from user where date_joined>=DATE(NOW() - INTERVAL 6 DAY);

echo " \
	SELECT \
	/* student_answer.user_id, */ \
	subject.subject_english, \
	COUNT(DISTINCT(video.id)) as totalLessons, \
	DATE_FORMAT(started,'%a') as dayName \
	FROM grade_subject \
	INNER JOIN video ON video.id=mcq_question.video_id \
	INNER JOIN mcq_question ON mcq_question.id=student_answer.question_id \
	INNER JOIN subject ON subject.id=video.subject_id \
	WHERE user_id=1 AND  started >= (NOW() - INTERVAL 7 DAY) AND grade_subject.grade_id=6 \
	/* GROUP BY DATE_FORMAT(started,'%a') */ \
	GROUP BY DATE_FORMAT(started,'%d'),video.subject_id \
; " | $msql
