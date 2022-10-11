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
#varDate=$(date +"%D %T")
varDate=$(date +"%Y-%m-%d %H:%M:%S")
echo $varDate
function main(){
echo "SELECT id,status,datetime, \
		@timediff := TIMESTAMPDIFF(MINUTE,datetime,'$varDate'), \
		(CASE WHEN 400 < TIMESTAMPDIFF(MINUTE,'$varDate',datetime) \
			THEN 'True' \
			ELSE 'False' \
		END) AS textDe \
	 FROM battle_pool WHERE (user1id='424o0lnpwl5oudqjl' OR user2id='424o0lnpwl5oudqjl') AND status like 'running'" | $msql
}

main
