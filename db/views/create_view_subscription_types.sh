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
CREATE VIEW view_subscription_types AS SELECT \
ssg.id as id, \
count(ssg.id) as Total, \
grade.grade_english as grade, \
sup.name as Plan, \
sup.detail as detail \
FROM student_subscription_grade as ssg \
INNER JOIN subscription_plan as sup on sup.id=ssg.plan_id \
INNER JOIN grade ON grade.id=ssg.grade_id \
GROUP BY ssg.plan_id, ssg.grade_id \
;" | $msql
