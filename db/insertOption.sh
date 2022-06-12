#!/bin/bash
#very important
#"('S) you can add double quots (''S)" in csv file, then error will disappear
#use ~ delimeter to export csv


line=$(head -n 1 .access)
uname=${line%:*}
upass=${line#*:}

msql="mysql -N -h192.168.1.120 -u$uname -p$upass studybuddy"

echo "ALTER TABLE mcq_option auto_increment=1" | $msql

while read line
do
col1=$(echo $line|cut -d'~' -f1)
col2=$(echo $line | cut -d'~' -f2)
col3=$(echo $line | cut -d'~' -f3)
col4=$(echo $line | cut -d'~' -f4)


echo "INSERT INTO mcq_option VALUES ('NULL','$col1','$col2','$col3','$col4');" | $msql

#echo $district$province
done < mcq-options.csv