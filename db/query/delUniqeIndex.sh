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
userId=74
#echo "DELETE FROM user WHERE id=$userId; DELETE FROM sms_verification WHERE user_id=$userId;DELETE FROM user_profile WHERE user_id=$userId" | $msql
echo "DELETE FROM user WHERE id=$userId; DELETE FROM user_profile WHERE user_id=$userId" | $msql
#echo "SHOW INDEX FROM user;" | $msql
#echo "ALTER TABLE user DROP INDEX $indexName;" | $msql

#delete key_name
#alter table user drop index key_name
