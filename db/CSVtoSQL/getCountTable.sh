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
echo " select count(name) as sicenceVideo from video where name like '%science-%'; \
select count(name) as englishVideo from video where name like '%english-%'; \
select count(name) as historyVideo from video where name like '%history-%'; \
select count(name) as ictVideo from video where name like '%ict-%'; \
select count(name) as sinhalaVideo from video where name like '%sinhala-%';" | $msql

echo " select count(mcq_question.id) as scienceMcq from video INNER JOIN mcq_question ON mcq_question.video_id=video.id where video.name like '%science-%'; \
select count(mcq_question.id) as englishMcq from video INNER JOIN mcq_question ON mcq_question.video_id=video.id where video.name like '%english-%'; \
select count(mcq_question.id) as historyMcq from video INNER JOIN mcq_question ON mcq_question.video_id=video.id where video.name like '%history-%'; \
select count(mcq_question.id) as ictMcq from video INNER JOIN mcq_question ON mcq_question.video_id=video.id where video.name like '%ict-%'; \
select count(mcq_question.id) as sinhalaMcq from video INNER JOIN mcq_question ON mcq_question.video_id=video.id where video.name like '%sinhala-%';" | $msql

echo " select count(mcq_option.id) as scienceOption from video INNER JOIN mcq_question ON mcq_question.video_id=video.id INNER JOIN mcq_option ON mcq_option.question_id=mcq_question.id where video.name like '%science-%'; \
select count(mcq_option.id) as englishOption from video INNER JOIN mcq_question ON mcq_question.video_id=video.id  INNER JOIN mcq_option ON mcq_option.question_id=mcq_question.id where video.name like '%english-%'; \
select count(mcq_option.id) as historyOption from video INNER JOIN mcq_question ON mcq_question.video_id=video.id  INNER JOIN mcq_option ON mcq_option.question_id=mcq_question.id where video.name like '%history-%'; \
select count(mcq_option.id) as ictOption from video INNER JOIN mcq_question ON mcq_question.video_id=video.id  INNER JOIN mcq_option ON mcq_option.question_id=mcq_question.id where video.name like '%ict-%'; \
select count(mcq_option.id) as sinhalaOption from video INNER JOIN mcq_question ON mcq_question.video_id=video.id  INNER JOIN mcq_option ON mcq_option.question_id=mcq_question.id where video.name like '%sinhala-%';" | $msql
