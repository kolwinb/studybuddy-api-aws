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
echo "SELECT mcq_option.id, \
	mcq_option.option, \
	mcq_option.image \
   FROM mcq_option \
   INNER JOIN mcq_question ON mcq_question.id=mcq_option.question_id \
   WHERE mcq_question.video_id=6"| $msql
#	" | $msql
