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

#echo "DELETE FROM video;DELETE FROM mcq_question;DELETE FROM mcq_option" |$msql
#echo "ALTER TABLE video AUTO_INCREMENT=1;ALTER TABLE mcq_question AUTO_INCREMENT=1;ALTER TABLE mcq_option AUTO_INCREMENT=1;" |$msql
