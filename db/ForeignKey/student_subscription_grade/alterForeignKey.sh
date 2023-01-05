

#!/bin/bash

line=$(head -n 1 ../.access)
uname=${line%:*}
upass=${line#*:}
#echo "select * from user" | mysql -h192.168.1.120 -u$uname -p$upass studybuddy
msql="mysql -h172.31.48.100 -u$uname -p$upass studybuddy"

echo " \
	/* check foreign key */ \
	/* SET FOREIGN_KEY_CHECKS = 1; */ \
	/* don't check foreign key */ \
	SET FOREIGN_KEY_CHECKS = 0; \
	ALTER TABLE student_subscription_grade ADD CONSTRAINT fk_subscriptionUser FOREIGN KEY (user_id) REFERENCES user (id);  \
/*	ALTER TABLE student_subscription_grade ADD CONSTRAINT fk_subscriptionGrade FOREIGN KEY (grade_id) REFERENCES grade (id);  \
	ALTER TABLE student_subscription_grade ADD CONSTRAINT fk_subscriptionPayhere FOREIGN KEY (payhere_id) REFERENCES payhere_notification (id); \
	ALTER TABLE student_subscription_grade ADD CONSTRAINT fk_subscriptionPlan FOREIGN KEY (plan_id) REFERENCES subscription_plan (id); \
*/  	" | $msql

