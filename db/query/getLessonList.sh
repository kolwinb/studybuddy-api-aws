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

echo " \
SELECT \
	(CASE \
		WHEN user.role_id = 1 \
			THEN 1000 \
		WHEN user.role_id = 2 \
			THEN (CASE WHEN ssg.plan_id = 3 AND NOW() <= DATE_ADD(ssg.started, INTERVAL 7 DAY) THEN 1000 ELSE 0 END) \
		WHEN user.role_id = 3 \
			THEN (CASE WHEN ssg.plan_id = 3 AND NOW() <= DATE_ADD(ssg.started, INTERVAL 7 DAY) THEN 1000 ELSE 0 END)
		WHEN user.role_id = 4 \
			THEN (CASE  WHEN COUNT(ssg.plan_id)=0 \
						THEN 1 \
						ELSE (CASE WHEN ssg.plan_id = 3 AND NOW() <= DATE_ADD(ssg.started, INTERVAL 1 MONTH) \
									THEN 3000 \
									ELSE \
										CASE \
										WHEN ssg.plan_id = 4 AND NOW() <= DATE_ADD(ssg.started, INTERVAL 3 MONTH) \
											THEN 4000 \
											ELSE \
												CASE \
												WHEN ssg.plan_id = 5 AND NOW() <= DATE_ADD(ssg.started, INTERVAL 12 MONTH) \
													THEN 5000 \
													ELSE 0 \
												END \
										END \
							END) \
				 END) \
	END) as planLimit \
FROM user \
INNER JOIN student_subscription_grade as ssg ON ssg.user_id=user.id \
WHERE user.id=1 AND ssg.grade_id=8 \
;" | $msql
#INNER JOIN student_subscription_grade as ssg ON ssg.user_id=user.id \

