
DROP TABLE IF EXISTS `subscription_plan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subscription_plan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varChar(100) NOT NULL,
  `detail` varChar(255) DEFAULT NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO subscription_plan(id,name,detail) VALUES(1,'free','Unlimited'),(2,'trial','7 Days / Free'),(3,'basic','1 Month / RS 500'),(4,'standard','3 Months / Rs 1500'),(5,'premium','12 Months / Rs 6000');
