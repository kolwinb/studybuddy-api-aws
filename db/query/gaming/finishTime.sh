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

echo " \
SELECT \
(CASE WHEN COUNT(ba.id) <> 0 \
	THEN 'True' \
	ELSE 'False' \
	END) as isFinished, \
(SELECT \
	COUNT(bans.id) \
	FROM battle_answer as bans \
	INNER JOIN mcq_option as mop ON mop.id=bans.option_id  \
	where bans.user_id=ba.user_id AND mop.state=1 AND bans.battle_id=ba.battle_id \
) as correctAnswers, \
(SELECT \
	COUNT(bans.id) \
	FROM battle_answer as bans \
	INNER JOIN mcq_option as mop ON mop.id=bans.option_id  \
	where bans.user_id=ba.user_id AND mop.state=0 AND bans.battle_id=ba.battle_id\
) as wrongAnswers, \
count(ba.id) as totalQuestions, \
MIN(started) as minStarted, \
MAX(ended) as maxEnded, \
TIMEDIFF(MAX(ended),MIN(started)) AS durtion, \
ba.user_id, \
up.name, \
up.avatar_id \
FROM battle_answer as ba \
INNER JOIN user ON user.uniqid=ba.user_id \
INNER JOIN user_profile as up ON up.user_id=user.id \
WHERE ba.battle_id=$1 AND ba.user_id='1663565746424o0lbkal88c3ct4'  /* ba.user_id='1660785554424o0lg2ll6ycu70t' */ \
GROUP BY ba.user_id \
; \
" | $msql

echo " \
SELECT \
(CASE WHEN ba.id IS NOT NULL \
	THEN 'True' \
	ELSE 'False' \
	END) as isFinished, \
ba.user_id, \
up.name, \
up.avatar_id \
FROM user_profile as up \
INNER JOIN user ON user.id=up.user_id \
LEFT JOIN battle_answer as ba ON ba.user_id=user.id \
WHERE ba.battle_id=$1 AND user.uniqid='1663565746424o0lbkal88c3ct4' \
; \
" | $msql

#WHERE ba.battle_id=$1 AND ba.user_id='1660785554424o0lg2ll6ycu70t' \

#WHERE ba.battle_id=$1 AND ba.user_id='424o0lnpwl5oudqjl' \

#(SELECT COUNT(bans.id) FROM battle_answer as bans INNER JOIN mcq_option as mop ON mop.option_id=bans.option_d  WHERE bans.battle_id=ba.battle_id AND mop.state=1). \
