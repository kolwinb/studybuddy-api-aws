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


echo " \
CREATE VIEW view_lesson_completion AS \
SELECT \
DISTINCT(vid.id) as id, \
COUNT(DISTINCT(vid.id)) as total_lesson, \
subject.subject_english AS subject, \
grade.grade_english AS grade \
FROM student_answer sta \
INNER JOIN mcq_question ON mcq_question.id=sta.question_id \
INNER JOIN video as vid ON vid.id = mcq_question.video_id \
INNER JOIN grade on grade.id = vid.grade \
INNER JOIN subject on subject.id = vid.subject_id \
GROUP BY vid.grade, vid.subject_id \
;" | $msql

#INNER JOIN mcq_option ON mcq_option.id=sta.option_id \

#this also working
echo " \
/* CREATE VIEW view_most_favorite AS */ \
SELECT \
vid.id as id, \
COUNT(vid.id) as total_lesson, \
subject.subject_english AS subject, \
grade.grade_english AS grade \
FROM video as vid
INNER JOIN grade on grade.id = vid.grade \
INNER JOIN subject on subject.id = vid.subject_id \
WHERE vid.id IN ( \
SELECT \
DISTINCT(video.id) \
FROM student_answer sta \
INNER JOIN mcq_question ON mcq_question.id=sta.question_id \
INNER JOIN video ON video.id = mcq_question.video_id \
) \
GROUP BY vid.grade, vid.subject_id \
;" | $msql
