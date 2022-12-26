#!/bin/bash
#very important
#"('S) you can add double quots (''S)" in csv file, then error will disappear
#use ~ delimeter to export csv


line=$(head -n 1 ../.access)
uname=${line%:*}
upass=${line#*:}


for dirName in $(ls -d */)
do
    echo $dirName
done

printf "Enter Directory Name :"
read dirName

if [ ! $dirName ]; then
	printf "Empty dir not allowed\n"
else
#	msql="mysql -N -h192.168.1.120 -u$uname -p$upass studybuddy"
	msql="mysql -N -h172.31.48.100 -u$uname -p$upass studybuddy"
	let startAt=$(echo "SELECT count(id) FROM iq_option;" | $msql)+1
	echo $startAt
	echo "ALTER TABLE iq_option  AUTO_INCREMENT = $startAt;" | $msql
	while read line
	do
	question_id=$(echo $line | cut -d'~' -f1) #questionid
	option=$(echo $line | cut -d'~' -f2) #option
	state=$(echo $line | cut -d'~' -f3) #state
	echo "INSERT INTO iq_option VALUES (0,'$question_id','$option','$state');" | $msql
	#echo $district$province
	done < $dirName/iq_option.csv
fi
