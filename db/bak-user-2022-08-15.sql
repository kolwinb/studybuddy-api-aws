DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(128) DEFAULT NULL,
  `username` varchar(128) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `date_joined` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `uniqid` varchar(255) DEFAULT NULL,
  `is_active` int(11) DEFAULT NULL,
  `id` int(15) NOT NULL AUTO_INCREMENT,
  `role_id` int(11) DEFAULT NULL,
  `referral_code` varchar(8) NOT NULL,
  `device_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('','t4XS9KtWCK80OFZ/a+8RcVC2SwboJ2enz8hurBh5uu/PmOZ6uwYLm73Q+sbCP/cMXlwYpseqWZflvvCBVwZwgA==','','0775342842','2022-08-07 10:22:55','2022-08-15 09:31:10','424o0lnpwl5oudqjl',1,1,4,'W2A2T6L3','123123123'),('','qmRYNpFt8UzOmC7p/xx20f2kJD/K5nZN+Qs7CCSrwFcPSs45Zq8dlOKvrZoyiVDxbyRq7pckfu8fRc7K1UshWg==','','0773033251','2022-07-19 22:34:44','2022-08-15 14:18:31','424o0lemql5sfeke2',1,6,4,'O8X8L5X6','C946E220-A815-44D1-9CEC-96518507F84C'),('','dldV4zf58KRkNQPTNELti+fEh+TeI7WTz67YupQDpMXtsGfEpPlEHk4nQH03xRNlt6zVPK1JlfPnkS7E7jFo/A==','','0705710882','2022-08-06 13:55:52','2022-08-06 13:55:52','424o0lootl6hmsmcf',1,7,2,'L0D4K3L3','9257CEA5-668C-4BEA-ACC2-C0A9CF5CA42D'),('','uh2BWpSdpEVxjfeOOOrFaYjWYpOEL3lVmW71Ae1f88CbtruvSbXJ/23atNUT6lQATJpZoeqf1XMAp/7990ct7w==','','0718927604','2022-08-08 15:14:22','2022-08-13 13:57:15','424o0l8g1l6kkh9ub',1,11,3,'F6Y5F6G6','9257CEA5-668C-4BEA-ACC2-C0A9CF5CA42D'),('','NaH7gy1Qk72B1WEpyahibsLu4x++tVa3JLo64KpYTppsV43+7CDLGPmRpC1TIFckYUV9dKWbZnA8TGWg1gAB8w==','','0753844544','2022-08-09 09:47:31','2022-08-14 21:18:17','424o0laszl6lo8snu',1,12,3,'X1N5D0I3','e3cce3862bc65bad'),('','/zuVHAs2oxpydtd0BCXfnW8C93ZWy8QZksc4THTXEQZHozamStVx8EWwvFbKVEI6A9SkKMMgxIZmaqVJJcguEA==','','773812817','2022-08-09 10:23:50','2022-08-14 09:55:00','424o0laszl6lpji4h',1,13,3,'Z4E5W1V1','f84bb4a0e6f86f36'),('','yJhQAF6iRWlWGvO/vBGcXLMeh4F0ExMAtYzARaIEIhGMAIf+YyWJaom4tEvAox3ClIahWCoE2vjMU691Hk2vTQ==','','0725752459','2022-08-09 17:02:24','2022-08-10 10:13:57','424o0lnt5l6m3s26a',1,14,3,'J0A0V1W3','e93b1c6f9a5a010d'),('','UQWTMe0+49ArpF/LA4CGQm/YN0owZKNb+M7xHOxmVCRql63v34ZnIpav8rhi7Q0/XZLyFZOKI4bAFyvy89GSkw==','','0774054860','2022-08-10 10:09:44','2022-08-15 11:38:50','424o0lootl6n4h80t',1,15,3,'M2K3U6S0','e97b1eb320278cfe'),('','19QX1pKjJpSrZz1lmPndnzJJ7v5iN/tSU0RiyMVO4vWtyyOJtZelk0zLycD387dVdE66LL3UxpQz7owRVsGghQ==','','0777008803','2022-08-15 11:41:28','2022-08-15 14:33:02','424o0llbl6ucygbl',1,16,3,'N7Q5J1F8','d6b6a9aa92698bdf');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

