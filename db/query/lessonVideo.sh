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
echo "SELECT * \
FROM video \
INNER JOIN mcq_question ON mcq_question.video_id=video.id \
INNER JOIN mcq_option ON mcq_option.question_id=mcq_question.id \
WHERE video.id=6;" | $msql
