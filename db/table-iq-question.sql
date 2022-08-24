
DROP TABLE IF EXISTS `iq_answer`;
CREATE TABLE `iq_answer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `question_id` int(11) DEFAULT NULL,
  `answer_id` int(11) DEFAULT NULL,
  `started` datetime(6) DEFAULT NULL,
  `ended` datetime(6) DEFAULT NULL,
  `is_correct` tinyint(1) DEFAULT NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `iq_question`;
CREATE TABLE `iq_question` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question` TEXT DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `iq_option`;
CREATE TABLE `iq_option` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question_id` int(11) NOT NULL,
  `option` varchar(255) DEFAULT NULL,
  `state` tinyint(1) DEFAULT NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


