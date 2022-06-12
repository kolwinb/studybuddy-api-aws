#!/bin/bash


if [ ! $1 ]; then
	printf "File name required\n"
else
line=$(head -n 1 .access)
uname=${line%:*}
upass=${line#*:}
#echo "select * from user" | mysql -h192.168.1.120 -u$uname -p$upass studybuddy
#mysql -h192.168.1.120 -u$uname -p$upass studybuddy < district_province.sql
#mysql -h192.168.1.120 -u$uname -p$upass studybuddy < school.sql
#mysql -h192.168.1.120 -u$uname -p$upass studybuddy < country.sql
#mysql -h192.168.1.120 -u$uname -p$upass studybuddy < token.sql
mysql -h192.168.1.120 -u$uname -p$upass studybuddy < $1
fi
