#!/bin/bash

line=$(head -n 1 .access)
uname=${line%:*}
upass=${line#*:}
#echo "select * from user" | mysql -h192.168.1.120 -u$uname -p$upass studybuddy
msql="mysql -h192.168.1.120 -u$uname -p$upass studybuddy"

echo " \
	 CREATE UNIQUE unique_user ON user  (phone,uniqid,referral_code); \
	 CREATE UNIQUE unique_user_profile ON user_profile  (user_id); \
	 CREATE INDEX index_user_profile ON user_profile (school_id,grade_id); \
	 CREATE INDEX index_battle_pool ON battle_pool (user1id,user2id); \
	 CREATE INDEX index_battle_answer ON battle_answer  (user_id,battle_id); \
	 CREATE INDEX index_coin_pool ON coin_pool (user_id,battle_id); \
	 CREATE INDEX index_video ON video  (grade,syllabus,subject_id,lesson,name,episode,term,lesson_name); \
	 CREATE INDEX index_passwordrecovery ON user_passwdrecovery (mobile); \
	 CREATE INDEX index_affiliate user_affiliate (referrer_id,referee_id); \
	 CREATE INDEX index_user_subscription ON user_subscription (user_id); \
	 CREATE INDEX index_favorite ON student_favorite (user_id,video_id); \
	 CREATE INDEX index_student_answer ON student_answer (user_id); \
	 CREATE INDEX index_sms_veri ON sms_verification (mobile); \
	 CREATE INDEX index_school ON school (district_id); \
	 CREATE INDEX index_question ON mcq_question (video_id); \
	 CREATE INDEX index_option mcq_option (question_id); \
	 CREATE INDEX index_mcq_mining ON mcq_mining_answer (user_id,stage_id,question_id,option_id); \
	;" | $msql

