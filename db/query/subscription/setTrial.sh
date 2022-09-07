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

function main(){
echo "SELECT id,phone FROM user;" | $msql

printf "Enter ID :"
read userId

echo "SELECT * FROM user_role;" | $msql
printf "Enter roleId :"
read roleId

#echo "SELECT * from subscription_plan;" | $msql
#printf "Enter planId :"
#read planId

#echo "SELECT * FROM grade;" | $msql
#printf "Enter gradeId :"
#read gradeId

dateTime=$(date '+%Y-%m-%d %H:%M:%S')
echo "DELETE FROM student_subscription_grade WHERE user_id=$userId;UPDATE user SET date_joined='$dateTime', role_id=$roleId WHERE id=$userId;" | $msql
main
}

main
