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
	SELECT * FROM iq_answer WHERE user_id=22 ORDER BY option_id ASC; \
	SELECT COUNT(iq_option.id) as coins \
	FROM iq_answer \
	INNER JOIN iq_option on iq_option.id=iq_answer.option_id \
	WHERE iq_answer.user_id=22 AND iq_option.state=1 \
	;" | $msql
