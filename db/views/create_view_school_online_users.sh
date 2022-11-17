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
CREATE VIEW view_school_online_user AS SELECT \
up.id as id, \
count(up.id) as total, \
up.status as status, \
school.school_name as school \
FROM user_profile as up \
INNER JOIN school on school.id = up.school_id \
WHERE up.status='online' \
GROUP BY school.id \
;" | $msql
