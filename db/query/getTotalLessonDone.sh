#!/bin/bash
#very important
#"('S) you can add double quots (''S)" in csv file, then error will disappear
#use ~ delimeter to export csv


line=$(head -n 1 ../.access)
uname=${line%:*}
upass=${line#*:}


#msql="mysql -N -h192.168.1.120 -u$uname -p$upass studybuddy"
msql="mysql -h192.168.1.120 -u$uname -p$upass studybuddy"
#total answered by given user
echo "select count(video.id) as totalLesson from student_answer inner join video ON video.id=student_answer.question_id inner join video on video.id=mq.video_id inner join mcq_option on mcq_option.id=student_answer.option_id where student_answer.user_id=6" | $msql
