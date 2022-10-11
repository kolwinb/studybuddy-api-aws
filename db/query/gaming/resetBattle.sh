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

echo "DELETE FROM coin_pool; \
		DELETE FROM battle_answer; \
		DELETE FROM battle_pool WHERE id > 1; \
		;" | $msql
#		 UPDATE battle_pool set status='waiting' WHERE id=1;" | $msql
}

main
