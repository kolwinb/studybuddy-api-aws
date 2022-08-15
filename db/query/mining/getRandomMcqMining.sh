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

#get random value from each subject to get single video + 5 question
echo " \
	SELECT \
		(CASE WHEN video.subject_id = 1 \
			THEN ( \
					FLOOR(RAND()*((SELECT vid.id FROM video as vid WHERE vid.subject_id = 3 GROUP BY vid.subject_id) - video.id)+video.id) \
				) \
			ELSE ( \
				CASE WHEN video.subject_id = 3 \
					THEN ( \
							FLOOR(RAND()*((SELECT vid.id FROM video as vid WHERE vid.subject_id = 4 GROUP BY vid.subject_id) - video.id)+video.id) \
						) \
					ELSE \
						(CASE WHEN video.subject_id = 4 \
							THEN ( \
									FLOOR(RAND()*((SELECT vid.id FROM video as vid WHERE vid.subject_id = 6 GROUP BY vid.subject_id) - video.id)+video.id) \
								) \
							ELSE \
								(CASE WHEN video.subject_id = 6 \
									THEN ( \
										FLOOR(RAND()*((SELECT vid.id FROM video as vid WHERE vid.subject_id = 7 GROUP BY vid.subject_id) - video.id)+video.id) \
										) \
									ELSE \
										(CASE WHEN video.subject_id = 7 \
											THEN ( \
												FLOOR(RAND()*((SELECT vid.id FROM video as vid WHERE vid.subject_id = 2 GROUP BY vid.subject_id) - video.id)+video.id) \
												) \
											ELSE \
												(CASE WHEN video.subject_id = 2 \
													THEN ( \
														FLOOR(RAND()*((SELECT vid.id FROM video as vid WHERE vid.subject_id = 5 GROUP BY vid.subject_id) - video.id)+video.id) \
														) \
													ELSE \
														(CASE WHEN video.subject_id = 5 \
															THEN ( \
																FLOOR(RAND()*(479 - video.id)+video.id) \
																) \
		 												END) \
		 										END) \
		 								END) \
		 						END) \
		 				END) \
		 		END) \
		 END) AS lessonId, \
		video.id, \
		video.subject_id \
	FROM (SELECT video.id as id,video.subject_id as subject_id FROM video GROUP BY video.subject_id) as video \
	;" | $msql
	
	#get random value from each subject to get single video + 5 question
echo " \
	SELECT \
		(CASE WHEN video.subject_id = 1 \
			THEN ( \
					FLOOR(RAND()*(91 - video.id)+video.id) \
				) \
			ELSE ( \
				CASE WHEN video.subject_id = 3 \
					THEN ( \
							FLOOR(RAND()*(121 - video.id)+video.id) \
						) \
					ELSE \
						(CASE WHEN video.subject_id = 4 \
							THEN ( \
									FLOOR(RAND()*(151 - video.id)+video.id) \
								) \
							ELSE \
								(CASE WHEN video.subject_id = 6 \
									THEN ( \
										FLOOR(RAND()*(239 - video.id)+video.id) \
										) \
									ELSE \
										(CASE WHEN video.subject_id = 7 \
											THEN ( \
												FLOOR(RAND()*(371 - video.id)+video.id) \
												) \
											ELSE \
												(CASE WHEN video.subject_id = 2 \
													THEN ( \
														FLOOR(RAND()*(394 - video.id)+video.id) \
														) \
													ELSE \
														(CASE WHEN video.subject_id = 5 \
															THEN ( \
																FLOOR(RAND()*(479 - video.id)+video.id) \
																) \
		 												END) \
		 										END) \
		 								END) \
		 						END) \
		 				END) \
		 		END) \
		 END) AS lessonId, \
		video.id, \
		video.subject_id \
	FROM (SELECT video.id as id,video.subject_id as subject_id FROM video GROUP BY video.subject_id) as video \
	;" | $msql
