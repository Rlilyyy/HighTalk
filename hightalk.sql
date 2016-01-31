/*
Navicat MySQL Data Transfer

Source Server         : root
Source Server Version : 50621
Source Host           : localhost:3306
Source Database       : hightalk

Target Server Type    : MYSQL
Target Server Version : 50621
File Encoding         : 65001

Date: 2016-01-31 15:32:04
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for rooms
-- ----------------------------
DROP TABLE IF EXISTS `rooms`;
CREATE TABLE `rooms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roomname` varchar(128) NOT NULL,
  `image` varchar(256) DEFAULT NULL,
  `synopsis` varchar(128) DEFAULT NULL,
  `createdate` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of rooms
-- ----------------------------
INSERT INTO `rooms` VALUES ('1', '一号房间', null, '一号房间简介', '2016-01-28');
INSERT INTO `rooms` VALUES ('2', '二号房间', null, null, '2016-01-28');
INSERT INTO `rooms` VALUES ('3', '三号房间', null, null, '2016-01-28');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nickname` varchar(128) NOT NULL,
  `username` varchar(64) NOT NULL,
  `psw` varchar(128) NOT NULL,
  `image` varchar(256) DEFAULT NULL,
  `synopsis` varchar(128) DEFAULT NULL,
  `createdate` date NOT NULL,
  `sex` varchar(8) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'SADASD', 'ASDASD', 'ASDASD', null, null, '2016-01-28', null);
INSERT INTO `users` VALUES ('2', '喵', 'lxh123486', 'nyMK0ngwWjmZ3eJg', null, null, '2016-01-28', null);
INSERT INTO `users` VALUES ('6', 'asdasd', 'lxh1234866', 'nyMK0ngwWjmZ3eJg', null, null, '2016-01-28', null);
INSERT INTO `users` VALUES ('7', '喵喵', 'lxh12348666', 'nyMK0ngwWjmZ3eJg', null, null, '2016-01-29', null);
INSERT INTO `users` VALUES ('8', '胡说八道', 'lxh123486666', 'nyMK0ngwWjmZ3eJg', null, null, '2016-01-29', 'female');
INSERT INTO `users` VALUES ('9', '路爱了', 'lbh123486', 'nyMK0ngwWjmZ3eJg', null, null, '2016-01-29', '女');
INSERT INTO `users` VALUES ('10', 'sdasdasd', 'asdasdasdasd', 'RmPA3NLB9xJKnoka', null, null, '2016-01-29', '男');
INSERT INTO `users` VALUES ('11', '', 'aaaaaaa', '', null, null, '2016-01-29', '男');
INSERT INTO `users` VALUES ('12', '', 'aaaaaaaa', '', null, null, '2016-01-29', '男');
INSERT INTO `users` VALUES ('13', '', 'sssssssss', '', null, null, '2016-01-29', '男');
INSERT INTO `users` VALUES ('14', '', 'ssssss', '', null, null, '2016-01-29', '男');
INSERT INTO `users` VALUES ('15', '', 'ggggggggg', '', null, null, '2016-01-29', '男');
INSERT INTO `users` VALUES ('16', '', '', '', null, null, '2016-01-29', '男');
INSERT INTO `users` VALUES ('20', 'ssssssssssssssss', 'sssssssssssss', '', null, null, '2016-01-29', '男');
INSERT INTO `users` VALUES ('21', 'qqqqqqqqq', 'qqqqqqqqqqqqq', '', null, null, '2016-01-29', '男');
INSERT INTO `users` VALUES ('22', 'sssssssssssssssss', 'sssssss', 'nyMK0zElwXnnL3eJ', null, null, '2016-01-29', '男');
INSERT INTO `users` VALUES ('23', 'aaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaa', 'nyMK0zElwXnnL3eJ', null, null, '2016-01-29', '男');
INSERT INTO `users` VALUES ('24', '嘿嘿嘿', 'lbh1234866', 'nyMK0ngwWjmZ3eJg', null, null, '2016-01-30', '男');
INSERT INTO `users` VALUES ('25', '王大锤', '532273622', 'nyMK0ngwWjmZ3eJg', null, null, '2016-01-30', '男');

-- ----------------------------
-- Table structure for u_r
-- ----------------------------
DROP TABLE IF EXISTS `u_r`;
CREATE TABLE `u_r` (
  `uid` int(11) NOT NULL,
  `rid` int(11) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `joindate` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`),
  KEY `rid` (`rid`),
  CONSTRAINT `u_r_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`id`),
  CONSTRAINT `u_r_ibfk_2` FOREIGN KEY (`rid`) REFERENCES `rooms` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of u_r
-- ----------------------------
INSERT INTO `u_r` VALUES ('2', '1', '1', '2016-01-28');
INSERT INTO `u_r` VALUES ('2', '3', '2', '2016-01-28');
INSERT INTO `u_r` VALUES ('1', '3', '3', '2016-01-28');
INSERT INTO `u_r` VALUES ('6', '1', '4', '2016-01-29');
INSERT INTO `u_r` VALUES ('6', '3', '5', '2016-01-29');
