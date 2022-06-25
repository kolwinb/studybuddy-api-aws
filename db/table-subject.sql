--
-- Table structure for table `district`
--

DROP TABLE IF EXISTS `subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subject` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subject` varChar(100) NOT NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO subject(id,subject) VALUES('NULL','english'),('NULL','geography'),('NULL','history'),('NULL','ict'),('NULL','maths'),('NULL','science'),('NULL','sinhala'),('NULL','tamil');
