--
-- Table structure for table `district`
--

DROP TABLE IF EXISTS `user_passwdrecovery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_passwdrecovery` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` int(6) NOT NULL,
  `mobile` int(15) NOT NULL,
  `created` datetime NOT NULL,
   `is_verify` tinyint(1)  NOT NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

