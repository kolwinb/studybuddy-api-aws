--
-- Table structure for table `district`
--

DROP TABLE IF EXISTS `user_affiliate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_affiliate` (
  `id` int(15) NOT NULL AUTO_INCREMENT,
  `referrer_id` int(15) NOT NULL,
  `referred_id` int(15) NOT NULL,
  `created` datetime NOT NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

