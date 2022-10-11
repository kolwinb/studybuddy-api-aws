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

gradeId=11
subjectId=1

#for subjectId in {1..8}
#grade 10 onwards
for subjectId in {1..10}
do
echo " \
INSERT INTO grade_subject(id,grade_id,subject_id) VALUES('',$gradeId,$subjectId);" | $msql
done
