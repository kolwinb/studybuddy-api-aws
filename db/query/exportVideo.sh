#!/bin/bash
#very important
#"('S) you can add double quots (''S)" in csv file, then error will disappear
#use ~ delimeter to export csv


line=$(head -n 1 ../.access)
uname=${line%:*}
upass=${line#*:}


#msql="mysql -N -h192.168.1.120 -u$uname -p$upass studybuddy"
msql="mysql -h172.31.48.100 -u$uname -p$upass studybuddy"
#total answered by given user
#getvideo list
rm video.list
echo "select id,name from video" | $msql >> video.list


#get question image list
#rm question_image.list
#echo "select image from mcq_question where image != ''" | $msql >> question_image.list

#get answer image list
#rm answer_image.list
#echo "select image from mcq_option where image != ''" | $msql >> answer_image.list

