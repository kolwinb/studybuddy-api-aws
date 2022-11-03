#!/bin/bash
#very important
#"('S) you can add double quots (''S)" in csv file, then error will disappear
#use ~ delimeter to export csv


line=$(head -n 1 ../../.access)
uname=${line%:*}
upass=${line#*:}


#msql="mysql -N -h192.168.1.120 -u$uname -p$upass studybuddy"
msql="mysql -h172.31.48.100 -u$uname -p$upass studybuddy"
#total answered by given user
echo "SELECT video.id,video.name,mcq_question.image as question_image \
FROM video \
INNER JOIN mcq_question ON mcq_question.video_id=video.id \
WHERE video.grade=6 and mcq_question.image <> '' \
/* LIMIT 5 */;" | $msql > videoQuestion.csv

echo "SELECT video.id,video.name,mcq_option.image as answer_image \
FROM video \
INNER JOIN mcq_question ON mcq_question.video_id=video.id \
INNER JOIN mcq_option ON mcq_option.question_id=mcq_question.id \
WHERE video.grade=6 and mcq_option.image <> '' \
/* LIMIT 5 */;" | $msql > videoAnswer.csv
