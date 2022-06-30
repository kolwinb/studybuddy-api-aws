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
    funMain
else
	msql="mysql -N -h192.168.1.120 -u$uname -p$upass studybuddy"
	let startAt=$(echo "SELECT count(id) FROM video;" | $msql)+1
	echo $startAt
	echo "ALTER TABLE video auto_increment=$startAt;" | $msql

	while read line
	do
	#unicode(.) = english (')
	#unicode(,) = english (")
	#insert escap with backslash
	#line=$(echo $line | sed 's/\,/\\\,/g')
	#line=$(echo $line | sed  "s/\./\\\./g")
	#echo $line
	grade=$(echo $line|cut -d'~' -f2)
	syllabus=$(echo $line | cut -d'~' -f1)
	name=$(echo $line | cut -d'~' -f3)
	sub=${name%%-*} #extract subject name form video file
	subject_id=$(echo "SELECT id FROM subject WHERE subject_english like '$sub';" | $msql)
	episode=$(echo $line | cut -d'~' -f4)
	term=$(echo $line | cut -d'~' -f5)
	lesson=$(echo $line | cut -d'~' -f6)
	lesson_name=$(echo $line | cut -d'~' -f7)
	short_desc=$(echo $line | cut -d'~' -f8)
	long_desc=$(echo $line | cut -d'~' -f9)

	echo "subject : "$sub" : id :"$subject_id
	echo "INSERT INTO video VALUES ('NULL','$grade','$syllabus','$subject_id','$name','$episode','$term','$lesson','$lesson_name','$short_desc','$long_desc');" | $msql
	#echo $district$province
	done < $dirName/videoList.csv
fi
