--
-- Table structure for table `district`
--

DROP TABLE IF EXISTS `user_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_profile` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(6) NOT NULL,
  `student_id` int(6) NOT NULL,
  `student_name` varchar(255) DEFAULT NULL,
  `student_grade` varchar(255) DEFAULT  NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

