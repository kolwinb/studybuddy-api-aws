
--
-- Table structure for table `district`
--

DROP TABLE IF EXISTS `district`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `district` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `district_english` varchar(50) NOT NULL,
  `district_sinhala` varchar(50) NOT NULL,
  `province_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `province_id` (`province_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--  CONSTRAINT `district_ibfk_1` FOREIGN KEY (`province_id`) REFERENCES `province` (`id`)

--
-- Dumping data for table `district`
--

LOCK TABLES `district` WRITE;
/*!40000 ALTER TABLE `district` DISABLE KEYS */;
INSERT INTO `district` VALUES (1,'Colombo','කොළඹ',3),(2,'Gampaha','ගම්පහ',3),(3,'Kalutara','කළුතර',3),(4,'Galle','ගාල්ල',6),(5,'Matara','මාතර',6),(6,'Hambantota','හම්බන්තොට',6),(7,'Kandy','මහනුවර',4),(8,'Matale','මාතලේ',4),(9,'Nuwara Eliya','නුවරඑළිය',4),(10,'Puttalam','පුත්තලම',8),(11,'Kurunegala','කුරුණෑගල',8),(12,'Jaffna','යාපනය',7),(13,'Killinochchi','කිලිනොච්චි',7),(14,'Mannar','මන්නාරම',7),(15,'Mullaitivu','මුලතිව්',7),(16,'Vavuniya','වවුනියාව',7),(17,'Ampara','අම්පාර',5),(18,'Batticaloa','මඩකලපුව',5),(19,'Trincomalee','ර්‍ත්‍රකුණාමලය',5),(20,'Kegalle','කෑගල්ල',2),(21,'Ratnapura','රත්නපුර',2),(22,'Anuradhapura','අනුරාධපුර',1),(23,'Polonnaruwa','පොළොන්නරුව',1),(24,'Badulla','බදුල්ල',9),(25,'Monaragala','මොනරාගල',9);
/*!40000 ALTER TABLE `district` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `province`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `province` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `province_english` varchar(100) NOT NULL,
  `province_sinhala` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;


LOCK TABLES `province` WRITE;
/*!40000 ALTER TABLE `province` DISABLE KEYS */;
INSERT INTO `province` VALUES (1,'North Central Province','උතුරු මැද පළාත'),(2,'Sabaragamuwa Province','සබරගමුව පළාත'),(3,'Western Province','බස්නාහිර පළාත'),(4,'Central Province','මධ්යම පළාත'),(5,'Eastern province','නැගෙනහිර පළාත'),(6,'Southern province','දකුණු පළාත'),(7,'Northern province','උතුරු පළාත'),(8,'North Western Province','වයඹ පළාත'),(9,'Uva Province','ඌව පළාත');
/*!40000 ALTER TABLE `province` ENABLE KEYS */;
UNLOCK TABLES;


