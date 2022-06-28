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

echo "SELECT video.grade as grade, 
	CONCAT(video.term,' වන වාරය') as termS, \
	video.episode as episode, \
	video.lesson_name as heading, \
	video.short_desc as shortDesc, \
	video.lesson as lesson, \
	subject.subject_sinhala as subjectS, \
	subject.subject_english as subjectE, \
	video.id as id, \
	syllabus.syllabus_english as syllabusE, \
	syllabus.syllabus_sinhala as syllabusS, \
	student_favorite.status as favorite, \
	video.name as fileName \
	FROM video \
	RIGHT OUTER JOIN student_favorite ON student_favorite.video_id=video.id \
	INNER JOIN subject ON subject.id=video.subject_id \
	INNER JOIN syllabus ON syllabus.id=video.syllabus \
	WHERE (video.grade=6 AND video.subject_id=6) ;" | $msql
#	WHERE video.grade=6 AND video.subject_id=6;" | $msql

#	WHERE (video.grade=6 AND video.subject_id=6)  AND (student_favorite.video_id=10 OR student_like.video_id=10);" | $msql
#	WHERE video.grade=6 AND video.subject_id=6;" | $msql

#	WHERE (video.grade=6 AND video.subject_id=6)  AND (student_favorite.video_id=10 OR student_like.video_id=10);" | $msql


#	student_favorite.status as favorite, \
#	student_like.status as like, \
#	INNER JOIN student_favorite ON student_favorite.video_id=video.id \
#	INNER JOIN student_like ON student_like.video_id=video.id \
