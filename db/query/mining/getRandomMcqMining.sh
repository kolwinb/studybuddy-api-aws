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

#get random value from each subject to get single video + 5 question
function randomMcq(){
subjectId=$1
}


echo " \
		SELECT \
			video.total, \
			video.max, \
			video.minMax, \
			mcq_question.id, \
			vid.grade, \
			vid.subject_id, \
			randId \
			FROM (SELECT \
				/* DISTINCT(video.subject_id), */ \
				/* FLOOR(RAND()*(max(id)-min(id))+min(id)) as randId */ \
				COUNT(id) as Total, \
				max(id) as max, \
				SUM(COUNT(id)+min(id)) as minMax, \
				FLOOR(RAND()*(max(id)-min(id))+min(id)) as randId, \
				subject_id \
			FROM video \
			WHERE grade=6 AND lesson != 0 \
			GROUP BY subject_id \
			) as video \
			INNER JOIN video as vid on vid.id=randId \
			INNER JOIN mcq_question on mcq_question.video_id=vid.id \
	;" | $msql

echo "IQ "
echo " \
		SELECT \
			iqqu.id, \
			iqqu.level, \
			iqo.option, \
			iqo.state \
			FROM (SELECT \
				/* DISTINCT(video.subject_id), */ \
				/* FLOOR(RAND()*(max(id)-min(id))+min(id)) as randId */ \
				id \
			FROM iq_question \
			ORDER BY RAND() LIMIT 6 \
			) as iqq \
			INNER JOIN iq_question as iqqu ON iqqu.id=iqq.id \
			INNER JOIN iq_option as iqo ON iqo.question_id=iqq.id \
	;" | $msql

echo " "

echo " \
	SELECT \
	video.id, \
	video.subject_id, \
	video.grade \
	FROM video \
	INNER JOIN mcq_question on mcq_question.video_id=video.id \
	INNER JOIN mcq_option on mcq_option.question_id=mcq_question.id \
	WHERE video.grade=6 \
	ORDER BY RAND() \
	LIMIT 24 \
	;" | $msql
