#!/bin/bash
#apt-get install libreoffice-java-common

#su kolwin

for dirName in $(ls -d */)
do
echo $dirName
done

function funMain() {
printf "Enter Directory Name :"
read dirName

if [ ! $dirName ]; then
	printf "Empty dir not allowed\n"
	funMain
else
	for odsName in $dirName"/"*.ods
	do
		fname=${odsName%.*}
		rm $fname.csv
		printf "file : $fname\n"
		#convert ods to csvn
#		libreoffice --headless --convert-to csv --outdir $dirName $odsName
		#semicolon
		#filteroption (seperator(ascii),demilmiter(ascii),char set,number of first line,
		#comma(,) = ASCII(44) / (~)=126
		#text delimiter(") = ASCII(34)
		#Unicode (UTF-8) = ASCII(76)
		#number of first line = 1
		#utf conversion
		libreoffice --headless --convert-to csv:"Text - txt - csv (StarCalc)":"126,,76,1,,1031,true,true" --outdir $dirName $odsName
	done
fi
#		cat  $dirName"/*.csv" >> all.csv
#	mv $fname.csv all.csv
}

funMain

:'

Example Filter Options String	Field Separator (1)	Text Delimiter (2)	Character Set (3)	Number of First Line (4)	Cell Format Codes for the four Columns (5)
Column	Code
Token	44	34	0	1	

1	YY/MM/DD = 5
2   Standard = 1
3   Standard = 1
4   Standard = 1

1/5/2/1/3/1/4/1

Format Code	Meaning
1	Standard
2	Text
3	MM/DD/YY
4	DD/MM/YY
5	YY/MM/DD
6	-
7	-
8	-
9	ignore field (do not import)
10	US-English
'

