#!/bin/bash
#very important
#"('S) you can add double quots (''S)" in csv file, then error will disappear
#use ~ delimeter to export csv


line=$(head -n 1 ../../.access)
uname=${line%:*}
upass=${line#*:}


#msql="mysql -N -h192.168.1.120 -u$uname -p$upass studybuddy"
msql="mysql -h192.168.1.120 -u$uname -p$upass studybuddy"
#total answered by given user

echo " \
SET @userId := 1, @gradeId = 6; \
SELECT \
@userId,@gradeId, \
@lastStage := COUNT(subject.id)+1 as stageId, \
CONCAT('Stage ',COUNT(subject.id)+1) as stageName, \
@nameE := 'All subjects' as nameE, \
(CASE WHEN @lastStage = \
		( \
		SELECT DISTINCT stage_id \
		FROM mcq_mining_answer \
		WHERE stage_id = 9 AND user_id = @userId) \
	THEN 'True' \
	ELSE 'False' \
END) as hasCompleted \
FROM subject \
INNER JOIN grade_subject ON grade_subject.subject_id = subject.id \
WHERE grade_subject.grade_id=@gradeId; \
" | $msql

echo " \
SET @userId := 1, @gradeId = 6; \
SELECT \
* \
FROM ( \
SELECT \
@lastStage := COUNT(subject.id)+1  stageId, \
@sageName := CONCAT('Stage ',COUNT(subject.id)+1) as stageName, \
@nameE := 'All subjects' as nameE \
FROM subject \
INNER JOIN grade_subject ON grade_subject.subject_id = subject.id \
WHERE grade_subject.grade_id=@gradeId \
) as stage \
" | $msql
