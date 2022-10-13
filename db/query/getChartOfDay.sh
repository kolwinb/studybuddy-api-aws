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
echo "select count(question_id), DAYNAME(started) from student_answer INNER JOIN mcq_question ON mcq_question.id=student_answer.question_id INNER JOIN video ON video.id=mcq_question.video_id WHERE user_id=28 GROUP BY DAYNAME(started);" | $msql
echo ""
echo "select distinct(video.id), DAYNAME(started) from student_answer INNER JOIN mcq_question ON mcq_question.id=student_answer.question_id INNER JOIN video ON video.id=mcq_question.video_id WHERE user_id=28 GROUP BY DAYNAME(started);"|$msql

echo "SELECT COUNT(DISTINCT(video.id)) AS totalLesson, \
	DATE_FORMAT(started,'%a') AS dayName, \
	(CASE WHEN started IS NULL AND DATE_FORMAT(NOW()-INTERVAL 7 DAY,'%a') = 'Sun' \
		THEN 0 \
		ELSE 11 \
	END) AS Sun \
	FROM student_answer \
	INNER JOIN mcq_question ON mcq_question.id=student_answer.question_id \
	INNER JOIN video ON video.id=mcq_question.video_id \
	WHERE user_id=1 AND started >= (NOW()-INTERVAL 7 DAY) \
	 GROUP BY DATE_FORMAT(started,'%a') ;"|$msql
#	GROUP BY DAYNAME(started);"|$msql


