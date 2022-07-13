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


