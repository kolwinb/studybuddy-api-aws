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
echo "SELECT \
	(CASE \
		WHEN subP.plan_id IS NULL \
			THEN False \
			ELSE \
				CASE \
					WHEN subP.plan_id = 3 \
						THEN (CASE WHEN NOW() <= DATE_ADD(subP.started, INTERVAL 1 MONTH) THEN True ELSE False END) \
				 	WHEN subP.plan_id = 4 \
						THEN (CASE WHEN NOW() <= DATE_ADD(subP.started, INTERVAL 3 MONTH) THEN True ELSE False END) \
					WHEN subP.plan_id = 5 \
						THEN (CASE WHEN NOW() <= DATE_ADD(subP.started, INTERVAL 12 MONTH) THEN True ELSE False END) \
				END \
	END) as planStatus \
	FROM student_subscription_grade as subP \
	WHERE subP.plan_id=5 AND subP.grade_id=6 AND subP.user_id=1;" | $msql


printf "\n\n\n"
echo "SELECT \
	(CASE \
		WHEN subP.plan_id IS NOT NULL \
			THEN True \
			ELSE False \
		WHEN subP.plan_id =3 \
			THEN (SELECT (CASE WHEN NOW() <= DATE_ADD(subP.started, INTERVAL 7 DAY) THEN True ELSE False END) as status) \
		WHEN subP.plan_id =4 \
			THEN (SELECT (CASE WHEN NOW() <= DATE_ADD(subP.started, INTERVAL 7 DAY) THEN True ELSE False END) as Status) \
		WHEN subP.plan_id =5 \
			THEN (SELECT (CASE WHEN NOW() <= DATE_ADD(subP.started, INTERVAL 7 DAY) THEN True ELSE False END) as Status) \
	END) as planStatus \
	FROM student_subscription_grade as subP \
	WHERE subP.plan_id=5 AND subP.grade_id=6 AND subP.user_id=1;" | $msql
