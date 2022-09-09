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
echo " \
SELECT iq.level AS levelId, \

/* @name:=CONCAT('Level ',iq.level) as levelName, */ \
iq.hasCompleted as hasCompleted FROM ( \
SELECT \
id, \
level, \
( \
	CASE WHEN (SELECT iq_answer.id FROM iq_answer WHERE iq_answer.question_id=iq_question.id) IS NULL \
	   THEN 'False' \
	   ELSE 'True' \
	END \
) as hasCompleted \
FROM iq_question \
GROUP BY level \
) as iq \
ORDER BY iq.id \
" | $msql
