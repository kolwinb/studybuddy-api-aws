#!/bin/bash
#very important
#"('S) you can add double quots (''S)" in csv file, then error will disappear
#use ~ delimeter to export csv


line=$(head -n 1 ../../.access)
uname=${line%:*}
upass=${line#*:}


#msql="mysql -N -h192.168.1.120 -u$uname -p$upass studybuddy"
msql="mysql -h192.168.1.120 -u$uname -p$upass studybuddy"
#total answered by given user
echo " SELECT user.id, up.name, user.phone, user.role_id from user_profile as up INNER JOIN user ON user.id=up.user_id;" | $msql
printf "Enter user ID : "
read userId
echo "SELECT * FROM user_role;" | $msql
printf "Enter role ID : "
read roleId
echo "UPDATE user SET role_id = $roleId WHERE id = $userId;" | $msql
echo " SELECT user.id, up.name, user.phone, user.role_id from user_profile as up INNER JOIN user ON user.id=up.user_id;" | $msql

