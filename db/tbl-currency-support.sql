--
-- Table structure for table `district`
--

DROP TABLE IF EXISTS `currency_support`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `currenc_support` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varChar(20) NOT NULL,
  `symbol` varChar(5) NOT NULL,
  `usd_equivalent` float NOT NULL,
  `is_active` tinyint(1) NOT NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

-- status (0 pending, 1 successful, 2 rejected)
-- method (bank transfer,paypal)
-- type (0 deposit,1 withdrawal)
