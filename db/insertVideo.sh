#!/bin/bash
#very important
#"('S) you can add double quots (''S)" in csv file, then error will disappear
#use ~ delimeter to export csv


line=$(head -n 1 .access)
uname=${line%:*}
upass=${line#*:}

msql="mysql -N -h192.168.1.120 -u$uname -p$upass studybuddy"


while read line
do
#unicode(.) = english (')
#unicode(,) = english (")
#insert escap with backslash
#line=$(echo $line | sed 's/\,/\\\,/g')
#line=$(echo $line | sed  "s/\./\\\./g")
#echo $line
col1=$(echo $line|cut -d'~' -f1)
col2=$(echo $line | cut -d'~' -f2)
col3=$(echo $line | cut -d'~' -f3)
col4=$(echo $line | cut -d'~' -f4)
col5=$(echo $line | cut -d'~' -f5)
col6=$(echo $line | cut -d'~' -f6)
col7=$(echo $line | cut -d'~' -f7)



echo "ALTER TABLE video auto_increment=1" | $msql
echo "INSERT INTO video VALUES ('NULL','$col1','$col2','$col3','$col4','$col5','$col6','$col7');" | $msql

#echo $district$province
done < video.csv
