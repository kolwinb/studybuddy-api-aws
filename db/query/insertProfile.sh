#!/bin/bash
#very important
#"('S) you can add double quots (''S)" in csv file, then error will disappear
#use ~ delimeter to export csv


line=$(head -n 1 ../.access)
uname=${line%:*}
upass=${line#*:}


msql="mysql -N -h192.168.1.120 -u$uname -p$upass studybuddy"
#total answered by given user
printf "\nprofile inserted : "
echo "INSERT INTO user_profile(id,school_id,student_id,student_name,student_grade) VALUES('NULL',100,1,'test2','6');" | $msql
echo "INSERT INTO user_profile(id,school_id,student_id,student_name,student_grade) VALUES('NULL',200,2,'test3','6');" | $msql


