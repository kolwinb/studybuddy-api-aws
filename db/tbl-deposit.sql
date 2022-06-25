--
-- Table structure for table `district`
--

DROP TABLE IF EXISTS `deposit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `deposit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `transaction_code` varChar(50) NOT NULL,
  `deposit_amount` float NOT NULL,
  `currency_id` int(10) NOT NULL,
  `datetime` datetime NOT NULL,
  'payment_gateway_id` int(11) NOT NULL,
  `remarks` varChar(100) DEFAULT NULL,
  `status` int(1) NOT NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

-- status (0 pending, 1 successful, 2 rejected)
-- method (bank transfer,paypal)
