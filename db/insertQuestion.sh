#!/bin/bash
#very important
#"('S) you can add double quots (''S)" in csv file, then error will disappear
#use ~ delimeter to export csv


line=$(head -n 1 .access)
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
    msql="mysql -N -h192.168.1.120 -u$uname -p$upass studybuddy"
    let startAt=$(echo "SELECT count(id) FROM mcq_question;" | $msql)+1
    echo $startAt
	echo "ALTER TABLE mcq_question  AUTO_INCREMENT = $startAt;" | $msql
	while read line
	do
	col1=$(echo $line | cut -d'~' -f1) #videoid
	col2=$(echo $line | cut -d'~' -f2) #heading
	col3=$(echo $line | cut -d'~' -f4) #question
	col4=$(echo $line | cut -d'~' -f3) #image


	echo "INSERT INTO mcq_question VALUES ('NULL','$col1','$col2','$col3','$col4');" | $msql
	#echo $district$province
	done < $dirName/mcq_question.csv
fi
