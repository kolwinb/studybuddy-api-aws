--
-- Table structure for table `district`
--

DROP TABLE IF EXISTS `subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subject` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subject_english` varChar(100) NOT NULL,
  `subject_sinhala` varChar(100) NOT NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO subject(id,subject_english,subject_sinhala) VALUES('NULL','english','ඉංග්‍රීසි'),('NULL','geography','භූගෝලය'),('NULL','history','ඉතිහාසය'),('NULL','ict','සන්නිවේදන තාක්ෂණය'),('NULL','maths','ගණිතය'),('NULL','science','විද්‍යාව'),('NULL','sinhala','සිංහල'),('NULL','tamil','දෙමළ');
