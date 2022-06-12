--
-- Table structure for table `district`
--

DROP TABLE IF EXISTS `sms_verification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sms_verification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `otp` int(6) NOT NULL,
  `mobile` int(15) NOT NULL,
  `created` datetime(6) NOT NULL,
   `is_verify` tinyint(1)  NOT NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

