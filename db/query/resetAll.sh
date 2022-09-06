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
echo "DELETE FROM user; \
		DELETE FROM sms_verification; \
		DELETE FROM sms_verification; ALTER TABLE sms_verification AUTO_INCREMENT = 1; \
		DELETE FROM user_profile; ALTER TABLE user_profile AUTO_INCREMENT = 1; \
		DELETE FROM user_passwdrecovery; ALTER TABLE user_passwdrecovery AUTO_INCREMENT = 1;\
		DELETE FROM user_affiliate; ALTER TABLE user_affiliate AUTO_INCREMENT = 1;\
		DELETE FROM student_answer; ALTER TABLE student_answer AUTO_INCREMENT = 1;\
		DELETE FROM student_answer; ALTER TABLE student_answer AUTO_INCREMENT = 1;\
		" | $msql
