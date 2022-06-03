#!/bin/bash
#very important
#"('S) you can add double quots (''S)" in csv file, then error will disappear
#use ~ delimeter to export csv

while read line
do
district=$(echo $line|cut -d'~' -f1)
district=${district#*.}
name=$(echo $line | cut -d'~' -f2)
address=$(echo $line | cut -d'~' -f3)
year="Null"
tel=$(echo $line | cut -d'~' -f5)
email="Null"

cline=$(head -n 1 .access)
uname=${cline%:*}
upass=${cline#*:}

msql="mysql -N -h192.168.1.120 -u$uname -p$upass studybuddy"



schoolid=$(echo "SELECT id FROM school WHERE name like '$name' and address like '$address';" | $msql)
districtid=$(echo "SELECT id FROM district WHERE name like '$district';" | $msql)
#echo "$district : $districtid"
if [ -z $districtid ];then
	echo "disctrict id not found : $district" >> piriven-district.log
fi

if [ -z $schoolid ];then
#	echo "inserted"
	echo "ALTER TABLE school AUTO_INCREMENT = 1" | $msql
	echo "INSERT INTO school VALUES ('NULL','$districtid','$name','$address','$year','$tel','$email');" | $msql
else
#	echo "school duplicate detected"
	echo $line >> piriven_duplicate.log
fi

done < piriven-list.csv
