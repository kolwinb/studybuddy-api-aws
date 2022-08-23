#!/bin/bash

line=$(head -n 1 .access)
uname=${line%:*}
upass=${line#*:}
#echo "select * from user" | mysql -h192.168.1.120 -u$uname -p$upass studybuddy
msql="mysql -h192.168.1.120 -u$uname -p$upass studybuddy"
echo " \
	ALTER TABLE user ADD UNIQUE unique_user (phone,uniqid,referral_code); \
	ALTER TABLE user_profile ADD UNIQUE unique_user_profile (user_id); \
	ALTER TABLE user_profile ADD INDEX index_user_profile (school_id,grade_id); \
	ALTER TABLE battle_pool ADD INDEX index_battle_pool (user1id,user2id); \
	ALTER TABLE battle_answer ADD INDEX index_battle_answer (user_id,battle_id); \
	ALTER TABLE coin_pool ADD INDEX index_coin_pool (user_id,battle_id); \
	ALTER TABLE video ADD INDEX index_video (grade,syllabus,subject_id,lesson,name,episode,term,lesson_name); \
	ALTER TABLE user_passwdrecovery ADD INDEX index_passwordrecovery (mobile); \
	ALTER TABLE user_affiliate ADD INDEX index_affiliate (referrer_id,referee_id); \
	ALTER TABLE student_subscription_grade ADD INDEX index_student_subscription (user_id); \
	ALTER TABLE student_favorite ADD INDEX index_favorite (user_id,video_id); \
	ALTER TABLE student_answer ADD INDEX index_student_answer (user_id); \
	ALTER TABLE sms_verification ADD INDEX index_sms_veri (mobile); \
	ALTER TABLE school ADD INDEX index_school (district_id); \
	ALTER TABLE mcq_question ADD INDEX index_question (video_id); \
	ALTER TABLE mcq_option ADD INDEX index_option (question_id); \
	ALTER TABLE mcq_mining_answer ADD INDEX index_mcq_mining (user_id,stage_id,question_id,option_id); \
	;" | $msql

