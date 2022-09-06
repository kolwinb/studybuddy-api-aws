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

echo "SET @userId := 1; SET @date_joined := (SELECT user.date_joined FROM user WHERE user.id=@userId) ; \
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
	CROSS JOIN student_subscription_grade as ssg ON ssg.grade_id=grade.id \
	CROSS JOIN subscription_plan as sp ON sp.id=ssg.plan_id \
	CROSS JOIN user ON user.id=ssg.user_id \
	WHERE user.id=@userId;" | $msql

printf "\n\n"

echo "SET @userId := 1; SET @date_joined := (SELECT user.date_joined FROM user WHERE user.id=@userId) ; \
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
#	CROSS JOIN user ON user.id=ssg.user_id \
#	WHERE user.id=@userId;" | $msql

printf "\n\n"

echo "SET @userId := 1; SET @date_joined := (SELECT user.date_joined FROM user WHERE user.id=@userId) ; \
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
#	CROSS JOIN user ON user.id=ssg.user_id \
#	WHERE user.id=@userId;" | $msql


