#!/bin/bash
#very important
#"('S) you can add double quots (''S)" in csv file, then error will disappear
#use ~ delimeter to export csv

#./finishTime.sh 54

line=$(head -n 1 ../../.access)
uname=${line%:*}
upass=${line#*:}


#msql="mysql -N -h192.168.1.120 -u$uname -p$upass studybuddy"
msql="mysql -h192.168.1.120 -u$uname -p$upass studybuddy"
#total answered by given user

echo "................."
echo " \
SELECT \
video.id as lessonId, \
mcq_question.id as questionId, \
mcq_question.heading as heading, \
mcq_question.question as question, \
mcq_question.image as questionImage, \
subject.subject_english as subject, \
grade.grade_english as grade, \
mcq_option.id as optionId, \
mcq_option.option as answer, \
mcq_option.image as optionImage, \
( \
CASE WHEN mcq_option.state = 1 \
THEN 'True' \
ELSE 'False' \
END \
) as isCorrect \
FROM ( \
SELECT \
FLOOR(RAND()*((MIN(id)+20)-MIN(id))+MIN(id)) as randId \
FROM video \
WHERE grade=6 AND lesson <> 0 \
GROUP BY subject_id \
) AS randVideo \
INNER JOIN video ON video.id=randVideo.randId \
INNER JOIN mcq_question ON mcq_question.video_id=video.id \
INNER JOIN mcq_option ON mcq_option.question_id=mcq_question.id \
INNER JOIN subject ON subject.id=video.subject_id \
INNER JOIN grade ON grade.id=video.grade \
WHERE video.grade=6 \
LIMIT 16 \
;" | $msql
