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
		fnumber=$(echo $line | cut -d~ -f1)
		questionNo=$(echo $line | cut -d~ -f12)
		videoRow=$(echo $line | cut -d~ -f2-10)
		questionRow=$(echo $line | cut -d~ -f13-15)
		optionRow=$(echo $line | cut -d~ -f16-18)
		if [ $fnumber ] ;then
			((videoId++))
			((questionId++))
			#echo "Video_id :"$videoId
			echo $videoRow >> $dirName/videoList.csv
			echo $videoId"~"$questionRow >> $dirName/mcq_question.csv
			echo $questionId"~"$optionRow >> $dirName/mcq_option.csv
		elif [ ! -z $questionNo ];then
			((questionId++))
			echo $videoId"~"$questionRow >> $dirName/mcq_question.csv
			echo $questionId"~"$optionRow >> $dirName/mcq_option.csv
		elif [ -z $questionNo ];then
			echo $questionId"~"$optionRow >> $dirName/mcq_option.csv
		fi


	done < $dirName/all.csv
fi
}

funMain
