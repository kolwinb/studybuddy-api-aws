#!/bin/bash
#very important
#"('S) you can add double quots (''S)" in csv file, then error will disappear
#use ~ delimeter to export csv


line=$(head -n 1 ../.access)
uname=${line%:*}
upass=${line#*:}


#msql="mysql -N -h192.168.1.120 -u$uname -p$upass studybuddy"
msql="mysql -h172.31.48.100 -u$uname -p$upass studybuddy"
#total answered by given user
echo "SELECT \
COUNT(DISTINCT(video.id)) as totalLessons, \
DATE_FORMAT(started,'%a') AS dayName \
FROM student_answer \
INNER JOIN mcq_question ON mcq_question.id=student_answer.question_id \
INNER JOIN video ON video.id=mcq_question.video_id \
WHERE started >= (NOW() - INTERVAL 7 DAY) \
GROUP BY DATE_FORMAT(started,'%d') \
;" | $msql
