#!/bin/bash
#very important
#"('S) you can add double quots (''S)" in csv file, then error will disappear
#use ~ delimeter to export csv

while read line
do
district=$(echo $line|cut -d'~' -f2)
name=$(echo $line | cut -d'~' -f3)
address=$(echo $line | cut -d'~' -f4)
#replace comma with \ (\,)
#if [ "$address" == "$line" ];then
#	address=$(echo $line | cut -d',' -f5)
#	address=$(echo $address | sed 's/,/\\,/g')
#	echo "address with single quots :"$address
#else
#echo "address with double quots :"$address
#fi
year=$(echo $line | cut -d'~' -f5)
tel=$(echo $line | cut -d'~' -f6)
email=$(echo $line | cut -d'~' -f7)

line=$(head -n 1 .access)
uname=${line%:*}
upass=${line#*:}

msql="mysql -N -h192.168.1.120 -u$uname -p$upass studybuddy"



schoolid=$(echo "SELECT id FROM school WHERE name like '$name' and address like '$address';" | $msql)
districtid=$(echo "SELECT id FROM district WHERE name like '$district';" | $msql)
#echo "$district : $districtid"
if [ -z $districtid ];then
	echo "disctrict id not found : $district" >> school-district.log
fi

if [ -z $schoolid ];then
#	echo "inserted"
#	echo "ALTER TABLE school AUTO_INCREMENT = 1" | $msql
	echo "INSERT INTO school VALUES ('NULL','$districtid','$name','$address','$year','$tel','$email');" | $msql
else
#	echo "school duplicate detected"
	echo $line >> school_duplicate.csv
fi

#echo $district$province
done < school-list.csv
