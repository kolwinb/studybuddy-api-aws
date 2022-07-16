
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
#echo " select video.name as subjectName, mcq_question.video_id as videoId, mcq_question.id as questionId,mcq_option.id as optionId,mcq_option.state as optionState  from mcq_question INNER JOIN mcq_option ON mcq_option.question_id = mcq_question.id INNER JOIN video ON video.id = mcq_question.video_id where video.name like 'ict%' limit 20;" | $msql
echo " select video.name as subjectName, mcq_question.video_id as videoId, mcq_question.id as questionId,mcq_option.id as optionId,mcq_option.state as optionState  from mcq_question INNER JOIN mcq_option ON mcq_option.question_id = mcq_question.id INNER JOIN video ON video.id = mcq_question.video_id where video.id=360;" | $msql
