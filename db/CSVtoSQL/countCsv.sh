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
	for csvFile in $dirName/*.csv
	do
		printf $csvFile": "
		cat $csvFile | wc -l
	done
fi
