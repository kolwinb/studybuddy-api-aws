mysql> select count(id) from video;
+-----------+
| count(id) |
+-----------+
|       370 |
+-----------+
1 row in set (0.00 sec)

mysql> select count(id) from mcq_question;;
+-----------+
| count(id) |
+-----------+
|      1645 |
+-----------+
1 row in set (0.00 sec)

ERROR:
No query specified

mysql> select count(id) from mcq_option;
+-----------+
| count(id) |
+-----------+
|      6580 |
+-----------+
1 row in set (0.00 sec)
root@video:/home/data/opt/nodejs/studybuddy/db/CSVtoSQL/2022-07-18# cat videoList.csv | wc -l
124
root@video:/home/data/opt/nodejs/studybuddy/db/CSVtoSQL/2022-07-18# cat mcq_question.csv | wc -l 
540
root@video:/home/data/opt/nodejs/studybuddy/db/CSVtoSQL/2022-07-18# cat mcq_option.csv | wc -l
2160

