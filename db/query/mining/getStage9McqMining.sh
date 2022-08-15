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

echo " SET @countIndex := 0; \
SELECT \
	count(mcq.qid) as qcount, \
	mcq.qid AS questionId, \
	mcq.lessonId as lessonId, \
	mcq.subjectId as subjectId, \
	@countIndex := @countIndex + 1 as RowNum \
FROM ( \
		SELECT \
			mcq_question.id AS qid, \
			video.id AS lessonId, \
			video.subject_id as subjectId
		FROM \
			( \
				SELECT * FROM video GROUP BY video.subject_id
			)  AS video \
		JOIN mcq_question ON mcq_question.video_id=video.id \
	) AS mcq \

/* JOIN mcq_question ON mcq_question.video_id=video.id */ \
 ;" | $msql

