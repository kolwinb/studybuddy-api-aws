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
echo "SELECT \
	(CASE WHEN bp.status = 'running'  \
			THEN (CASE WHEN bp.id = (SELECT ba.battle_id FROM battle_answer as ba WHERE ba.battle_id=bp.id AND ba.user_id='424o0lnpwl5oudqjl' AND ba.question_id=2) \
				THEN False \
				ELSE True \
				END) \
			ELSE False \
	END) as status \
	FROM battle_pool as bp \
	WHERE bp.id=1;" | $msql

echo ""

	echo "SELECT \
/* \
	(CASE WHEN bp.status = 'running'  \
		THEN (CASE WHEN ba.id IS NULL \
 			THEN True \
			ELSE False \
		END) \
	END) as status \
*/ \
	bpool.id \
	FROM (SELECT bp.id FROM  battle_pool as bp WHERE bp.id=1 AND bp.status='running') as bpool \
/* 	INNER JOIN battle_answer as ba ON ba.battle_id=bpool.id  */ \
/*	WHERE ba.question_id=1 AND ba.user_id='424o0lnpwl5oudqjl' */;" | $msql
