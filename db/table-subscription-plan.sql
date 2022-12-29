
DROP TABLE IF EXISTS `subscription_plan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subscription_plan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varChar(100) NOT NULL,
  `detail` varChar(255) DEFAULT NULL,
  `price` int(11) NOT NULL,
  `gateway_id` int(11) NOT NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO subscription_plan(id,name,detail,price,gateway_id) VALUES(0,'free','Unlimited',0,0),(0,'trial','7 Days / Free',0,0),(0,'basic','1 Month / RS 500',500,1),(0,'premium','12 Months / Rs 6000',6000,1),(0,'daily25','Daily / Rs 25',25,3),(0,'Monthly690','Monthly / Rs 690',690,3),(0,'daily25','Daily / Rs 25',25,4),(0,'Monthly690','Monthly / Rs 690',690,4);
