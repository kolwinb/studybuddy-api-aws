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
echo "SELECT \
		user.id as userId, \
		user_profile.name as Name, \
		user.date_joined as dateJoined, \
		user.last_login as lastLogin \
		FROM user
		LEFT JOIN user_profile ON user_profile.user_id=user.id ;" | $msql
