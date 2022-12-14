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
echo "SELECT \
		SUM( \
			CASE \
				WHEN up.address IS NULL \
					THEN 0 \
					ELSE 20 \
				END + \
			CASE \
				WHEN up.favorite_subject IS NULL \
					THEN 0 \
					ELSE 20 \
				END + \
			CASE \
				WHEN up.ambition IS NULL \
					THEN 0 \
					ELSE 40 \
				END + \
			CASE \
				WHEN up.dateofbirth IS NULL \
					THEN 0 \
					ELSE 20 \
				END + \
			CASE \
				WHEN up.nic IS NULL \
					THEN 0 \
					ELSE 20 \
				END + \
			CASE \
				WHEN up.sociallink IS NULL \
					THEN 0 \
					ELSE 40 \
				END + \
			CASE \
				WHEN up.email IS NULL \
					THEN 0 \
					ELSE 40 \
				END + \
			CASE \
				WHEN up.parent_name IS NULL \
					THEN 0 \
					ELSE 20 \
				END + \
			CASE \
				WHEN up.parent_contact IS NULL \
					THEN 0 \
					ELSE 40 \
				END + \
			CASE \
				WHEN up.parent_email IS NULL \
					THEN 0 \
					ELSE 40 \
				END + \
			CASE \
				WHEN up.school_address IS NULL \
					THEN 0 \
					ELSE 20 \
				END + \
			CASE \
				WHEN up.school_contact IS NULL \
					THEN 0 \
					ELSE 40 \
				END + \
			CASE \
				WHEN up.school_email IS NULL \
					THEN 0 \
					ELSE 40 \
				END + \
			CASE \
				WHEN up.teacher_name IS NULL \
					THEN 0 \
					ELSE 20 \
				END + \
			CASE \
				WHEN up.teacher_contact IS NULL \
					THEN 0 \
					ELSE 40 \
				END + \
			CASE \
				WHEN up.teacher_email IS NULL \
					THEN 0 \
					ELSE 40 \
				END \
		) as totalRewards, \
			(CASE \
				WHEN up.address IS NULL \
					THEN 0 \
					ELSE 20 \
				END) AS address, \
			(CASE \
				WHEN up.favorite_subject IS NULL \
					THEN 0 \
					ELSE 20 \
				END) AS favoiteSubject, \
			(CASE \
				WHEN up.ambition IS NULL \
					THEN 0 \
					ELSE 40 \
				END) AS ambition, \
			(CASE \
				WHEN up.dateofbirth IS NULL \
					THEN 0 \
					ELSE 20 \
				END) AS birthday, \
			(CASE \
				WHEN up.nic IS NULL \
					THEN 0 \
					ELSE 20 \
				END) AS nic, \
			(CASE \
				WHEN up.sociallink IS NULL \
					THEN 0 \
					ELSE 40 \
				END) socialLink, \
			(CASE \
				WHEN up.email IS NULL \
					THEN 0 \
					ELSE 40 \
				END) AS email, \
			(CASE \
				WHEN up.parent_name IS NULL \
					THEN 0 \
					ELSE 20 \
				END) AS parentName, \
			(CASE \
				WHEN up.parent_contact IS NULL \
					THEN 0 \
					ELSE 40 \
				END) AS parentContact, \
			(CASE \
				WHEN up.parent_email IS NULL \
					THEN 0 \
					ELSE 40 \
				END) AS parentEmail, \
			(CASE \
				WHEN up.school_address IS NULL \
					THEN 0 \
					ELSE 20 \
				END) AS schoolAddress, \
			(CASE \
				WHEN up.school_contact IS NULL \
					THEN 0 \
					ELSE 40 \
				END) AS schoolContact, \
			(CASE \
				WHEN up.school_email IS NULL \
					THEN 0 \
					ELSE 40 \
				END) AS schoolEmail, \
			(CASE \
				WHEN up.teacher_name IS NULL \
					THEN 0 \
					ELSE 20 \
				END) AS teacherName, \
			(CASE \
				WHEN up.teacher_contact IS NULL \
					THEN 0 \
					ELSE 40 \
				END) AS teacherContact, \
			(CASE \
				WHEN up.teacher_email IS NULL \
					THEN 0 \
					ELSE 40 \
				END) AS teacherEmail, \
			(CASE WHEN COUNT(sa.id) = 0 \
				THEN 1 \
				ELSE \
					SUM(CASE \
							WHEN TIMESTAMPDIFF(SECOND,sa.started,sa.ended) > 0 AND TIMESTAMPDIFF(SECOND,sa.started,sa.ended) <= 15 \
								THEN 100 \
								ELSE 0 \
							END + \
							CASE \
							WHEN TIMESTAMPDIFF(SECOND,sa.started,sa.ended) > 15 AND TIMESTAMPDIFF(SECOND,sa.started,sa.ended) <= 30 \
								THEN 75 \
								ELSE 0 \
							END + \
							CASE \
							WHEN TIMESTAMPDIFF(SECOND,sa.started,sa.ended) > 30 AND TIMESTAMPDIFF(SECOND,sa.started,sa.ended) <= 45 \
								THEN 50 \
								ELSE 0 \
							END + \
							CASE \
							WHEN TIMESTAMPDIFF(SECOND,sa.started,sa.ended) > 45 AND TIMESTAMPDIFF(SECOND,sa.started,sa.ended) <= 60 \
								THEN 25 \
								ELSE 0 \
							END  \
							) \
			END) as totalMcqRewards \
		FROM student_answer as sa \
		INNER JOIN mcq_option ON mcq_option.id=sa.option_id \
		WHERE sa.user_id=1 AND	mo.state=1;" | $msql
	
		#FROM user_profile as up \
		#LEFT JOIN student_answer as sa ON sa.user_id=up.user_id \
		#LEFT JOIN mcq_option as mo ON mo.id=sa.option_id \
		#WHERE up.user_id=1 AND mo.state=1" | $msql


echo "SELECT \
			(CASE WHEN COUNT(sa.id) = 0 \
				THEN 1 \
				ELSE \
					SUM(CASE \
							WHEN TIMESTAMPDIFF(SECOND,sa.started,sa.ended) > 0 AND TIMESTAMPDIFF(SECOND,sa.started,sa.ended) <= 15 \
								THEN 100 \
								ELSE 0 \
							END + \
							CASE \
							WHEN TIMESTAMPDIFF(SECOND,sa.started,sa.ended) > 15 AND TIMESTAMPDIFF(SECOND,sa.started,sa.ended) <= 30 \
								THEN 75 \
								ELSE 0 \
							END + \
							CASE \
							WHEN TIMESTAMPDIFF(SECOND,sa.started,sa.ended) > 30 AND TIMESTAMPDIFF(SECOND,sa.started,sa.ended) <= 45 \
								THEN 50 \
								ELSE 0 \
							END + \
							CASE \
							WHEN TIMESTAMPDIFF(SECOND,sa.started,sa.ended) > 45 AND TIMESTAMPDIFF(SECOND,sa.started,sa.ended) <= 60 \
								THEN 25 \
								ELSE 0 \
							END  \
							) \
			END) as totalMcqRewards \
		FROM student_answer as sa \
		INNER JOIN mcq_option as mo ON mo.id=sa.option_id \
		WHERE sa.user_id=1 AND	mo.state=1;" | $msql
