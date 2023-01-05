

#!/bin/bash

line=$(head -n 1 ../.access)
uname=${line%:*}
upass=${line#*:}
#echo "select * from user" | mysql -h192.168.1.120 -u$uname -p$upass studybuddy
msql="mysql -h172.31.48.100 -u$uname -p$upass studybuddy"

#foreign key CONTSTRAINT name required
echo " \
	ALTER TABLE student_subscription_grade DROP FOREIGN KEY fk_subscriptionPlan \
  	;" | $msql

