#!/bin/bash
#very important
#"('S) you can add double quots (''S)" in csv file, then error will disappear
#use ~ delimeter to export csv


line=$(head -n 1 ../../.access)
uname=${line%:*}
upass=${line#*:}


#msql="mysql -N -h192.168.1.120 -u$uname -p$upass studybuddy"
msql="mysql -h192.168.1.120 -u$uname -p$upass studybuddy"

printf "\n Leader board : \n"
echo "SELECT student_answer.user_id, count(student_answer.user_id) as studentMark,user_profile.name as studentName,school.school_name as schoolName,district.district_english as district,province.province_english as province\
	FROM student_answer \
	INNER JOIN user_profile ON user_profile.user_id=student_answer.user_id \
	INNER JOIN school ON school.id=user_profile.school_id \
	INNER JOIN district ON district.id=school.district_id \
	INNER JOIN province ON province.id=district.province_id \
	INNER JOIN mcq_option ON mcq_option.id=student_answer.option_id \
	WHERE mcq_option.state=1 \
	GROUP BY student_answer.user_id \
	ORDER BY studentMark DESC \
	LIMIT 20;" | $msql

