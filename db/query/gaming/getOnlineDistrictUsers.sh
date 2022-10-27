#!/bin/bash
#very important
#"('S) you can add double quots (''S)" in csv file, then error will disappear
#use ~ delimeter to export csv

#./finishTime.sh 54

line=$(head -n 1 ../../.access)
uname=${line%:*}
upass=${line#*:}


#msql="mysql -N -h192.168.1.120 -u$uname -p$upass studybuddy"
msql="mysql -h172.31.48.100 -u$uname -p$upass studybuddy"
#total answered by given user

echo "................."
echo " \
select dist.id,school_id \
from user_profile as up \
INNER JOIN school on school.id=up.school_id \
INNER JOIN district as dist on dist.id=school.district_id \
where up.school_id IN (SELECT sch.id FROM school as sch where sch.district_id= ( \
	SELECT district.id \
	FROM user_profile as u_p \
	INNER JOIN school ON school.id=u_p.school_id \
	INNER JOIN district ON district.id=school.district_id \
	WHERE u_p.user_id=27)) \
;" | $msql

#working
#echo " \
#SELECT sch.district_id,sch.id \
#FROM school as sch \
#where sch.district_id= ( \
#	SELECT district.id \
#	FROM user_profile as u_p \
#	INNER JOIN school ON school.id=u_p.school_id \
#	INNER JOIN district ON district.id=school.district_id \
#	WHERE u_p.user_id=1) \
#;" | $msql
