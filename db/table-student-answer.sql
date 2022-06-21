--
-- Table structure for table `district`
--

DROP TABLE IF EXISTS `student_answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student_answer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(6) NOT NULL,
  `option_id` varchar(255) NOT NULL,
  `started` datetime(6) DEFAULT  NULL,
  `ended` datetime(6) DEFAULT  NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

