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
echo " SELECT count(subject.id),subject.subject_english \
		FROM subject \
		INNER JOIN video ON video.subject_id=subject.id GROUP BY subject.id;" | $msql

echo " SELECT count(subject.id),subject.subject_english \
		FROM subject \
		INNER JOIN video ON video.subject_id=subject.id \
		INNER JOIN mcq_question ON mcq_question.video_id=video.id \
		 GROUP BY subject.id;" | $msql
