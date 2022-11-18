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
CREATE VIEW view_most_favorite AS \
SELECT \
sf.id as id, \
count(sf.id) AS total, \
video.name AS lesson, \
subject.subject_english AS subject, \
grade.grade_english AS grade \
FROM student_favorite AS sf \
INNER JOIN video ON video.id = sf.video_id \
INNER JOIN grade ON grade.id = video.grade \
INNER JOIN subject ON subject.id=video.subject_id \
WHERE sf.status = 1 \
GROUP BY sf.video_id \
;" | $msql
