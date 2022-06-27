--
-- Table structure for table `district`
--

DROP TABLE IF EXISTS `grade_syllabus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `grade_syllabus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `grade_id` int(5) NOT NULL,
  `syllabus_id` int(5) NOT NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO grade_syllabus(id,grade_id,syllabus_id) VALUES('NULL',6,2016);

DROP TABLE IF EXISTS `grade_subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `grade_subject` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `grade_id` int(5) NOT NULL,
  `subject_id` int(5) NOT NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO grade_subject(id,grade_id,subject_id) VALUES('NULL',6,1),('NULL',6,2),('NULL',6,3),('NULL',6,4),('NULL',6,5),('NULL',6,6),('NULL',6,7),('NULL',6,8);
