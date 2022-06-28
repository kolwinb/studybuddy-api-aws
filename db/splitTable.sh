#!/bin/bash

line=$(head -n 1 .access)
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

videoId=$(echo "SELECT count(id) FROM video" | $msql)
questionId=$(echo "SELECT count(id) FROM mcq_question" | $msql) 
tqid=1

if [ ! $dirName ]; then
    printf "Empty dir not allowed\n"
    funMain
else
	rm $dirName/video.csv
	rm $dirName/mcq_question.csv
	rm $dirName/mcq_option.csv
	while read line
	do
		fname=$(echo $line | cut -d~ -f2)
		qid=$(echo $line | cut -d~ -f10)
		question=$(echo $line | cut -d~ -f13)
		videoRow=$(echo $line | cut -d~ -f2-8)
		questionRow=$(echo $line | cut -d~ -f11-13)
		optionRow=$(echo $line | cut -d~ -f14-16)
		if [ $fname ] ;then
			((videoId++))
			#echo "Video_id :"$videoId
			echo $videoRow >> $dirName/video.csv
#			((questionId++))
#			echo $videoId"~"$questionRow >> $dirName/mcq_question.csv
		fi

		if [ '$question' ];then
			((questionId++))
			echo $videoId"~"$questionRow >> $dirName/mcq_question.csv
#		else
#			#echo "QuestionVideo_id :"$videoId
#			echo $videoId"~"$questionRow >> $dirName/mcq_question.csv
		fi
	
		

		#question table
		#when you getting argument error replace (“) instead of (")
#		echo "Question id : "$qid
#		if [ qid == tqid ] ;then
##			echo "new question "$qid
#			echo $questionId"~"$optionRow >> $dirName/mcq_option.csv
		if [ "tqid" == "qid" ];then
#			tqid=$qid
			echo "question answer : "$questionId
#			echo $questionId"~"$optionRow >> $dirName/mcq_option.csv
		fi
		done < $dirName/all.csv
fi
}

funMain