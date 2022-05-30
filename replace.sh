#!/bin/bash
grep -rli '/opt' ./ | xargs sed -i 's/\/opt\//\/media\/data\/opt\//g'
#grep -rli '/opt' ./
#find . -type f| xargs sed -i 's/.\/lib\/crypto/..\/lib\/crypto/g'
