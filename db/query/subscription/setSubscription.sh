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

function main(){
echo "SELECT id,phone FROM user;" | $msql

printf "Enter ID :"
read userId

echo "SELECT * FROM user_role;" | $msql
printf "Enter roleId :"
read roleId

echo "SELECT * from subscription_plan;" | $msql
printf "Enter planId :"
read planId

echo "SELECT * FROM grade;" | $msql
printf "Enter gradeId :"
read gradeId

dateTime=$(date '+%Y-%m-%d %H:%M:%S')
dateObj=$(date)
echo "INSERT INTO student_subscription_grade(id,user_id,plan_id,grade_id,started) VALUES('NULL',$userId,$planId,$gradeId,'$dateTime')" | $msql

printf "/n/n"

echo "SET @userId := $userId; SET @date_joined := (SELECT user.date_joined FROM user WHERE user.id=@userId) ; \
	SELECT \
	@userId, \
	grade.id as gradeId, \
	grade.grade_english as gradeName, \
		(CASE WHEN ssg.plan_id IS NOT NULL AND ssg.user_id=@userId \
			THEN sp.name \
			ELSE 'trial' \
		END) as planName, \
		(CASE WHEN ssg.plan_id IS NOT NULL AND ssg.user_id=@userId \
			THEN sp.id \
			ELSE (SELECT id FROM subscription_plan WHERE name like 'trial') \
		END) as planId, \
		(CASE WHEN ssg.started IS NOT NULL AND ssg.user_id=@userId \
			THEN ssg.started \
			ELSE (@date_joined) \
		END) as startedAt, \
		(CASE \
			WHEN ssg.plan_id IS NULL \
				THEN DATE_ADD(@date_joined, INTERVAL 7 DAY) \
			WHEN ssg.plan_id = 3 \
				THEN DATE_ADD(ssg.started, INTERVAL 1 MONTH) \
			WHEN ssg.plan_id = 4 \
				THEN DATE_ADD(ssg.started, INTERVAL 3 MONTH) \
			WHEN ssg.plan_id = 5 \
				THEN DATE_ADD(ssg.started, INTERVAL 12 MONTH) \
		END) as endedAt \
	FROM grade \
	LEFT JOIN student_subscription_grade as ssg ON ssg.grade_id=grade.id \
	LEFT JOIN subscription_plan as sp ON sp.id=ssg.plan_id \
	WHERE ssg.user_id=@userId \
	;" | $msql
echo "UPDATE user SET role_id=$roleId WHERE id=$userId" | $msql
	main
}
main
#	CROSS JOIN user ON user.id=ssg.user_id \
#	WHERE user.id=@userId;" | $msql


