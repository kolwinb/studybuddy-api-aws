#!/bin/bash
#this will enable subscription for all grades in specifice date range
#very important
#"('S) you can add double quots (''S)" in csv file, then error will disappear
#use ~ delimeter to export csv


line=$(head -n 1 ../../.access)
uname=${line%:*}
upass=${line#*:}

dateJoinStart='2022-10-11'
dateJoinEnd='2022-10-11'

#msql="mysql -N -h192.168.1.120 -u$uname -p$upass studybuddy"
msql="mysql -N -h172.31.48.100 -u$uname -p$upass studybuddy"
#total answered by given user

function main(){
#teacher role
#userArr=$(echo "SELECT id FROM user WHERE role_id=1 and date_joined > '2022-10-05';" | $msql)
echo "UPDATE user SET role_id=1 WHERE DATE(date_joined) BETWEEN '$dateJoinStart' AND '$dateJoinEnd'" | $msql
userArr=$(echo "SELECT id FROM user WHERE role_id=1 and (DATE(date_joined) BETWEEN '$dateJoinStart' AND '$dateJoinEnd');" | $msql)
gradeArr=$(echo "SELECT id FROM grade;" | $msql)

dateTime=$(date '+%Y-%m-%d %H:%M:%S')
dateObj=$(date)
planId=1
echo $userArr
for userId in ${userArr}
do
 echo $userId
 for gradeId in ${gradeArr}
 do
	 getState=$(echo "SELECT id FROM student_subscription_grade WHERE user_id=$userId AND plan_id=$planId AND grade_id=$gradeId" | $msql)
	 if [ -z $getState ]
	 then
	  echo $useId" "$planId" "$gradeId" subscription Not found, it is being enabled..." 
	  echo "INSERT INTO student_subscription_grade(id,user_id,plan_id,grade_id,started) VALUES(0,$userId,$planId,$gradeId,'$dateTime')" | $msql
	 else 
	  echo $useId" "$planId" "$gradeId" subscription Found" 
	 fi
 done
done
#free plan

#grade id 6 to 13


}
main
#	CROSS JOIN user ON user.id=ssg.user_id \
#	WHERE user.id=@userId;" | $msql


