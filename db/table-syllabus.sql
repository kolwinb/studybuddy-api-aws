--
-- Table structure for table `district`
--

DROP TABLE IF EXISTS `syllabus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `syllabus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `syllabus_english` varChar(50) NOT NULL,
  `syllabus_sinhala` varChar(50) NOT NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO syllabus(id,syllabus_english,syllabus_sinhala) VALUES(2015,'Syllabus-2015','2015 විෂය නිර්දේශය'),(2016,'Syllabus-2016','2016 විෂය නිර්දේශය'),(2017,'Syllabus-2017','2017 විෂය නිර්දේශය'),(2018,'Syllabus-2018','2018 විෂය නිර්දේශය'),(2019,'Syllabus-2019','2019 විෂය නිර්දේශය');
