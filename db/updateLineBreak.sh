#!/bin/bash
#very important
#"('S) you can add double quots (''S)" in csv file, then error will disappear
#use ~ delimeter to export csv

oldtxt='පහත වගන්ති තුන සළකා බලන්න.A - මුහුදේ ඇත්තේ දද්‍රව අවස්ථාවේ පවතින ජලය පමණි.B - මුහුදේ ඝන අවස්ථාවේ පවතින ජලය ද ඇත.C - මිරිදිය ජලාශවල බොහෝ විට ඇත්තේ ද්‍රව අවස්ථාවේ පවතින ජලය යි.'
linetxt='පහත වගන්ති තුන සළකා බලන්න. A - මුහුදේ ඇත්තේ දද්‍රව අවස්ථාවේ පවතින ජලය පමණි. B - මුහුදේ ඝන අවස්ථාවේ පවතින ජලය ද ඇත.C - මිරිදිය ජලාශවල බොහෝ විට ඇත්තේ ද්‍රව අවස්ථාවේ පවතින ජලය යි.'

line=$(head -n 1 .access)
uname=${line%:*}
upass=${line#*:}

msql="mysql -N -h192.168.1.120 -u$uname -p$upass studybuddy"
echo "UPDATE mcq_question SET heading='පහත වගන්ති තුන සළකා බලන්න.\nA - මුහුදේ ඇත්තේ දද්‍රව අවස්ථාවේ පවතින ජලය පමණි. \nB - මුහුදේ ඝන අවස්ථාවේ පවතින ජලය ද ඇත.\nC - මිරිදිය ජලාශවල බොහෝ විට ඇත්තේ ද්‍රව අවස්ථාවේ පවතින ජලය යි.' WHERE id=64" | $msql
#echo "UPDATE mcq_question SET question='මේවායින්,' WHERE id=64" | $msql
