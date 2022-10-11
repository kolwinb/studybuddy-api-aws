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

echo "INSERT INTO syllabus(id,syllabus_english,syllabus_sinhala) VALUES('2011','Syllabus-2011','2011 විෂය නිර්දේශය');" | $msql
echo "INSERT INTO syllabus(id,syllabus_english,syllabus_sinhala) VALUES('2010','Syllabus-2010','2010 විෂය නිර්දේශය');" | $msql
