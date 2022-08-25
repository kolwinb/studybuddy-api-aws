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
	SELECT iqq.level as leve, \
		iqo.question_id, \
		iqo.id , \
		iqo.option \
	FROM iq_question iqq\
	INNER JOIN iq_option as iqo ON iqo.question_id=iqq.id \
	WHERE iqq.level=1 \
	;" | $msql
