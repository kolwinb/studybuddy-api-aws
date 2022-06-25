--
-- Table structure for table `district`
--

DROP TABLE IF EXISTS `transaction_setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transaction_setting` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usd_current_value` float NOT NULL,
  `withdrawal_charge` float NOT NULL,
  `daily_withdrawal_limit` float NOT NULL,
  `monthly_withdrawal_limit` float NOT NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

-- status (0 pending, 1 successful, 2 rejected)
-- method (bank transfer,paypal)
-- type (0 deposit,1 withdrawal)
