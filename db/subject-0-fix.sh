#!/bin/bash
#video name first space occured then subject_id will be 0
# we need find '%science%'

line=$(head -n 1 ../../.access)
uname=${line%:*}
upass=${line#*:}
msql="mysql -N -h192.168.1.120 -u$uname -p$upass studybuddy"
# msql="mysql -h192.168.1.120 -u$uname -p$upass studybuddy"

echo " \
	SELECT video.id,subject.id \
	FROM video\
	WHERE subject_id=0 AND name like '%science%';" | $msql
