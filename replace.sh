#!/bin/bash

#01
#find ./routes -type f| xargs sed -i 's/\/media\/data\/opt\/nodejs/../g'
#02 /routes/lib
#find ./routes/lib -type f| xargs sed -i 's/..\/lib/..\/..\/lib/'
#03 /routes/v1
#find ./routes/v1 -type f| xargs sed -i 's/..\/lib/..\/..\/lib/'
#find ./routes/v1 -type f| xargs sed -i 's/..\/..\/lib/..\/lib/'
#grep -rli '/opt' ./ | xargs sed -i 's/\/opt\//\/media\/data\/opt\//g'
#grep -rli '/opt' ./
#find . -type f| xargs sed -i 's/.\/lib\/crypto/..\/lib\/crypto/g'
