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
echo " SELECT mcq_option.id,mcq_option.option,mcq_option.image, \
		case when mcq_option.state=1 \
			then 'True' \
			else 'False' \
		end as isCorrect \
		FROM mcq_option \
		WHERE mcq_option.question_id=27;" | $msql
