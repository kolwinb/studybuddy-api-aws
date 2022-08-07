#!/bin/bash
#very important
#"('S) you can add double quots (''S)" in csv file, then error will disappear
#use ~ delimeter to export csv


line=$(head -n 1 ../.access)
uname=${line%:*}
upass=${line#*:}


#msql="mysql -N -h192.168.1.120 -u$uname -p$upass studybuddy"
msql="mysql -h192.168.1.120 -u$uname -p$upass studybuddy"
#total answered by given user
echo "SELECT \
user.date_joined as startedAt, \
@endedAt := DATE_ADD(user.date_joined, INTERVAL 30 DAY) as endedAt, \
@planName := 'trial' as planName \
FROM user \
WHERE user.id=1 AND NOW() <= DATE_ADD(user.date_joined, INTERVAL 7 DAY);" | $msql

#THEN (SELECT DATE_FORMAT(user.date_joined,'%Y-%m-%d %H:%m:%s'), \

