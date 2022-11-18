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
CREATE VIEW view_iq_ranking AS  \
SELECT \
iqa.id as id, \
count(iqa.id) as total_iq, \
up.name as student_name, \
grade.grade_english as grade \
FROM iq_answer as iqa \
INNER JOIN user_profile AS up ON up.user_id=iqa.user_id \
INNER JOIN iq_option ON iq_option.id = iqa.option_id \
INNER JOIN grade ON grade.id=up.grade_id \
INNER JOIN school on school.id=up.school_id \
INNER JOIN district on district.id=school.district_id \
WHERE iq_option.state = 1 \
GROUP BY iqa.user_id, grade.id \
;" | $msql
