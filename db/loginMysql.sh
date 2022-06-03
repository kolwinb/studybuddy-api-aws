#!/bin/bash

line=$(head -n 1 .access)
uname=${line%:*}
upass=${line#*:}
mysql -h192.168.1.120 -u$uname -p$upass studybuddy
