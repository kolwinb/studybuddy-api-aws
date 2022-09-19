#!/bin/bash
#very important
#"('S) you can add double quots (''S)" in csv file, then error will disappear
#use ~ delimeter to export csv

#./finishTime.sh 54

line=$(head -n 1 ../../.access)
uname=${line%:*}
upass=${line#*:}


#msql="mysql -N -h192.168.1.120 -u$uname -p$upass studybuddy"
msql="mysql -h192.168.1.120 -u$uname -p$upass studybuddy"
#total answered by given user

echo "................."
echo " \
SELECT \
(CASE WHEN ba.id IS NOT NULL \
	THEN 'True' \
	ELSE 'False' \
	END) as isFinished, \
user.uniqid as gamerId, \
up.name, \
up.avatar_id \
FROM user_profile as up \
INNER JOIN user ON user.id=up.user_id \
LEFT JOIN battle_answer as ba ON ba.battle_id=$1 \
WHERE user.uniqid='1660785554424o0lg2ll6ycu70t' 
; \
" | $msql

echo "#############"

#test battle_ids (251=(2,3),256=(3,2))
#228
#221
echo " \
SELECT \
bp.id as battle_id, \
(CASE WHEN ba.id IS NOT NULL \
	THEN 'True' \
	ELSE 'False' \
	END) as isFinished, \
(SELECT COUNT(ban.id) FROM battle_answer as ban WHERE ban.user_id=user.uniqid AND ban.battle_id=bp.id) as totalQuestions, \
(SELECT COUNT(ban.id) FROM battle_answer as ban INNER JOIN mcq_option as mo ON mo.id=ban.option_id WHERE mo.state = 1 AND ban.user_id=user.uniqid AND ban.battle_id=bp.id) as correctAnswers, \
(SELECT COUNT(ban.id) FROM battle_answer as ban INNER JOIN mcq_option as mo ON mo.id=ban.option_id WHERE mo.state = 0 AND ban.user_id=user.uniqid AND ban.battle_id=bp.id) as wrongAnswers, \
(SELECT (CASE WHEN COUNT(ban.id) = 0 \
		THEN '000' \
		ELSE DATE_FORMAT(MIN(ban.started),'%Y-%m-%d %H:%m:%s') \
		END)as started FROM battle_answer as ban WHERE ban.user_id=user.uniqid AND ban.battle_id=bp.id ORDER BY ban.started ASC) as startedAt, \
(SELECT (CASE WHEN COUNT(ban.id) = 0 \
		THEN '000' \
		ELSE DATE_FORMAT(MAX(ban.ended),'%Y-%m-%d %H:%m:%s') \
		END)as ended FROM battle_answer as ban WHERE ban.user_id=user.uniqid AND ban.battle_id=bp.id ORDER BY ban.ended ASC) as endedAt, \
(SELECT (CASE WHEN COUNT(ban.id) = 0 \
		THEN '000' \
		ELSE TIMEDIFF(MAX(ban.ended),MIN(ban.started)) \
		END)as ended FROM battle_answer as ban WHERE ban.user_id=user.uniqid AND ban.battle_id=bp.id ORDER BY ban.ended ASC) as duration, \
user.uniqid as gamerId, \
up.name, \
up.avatar_id \
FROM battle_pool as bp \
INNER JOIN user ON user.uniqid=bp.user1id OR user.uniqid=bp.user2id \
INNER JOIN user_profile as up ON up.user_id=user.id \
LEFT JOIN battle_answer as ba ON ba.battle_id=bp.id \
WHERE bp.id=$1 \
GROUP BY up.user_id \
; \
" | $msql




#WHERE user.uniqid='1663565746424o0lbkal88c3ct4' \

#WHERE ba.battle_id=$1 AND ba.user_id='1660785554424o0lg2ll6ycu70t' \

#WHERE ba.battle_id=$1 AND ba.user_id='424o0lnpwl5oudqjl' \

#(SELECT COUNT(bans.id) FROM battle_answer as bans INNER JOIN mcq_option as mop ON mop.option_id=bans.option_d  WHERE bans.battle_id=ba.battle_id AND mop.state=1). \
