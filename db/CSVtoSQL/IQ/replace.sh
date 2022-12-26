#!/bin/bash

for dirName in $(ls -d */)
do
	echo $dirName
done

printf "Enter Directory Name :"
read dirName

if [ ! $dirName ]; then
	printf "Empty dir not allowed\n"
else
	#raw file " replace with “ for escape bash argument error
	sed -i 's/"/“/g' $dirName/all.csv
	#mysql error
	sed -i "s/'/''/g" $dirName/all.csv
	sed -i 's/~ /~/g' $dirName/all.csv
	sed -i 's/ ~/~/g' $dirName/all.csv

	#defult setting
#	sed -i "s/'/''/g" $dirName/video.csv
#	sed -i "s/'/''/g" $dirName/mcq_question.csv
#	sed -i "s/'/''/g" $dirName/mcq_option.csv

#	sed -i "s/'/./g" $1
#	sed -i 's/"/\,/g'  $1
#	sed -i 's/~ /~/g'  $1
#	sed -i 's/ ~/~/g'  $1
#	sed -i 's/ \,/\,/g'  $1
#	sed -i 's/ ././g'  $1
#	printf "done\n"
fi
