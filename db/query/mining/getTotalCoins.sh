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
	SELECT  \
	(CASE WHEN mma.stage_id = 9 \
		THEN COUNT(mma.id)* 5 \
		ELSE COUNT(mma.id)* 3 \
	END) as totalCoin \
	FROM mcq_mining_answer as mma \
	inner join mcq_option on mcq_option.id=mma.option_id \
	WHERE user_id=22 AND mcq_option.state=1 \
	;" | $msql
	
echo " \
	SELECT  \
	 count(id) as count \
	FROM mcq_mining_answer \
	WHERE user_id=22 AND stage_id=1 \
	;" | $msql
