

#!/bin/bash

line=$(head -n 1 ../.access)
uname=${line%:*}
upass=${line#*:}
#echo "select * from user" | mysql -h192.168.1.120 -u$uname -p$upass studybuddy
msql="mysql -h172.31.48.100 -u$uname -p$upass studybuddy"

echo " \
	SELECT \
	  TABLE_NAME,COLUMN_NAME,CONSTRAINT_NAME, REFERENCED_TABLE_NAME,REFERENCED_COLUMN_NAME \
	FROM \
	  INFORMATION_SCHEMA.KEY_COLUMN_USAGE \
	WHERE \
/*	  REFERENCED_TABLE_SCHEMA = 'studybuddy' AND */ \
/*	  REFERENCED_TABLE_NAME = 'user' */ \
/*	  REFERENCED_TABLE_NAME = 'grade' */ \
/*	  REFERENCED_TABLE_NAME = 'subscription_plan' */\
	  REFERENCED_TABLE_NAME = 'payhere_notification' \
/* 	  AND REFERENCED_COLUMN_NAME = 'user_id' */ \
  	;" | $msql

