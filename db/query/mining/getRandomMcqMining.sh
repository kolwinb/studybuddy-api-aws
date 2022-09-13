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
		video.id, \
		video.subject_id, \
		FLOOR(RAND()*((video.max-video.min)+video.id)) \
			FROM (SELECT \
				min(video.id) as min, \
				max(video.id) as max, \
				video.id as id, \
				video.subject_id as subject_id \
			FROM video \
			WHERE video.grade= 6 AND lesson <> 0 \
			GROUP BY video.subject_id \
			) as video \
			/* INNER JOIN mcq_question as mcqq ON mcqq.video_id=video.id */ \
	;" | $msql
