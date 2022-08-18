
DROP TABLE IF EXISTS `mcq_battle`;
CREATE TABLE `mcq_battle` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `challenge_id` int(11) NOT NULL,
  `started` datetime DEFAULT  NULL,
  `ended` datetime DEFAULT  NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `challenge`;
CREATE TABLE `challenge` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user1id` int(11) NOT NULL,
  `user2id` int(11) NOT NULL,
  `status` int(1) NOT NULL,
  `datetime` datetime DEFAULT  NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

