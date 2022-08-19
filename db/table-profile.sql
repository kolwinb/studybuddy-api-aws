--
-- Table structure for table `district`
--

DROP TABLE IF EXISTS `user_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_profile` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(6) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `grade` varchar(255) DEFAULT  NULL,
  `avatar_id` int(11) DEFAULT  NULL,
  `address` varChar(255) DEFAULT NULL,
  `favorite_subject` varChar(255) DEFAULT NULL,
  `dateofbirth` date DEFAULT NULL,
  `nic` varChar(255) DEFAULT NULL,
  `sociallink` varChar(255) DEFAULT NULL,
  `email` varChar(255) DEFAULT NULL,
  `parent_name` varChar(255) DEFAULT NULL,
  `parent_contact` int(11) DEFAULT NULL,
  `parent_email` varChar(255) DEFAULT NULL,
  `school_address` varChar(255) DEFAULT NULL,
  `school_contact` int(11) DEFAULT NULL,
  `school_email` varChar(255) DEFAULT NULL,
  `teacher_name` varChar(255) DEFAULT NULL,
  `teacher_contact` int(11) DEFAULT NULL,
  `teacher_email` varChar(255) DEFAULT NULL,
  `status` ENUM('online','offline'),
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;


