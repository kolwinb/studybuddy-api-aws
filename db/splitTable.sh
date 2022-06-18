#!/bin/bash

for dirName in $(ls -d */)
do
echo $dirName
done

function funMain() {
printf "Enter Directory Name :"
read dirName

videoId=30
questionId=150

if [ ! $dirName ]; then
    printf "Empty dir not allowed\n"
    funMain
else
	rm $dirName/videoList.csv
	rm $dirName/mcq_question.csv
	rm $dirName/mcq_option.csv
	while read line
	do
		fname=$(echo $line | cut -d~ -f2)
		question=$(echo $line | cut -d~ -f13)
		videoRow=$(echo $line | cut -d~ -f2-8)
		questionRow=$(echo $line | cut -d~ -f11-13)
		optionRow=$(echo $line | cut -d~ -f14-16)
		if [ $fname ] ;then
			((videoId++))
			#echo "Video_id :"$videoId
			echo $videoRow >> $dirName/video.csv
			echo $videoId"~"$questionRow >> $dirName/mcq_question.csv
		else
			#echo "QuestionVideo_id :"$videoId
			echo $videoId"~"$questionRow >> $dirName/mcq_question.csv

		fi

		#question table
		if [ "$question" ] ;then
			((questionId++))
			echo $questionId"~"$optionRow >> $dirName/mcq_option.csv
		else
			echo $questionId"~"$optionRow >> $dirName/mcq_option.csv
		fi

		done < $dirName/all.csv
fi
}

funMain
