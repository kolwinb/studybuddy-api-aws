--
-- Table structure for table `district`
--

DROP TABLE IF EXISTS `grade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `grade` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `grade` varChar(100) NOT NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO grade(id,grade) VALUES(6,'grade-06'),(7,'grade-07'),(8,'grade-08'),(9,'grade-09'),(10,'grade-10'),(11,'grade-11'),(12,'grade-12'),(13,'grade-13');
