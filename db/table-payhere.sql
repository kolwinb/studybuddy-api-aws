
DROP TABLE IF EXISTS `payhere_notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payhere_notification` (
  `id` int(15) NOT NULL AUTO_INCREMENT,
  `order_id` varchar(255) NOT NULL,
  `payment_id` varchar(255) NOT NULL,
  `payhere_amount` varchar(100) NOT NULL,
  `payhere_currency` varchar(255) NOT NULL,
  `status_code`	varchar(255) NOT NULL,
  `custom_1`	varchar(255) DEFAULT NULL,
  `custom_2`	varchar(255) DEFAULT  NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

