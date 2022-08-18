#!/bin/bash
#very important
#"('S) you can add double quots (''S)" in csv file, then error will disappear
#use ~ delimeter to export csv


line=$(head -n 1 ../../.access)
uname=${line%:*}
upass=${line#*:}


#msql="mysql -N -h192.168.1.120 -u$uname -p$upass studybuddy"
msql="mysql -h192.168.1.120 -u$uname -p$upass studybuddy"
#total answered by given user
echo " SELECT \
		grade.grade_english, \
		video.id, \
		video.subject_id, \
		mcq_question.id \
		FROM grade \
		LEFT JOIN video ON video.grade=grade.id \
		LEFT JOIN mcq_question ON mcq_question.video_id=video.id \
		WHERE video.grade=6 \
		LIMIT 15 \
		;" | $msql

echo " SELECT video.grade as grade, \
		video.id as videoId, video.subject_id as subjectId, \
		mcq_question.id as questionId,mcq_question.heading AS heading,mcq_question.question as question,mcq_question.image as image, \
		mcq_option.id AS optionId,mcq_option.option as answer,mcq_option.image AS image, \
		(CASE WHEN mcq_option.state = 1 \
			THEN True \
			ELSE False \
		END) as isCurrect \
		FROM video \
		INNER JOIN mcq_question ON mcq_question.video_id=video.id \
		INNEr JOIN mcq_option ON mcq_option.question_id=mcq_question.id \
		WHERE video.grade=6 AND video.subject_id=1 \
		LIMIT 15 \
		;" | $msql
#		HAVING COUNT(video.grade) < 3 \

echo " SELECT video.grade as grade, \
		video.id as videoId, video.subject_id as subjectId, \
		mcq_question.id as questionId, \
		mcq_question.heading AS heading, mcq_question.question as question,mcq_question.image as image \
		FROM video \
		INNER JOIN mcq_question ON mcq_question.video_id=video.id \
		WHERE video.grade=6 AND video.subject_id=2 \
		LIMIT 15 \
		;" | $msql
