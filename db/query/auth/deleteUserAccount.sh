#!/bin/bash
#very important
#"('S) you can add double quots (''S)" in csv file, then error will disappear
#use ~ delimeter to export csv


line=$(head -n 1 ../../.access)
uname=${line%:*}
upass=${line#*:}


#msql="mysql -N -h192.168.1.120 -u$uname -p$upass studybuddy"
msql="mysql -h192.168.1.120 -u$uname -p$upass studybuddy"
#total answered by given u
function main() {
echo "select user.id,user.phone,up.name from user inner join user_profile as up on up.user_id=user.id;"|$msql
printf "enter userId: "
read userId
echo "delete from user_profile where user_id=$userId;delete from user where id=$userId;" | $msql
main
}

main
