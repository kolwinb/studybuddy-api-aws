DROP TABLE IF EXISTS `coin_pool`;
CREATE TABLE `coin_pool` (
  `id` int(15) NOT NULL AUTO_INCREMENT,
  `user_id` varChar(100) NOT NULL,
  `battle_id` int(15) NOT NULL,
  `coin`	int(15) NOT NULL,
  `datetime` datetime DEFAULT  NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `battle_answer`;
CREATE TABLE `battle_answer` (
  `id` int(15) NOT NULL AUTO_INCREMENT,
  `user_id` varChar(100) NOT NULL,
  `battle_id` int(15) NOT NULL,
  `question_id` int(15) NOT NULL,
  `option_id`	int(15) NOT NULL,
  `started` datetime DEFAULT  NULL,
  `ended` datetime DEFAULT  NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `battle_pool`;
CREATE TABLE `battle_pool` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user1id` varChar(100) NOT NULL,
  `user2id` varChar(100) NOT NULL,
  `status` ENUM('waiting','running','finish','cancel') NOT NULL,
  `datetime` datetime DEFAULT  NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

