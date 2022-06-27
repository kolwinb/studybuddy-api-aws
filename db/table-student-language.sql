--
-- Table structure for table `district`
--

DROP TABLE IF EXISTS `student_language`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student_language` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `language` varChar(50) NOT NULL,
  `code` varChar(50) NOT NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO student_language(id,language,code) VALUES('NULL','english','en'),('NULL','sinhala','si'),('NULL','tamil','ta');
