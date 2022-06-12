#!/bin/bash

if [ ! $1 ]; then
	printf "file name needed\n"
else
	sed -i "s/'/./g" $1
	sed -i 's/"/\,/g'  $1
	sed -i 's/~ /~/g'  $1
	sed -i 's/ ~/~/g'  $1
#	sed -i 's/ \,/\,/g'  $1
#	sed -i 's/ ././g'  $1
#	printf "done\n"
fi
