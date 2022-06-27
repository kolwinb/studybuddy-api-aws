--
-- Table structure for table `district`
--

DROP TABLE IF EXISTS `grade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `grade` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `grade_english` varChar(100) NOT NULL,
  `grade_sinhala` varChar(100) NOT NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO grade(id,grade_english,grade_sinhala) VALUES(6,'grade-06','6 වන ශ්‍රේණිය'),(7,'grade-07','7 වන ශ්‍රේණිය'),(8,'grade-08','8 වන ශ්‍රේණිය'),(9,'grade-09','9 වන ශ්‍රේණිය'),(10,'grade-10','10 වන ශ්‍රේණිය'),(11,'grade-11','11 වන ශ්‍රේණිය'),(12,'grade-12','12 වන ශ්‍රේණිය'),(13,'grade-13','13 වන ශ්‍රේණිය');
