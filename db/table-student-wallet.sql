--
-- Table structure for table `district`
--

DROP TABLE IF EXISTS `student_wallet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student_wallet` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `remarks` varChar(100) NOT NULL,
  `amount` float NOT NULL,
  `status` int(1) NOT NULL,
  'datetime' datetime NOT NULL
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO subject(id,subject) VALUES('NULL','english'),('NULL','geography'),('NULL','history'),('NULL','ict'),('NULL','maths'),('NULL','science'),('NULL','sinhala'),('NULL','tamil');


-- status (0 pending, 1 successful, 2 rejected)
-- method (bank transfer,paypal)

