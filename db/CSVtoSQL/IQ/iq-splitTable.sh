#!/bin/bash

line=$(head -n 1 ../.access)
uname=${line%:*}
upass=${line#*:}

for dirName in $(ls -d */)
do
echo $dirName
done

function funMain() {
printf "Enter Directory Name :"
read dirName

msql="mysql -N -h192.168.1.120 -u$uname -p$upass studybuddy"

questionId=$(echo "SELECT COUNT(id) FROM iq_question" | $msql) 

if [ ! $dirName ]; then
    printf "Empty dir not allowed\n"
    funMain
else
	rm $dirName/iq_question.csv
	rm $dirName/iq_option.csv
	while read line
	do
		fnumber=$(echo $line | cut -d~ -f1)
		questionRow=$(echo $line | cut -d~ -f1-2)
		optionRow=$(echo $line | cut -d~ -f3-4)

		if [ $fnumber ] ;then
			((questionId++)) 
			echo $questionRow >> $dirName/iq_question.csv
			echo $questionId"~"$optionRow >> $dirName/iq_option.csv
		elif [ -z $fnumber ];then
			echo $questionId"~"$optionRow >> $dirName/iq_option.csv
		fi
	done < $dirName/all.csv
fi
}

funMain
