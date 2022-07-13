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
echo " SELECT user_subscription.name as planName,user.date_joined as startedAt, \
		CASE
			WHEN user.plan_id = 1 \
				THEN '' \
			WHEN user.plan_id=2 \
				THEN DATE_ADD(user.date_joined,INTERVAL 7 DAY) \
			WHEN user.plan_id=3 \
				THEN DATE_ADD(user.date_joined,INTERVAL 1 MONTH) \
			WHEN user.plan_id=4 \
				THEN DATE_ADD(user.date_joined,INTERVAL 3 MONTH) \
			WHEN user.plan_id=5 \
				THEN DATE_ADD(user.date_joined,INTERVAL 12 MONTH) \
		end as expIn \
		FROM user \
		INNER JOIN user_subscription ON user_subscription.id=user.plan_id \
		WHERE user.id=7;" | $msql


#			else 
#			case when user.plan_id = 2 \
#			then DATE_ADD(user.date_joined,INTERVAL 7 DAY) \
#		end as expIn \

#		case when mcq_option.state=1 \
#			then 'True' \
#			else 'False' \
#		end as isCorrect \
