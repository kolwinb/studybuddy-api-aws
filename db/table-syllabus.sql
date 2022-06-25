--
-- Table structure for table `district`
--

DROP TABLE IF EXISTS `syllabus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `syllabus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `syllabus` varChar(50) NOT NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO syllabus(id,syllabus) VALUES(2015,'Syllabus-2015'),(2016,'Syllabus-2016'),(2017,'Syllabus-2017'),(2018,'Syllabus-2018'),(2019,'Syllabus-2019');
