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
CREATE VIEW view_user_role AS SELECT \
user_role.id as Id, \
count(user.id) as Total, \
user_role.name as Users_type \
FROM user
INNER JOIN user_role on user_role.id=user.role_id \
GROUP BY user.role_id \
;" | $msql
