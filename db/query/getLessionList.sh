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

echo "SELECT \
	video.name as fileName, video.id as videoid, \
	(SELECT (CASE WHEN count(student_favorite.id)=0 THEN 'False' ELSE 'True' END) FROM student_favorite WHERE student_favorite.video_id=video.id AND student_favorite.user_id=28) AS favrite, \
	(SELECT (CASE WHEN count(student_answer.id)=0 THEN 'False' ELSE 'True' END) \
		FROM student_answer \
		INNER JOIN mcq_question ON mcq_question.id=student_answer.question_id \
		WHERE mcq_question.video_id=video.id AND student_answer.user_id=28) AS completeStatus, \
	(SELECT count(mcq_question.id)  \
		FROM mcq_question \
		INNER JOIN mcq_option ON mcq_option.question_id=mcq_question.id \
		 WHERE mcq_question.video_id=video.id AND mcq_option.state=1), \
	(SELECT count(mcq_question.id)  \
		FROM mcq_question \
		 WHERE mcq_question.video_id=video.id), \
	(SELECT count(mcq_question.id) \
		FROM mcq_question \
		INNER JOIN student_answer ON student_answer.question_id=mcq_question.id \
		INNER JOIN mcq_option ON mcq_option.question_id=mcq_question.id \
		WHERE mcq_question.video_id=video.id AND student_answer.user_id=28 AND mcq_option.state=1), \
	(SELECT COUNT(student_answer.id) \
		FROM student_answer \
		INNER JOIN mcq_question ON mcq_question.id=student_answer.question_id \
		INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id \
		WHERE mcq_question.video_id=video.id AND mcq_option.state=1 AND student_answer.user_id=28) \
	FROM video \
	INNER JOIN subject ON subject.id=video.subject_id \
	INNER JOIN syllabus ON syllabus.id=video.syllabus \
	WHERE video.grade=6 AND video.syllabus=2016 AND video.subject_id=1;" | $msql

#	INNER JOIN student_favorite ON student_favorite.video_id=video.id \

#    INNER JOIN student_favorite ON student_favorite.video_id = video.id \
#	RIGHT OUTER JOIN student_favorite ON student_favorite.video_id=video.id \
#	WHERE video.grade=6 AND video.subject_id=6;" | $msql

#	WHERE (video.grade=6 AND video.subject_id=6)  AND (student_favorite.video_id=10 OR student_like.video_id=10);" | $msql
#	WHERE video.grade=6 AND video.subject_id=6;" | $msql

#	WHERE (video.grade=6 AND video.subject_id=6)  AND (student_favorite.video_id=10 OR student_like.video_id=10);" | $msql


#	student_favorite.status as favorite, \
#	student_like.status as like, \
#	INNER JOIN student_favorite ON student_favorite.video_id=video.id \
#	INNER JOIN student_like ON student_like.video_id=video.id \
