#!/bin/bash

#add new app permision to group permission list
#eg :
	# view
	# change
	# delete
	# add

line=$(head -n 1 ../.access)
uname=${line%:*}
upass=${line#*:}


#msql="mysql -N -h192.168.1.120 -u$uname -p$upass studybuddy"
msql="mysql -h172.31.48.100 -u$uname -p$upass studybuddy"
#total answered by given user
echo " \
SELECT * from auth_permission; \
		" | $msql

