/*
 Navicat Premium Data Transfer

 Source Server         : tx
 Source Server Type    : MySQL
 Source Server Version : 50650
 Source Host           : 43.142.107.166:3306
 Source Schema         : demo_db

 Target Server Type    : MySQL
 Target Server Version : 50650
 File Encoding         : 65001

 Date: 31/05/2023 16:59:33
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for tb_system_logs
-- ----------------------------
DROP TABLE IF EXISTS `tb_system_logs`;
CREATE TABLE `tb_system_logs`  (
  `refID` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `ip` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'ip地址',
  `remark` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '备注',
  `createTime` datetime(0) NOT NULL COMMENT '创建时间',
  `creator` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建者',
  `phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '手机号码',
  `orgCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '部门编号',
  PRIMARY KEY (`refID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 51 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of tb_system_logs
-- ----------------------------
INSERT INTO `tb_system_logs` VALUES (1, '127.0.0.1', '账户或密码错误', '2023-05-17 15:34:56', '路', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (2, '127.0.0.1', '登录成功', '2023-05-17 16:29:32', '路', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (3, '127.0.0.1', '登录成功', '2023-05-17 16:32:38', '路', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (4, '127.0.0.1', '登录成功', '2023-05-17 16:51:03', '路', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (5, '127.0.0.1', '登录成功', '2023-05-17 16:54:16', '路', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (6, '127.0.0.1', '登录成功', '2023-05-17 17:12:58', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (7, '127.0.0.1', '登录成功', '2023-05-18 09:30:02', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (8, '127.0.0.1', '登录成功', '2023-05-18 09:34:52', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (9, '127.0.0.1', '登录成功', '2023-05-18 09:35:22', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (10, '127.0.0.1', '登录成功', '2023-05-18 09:35:36', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (11, '127.0.0.1', '登录成功', '2023-05-18 09:37:34', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (12, '127.0.0.1', '登录成功', '2023-05-18 09:38:13', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (13, '127.0.0.1', '登录成功', '2023-05-18 09:39:05', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (14, '127.0.0.1', '登录成功', '2023-05-18 09:40:58', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (15, '127.0.0.1', '登录成功', '2023-05-18 09:42:05', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (16, '127.0.0.1', '登录成功', '2023-05-18 09:45:37', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (17, '127.0.0.1', '登录成功', '2023-05-18 11:34:59', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (18, '127.0.0.1', '登录成功', '2023-05-18 15:42:32', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (19, '127.0.0.1', '登录成功', '2023-05-18 15:46:46', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (20, '127.0.0.1', '登录成功', '2023-05-19 09:41:55', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (21, '127.0.0.1', '账户或密码错误', '2023-05-19 11:19:21', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (22, '127.0.0.1', '账户或密码错误', '2023-05-19 11:19:41', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (23, '127.0.0.1', '账户或密码错误', '2023-05-19 11:20:13', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (24, '127.0.0.1', '登录成功', '2023-05-25 09:52:50', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (25, '127.0.0.1', '登录成功', '2023-05-25 16:18:20', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (26, '127.0.0.1', '登录成功', '2023-05-25 16:19:00', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (27, '127.0.0.1', '登录成功', '2023-05-26 17:12:19', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (28, '127.0.0.1', '登录成功', '2023-05-26 17:12:37', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (29, '127.0.0.1', '登录成功', '2023-05-26 17:13:12', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (30, '127.0.0.1', '账户或密码错误', '2023-05-26 17:15:38', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (31, '127.0.0.1', '登录成功', '2023-05-26 17:15:50', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (32, '127.0.0.1', '登录成功', '2023-05-26 17:25:45', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (33, '127.0.0.1', '登录成功', '2023-05-26 17:26:28', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (34, '127.0.0.1', '登录成功', '2023-05-26 17:28:23', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (35, '127.0.0.1', '账户或密码错误', '2023-05-26 17:28:32', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (36, '127.0.0.1', '账户或密码错误', '2023-05-26 17:29:50', 'liming', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (37, '127.0.0.1', '登录成功', '2023-05-29 09:40:18', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (38, '127.0.0.1', '账户或密码错误', '2023-05-29 09:40:26', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (39, '127.0.0.1', '登录成功', '2023-05-29 10:04:58', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (40, '114.222.230.203', '登录成功', '2023-05-29 16:27:58', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (41, '114.222.230.203', '账户或密码错误', '2023-05-29 16:28:05', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (42, '114.222.230.203', '登录成功', '2023-05-29 16:28:09', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (43, '183.206.27.134', '登录成功', '2023-05-29 23:44:58', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (44, '127.0.0.1', '登录成功', '2023-05-29 23:53:00', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (45, '183.206.27.134', '登录成功', '2023-05-30 00:08:12', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (46, '183.206.27.134', '账户或密码错误', '2023-05-30 00:10:31', 'admin', NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (47, '183.206.27.134', '账户或密码错误', '2023-05-30 00:17:17', NULL, NULL, NULL);
INSERT INTO `tb_system_logs` VALUES (48, '127.0.0.1', '账户或密码错误', '2023-05-30 00:18:07', NULL, '15755782911', NULL);
INSERT INTO `tb_system_logs` VALUES (49, '127.0.0.1', '登录成功', '2023-05-30 00:18:24', NULL, '15755782911', NULL);
INSERT INTO `tb_system_logs` VALUES (50, '114.222.121.36', '登录成功', '2023-05-31 16:58:35', 'admin', NULL, NULL);

-- ----------------------------
-- Table structure for tb_system_menu
-- ----------------------------
DROP TABLE IF EXISTS `tb_system_menu`;
CREATE TABLE `tb_system_menu`  (
  `menuId` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `parentId` int(11) NOT NULL COMMENT '父菜单ID',
  `menuCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '菜单代号,规范权限标识',
  `rightCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '代码控制权限标识符',
  `menuName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '菜单名称',
  `menuType` int(11) NOT NULL COMMENT '菜单类型，1：菜单  2：业务操作',
  `menuSort` int(11) NULL DEFAULT NULL COMMENT '菜单的序号',
  `menuUrl` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '菜单地址',
  `menuIcon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '菜单图标',
  `menuState` int(11) NULL DEFAULT NULL COMMENT '状态 1启用;0禁用',
  `createTime` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `creator` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建者',
  `updateTime` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `updator` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新者',
  `orgCode` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '部门编号',
  PRIMARY KEY (`menuId`) USING BTREE,
  UNIQUE INDEX `refId_UNIQUE`(`menuId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of tb_system_menu
-- ----------------------------
INSERT INTO `tb_system_menu` VALUES (1, 0, '0', 'Dashboard', '概况总览', 1, 1, NULL, 'DashboardOutlined', 1, NULL, NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for tb_system_role_menu
-- ----------------------------
DROP TABLE IF EXISTS `tb_system_role_menu`;
CREATE TABLE `tb_system_role_menu`  (
  `refId` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `roleId` int(11) NOT NULL COMMENT '角色编号',
  `menuId` int(11) NOT NULL COMMENT '菜单编号',
  `createTime` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `creator` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建者',
  `updateTime` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `updator` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新者',
  `orgCode` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '部门编号',
  PRIMARY KEY (`refId`) USING BTREE,
  UNIQUE INDEX `refId_UNIQUE`(`refId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of tb_system_role_menu
-- ----------------------------
INSERT INTO `tb_system_role_menu` VALUES (1, 1, 1, NULL, NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for tb_system_user
-- ----------------------------
DROP TABLE IF EXISTS `tb_system_user`;
CREATE TABLE `tb_system_user`  (
  `userId` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户id',
  `userNo` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '用户账户',
  `name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户姓名',
  `passWord` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户密码',
  `phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '手机号码',
  `email` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '用户邮箱',
  `headImage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '用户头像',
  `createTime` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `creator` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建者',
  `updateTime` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `updator` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新者',
  `delFlag` int(11) NULL DEFAULT NULL COMMENT '逻辑删除（0：未删除，1：已删除）',
  `isActive` int(11) NULL DEFAULT NULL COMMENT '是否激活（0：未激活，1：激活）',
  `organizationId` int(11) NULL DEFAULT NULL COMMENT '组织ID',
  `roleId` int(11) NULL DEFAULT NULL COMMENT '角色编号',
  PRIMARY KEY (`userId`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of tb_system_user
-- ----------------------------
INSERT INTO `tb_system_user` VALUES ('0e32e80a-eed2-4b60-852c-42ec960d15b4', NULL, '郭飞', '123456', '15755762344', NULL, NULL, '2023-05-19 10:00:39', NULL, '2023-05-19 10:00:39', NULL, 0, 1, NULL, 2);
INSERT INTO `tb_system_user` VALUES ('3c6d8147-fdf1-42ba-9c05-fe745650c64c', NULL, '桑酒', 'sangjiu123456', '13755896722', NULL, NULL, '2023-05-19 10:18:03', '桑酒', '2023-05-19 10:18:03', '桑酒', 0, 1, NULL, 2);
INSERT INTO `tb_system_user` VALUES ('52f7cecd-f51b-11ed-ac59-1c697a6d26a2', 'admin', '路', '123456', '15755782911', NULL, NULL, '2023-05-18 09:45:09', '管理员', '2023-05-16 11:02:29', '管理员', 0, 1, NULL, 1);
INSERT INTO `tb_system_user` VALUES ('52f91d60-f51b-11ed-ac59-1c697a6d26a2', '123', '张三', '123456', '1234567', NULL, NULL, '2023-05-18 09:45:09', '管理员', '2023-05-17 11:03:39', '管理员', 0, 1, NULL, 1);
INSERT INTO `tb_system_user` VALUES ('52f91f23-f51b-11ed-ac59-1c697a6d26a2', '11', '王静', '123456', '12345678', NULL, NULL, '2023-05-18 09:45:09', '管理员', '2023-05-17 11:04:21', '管理员', 0, 1, NULL, 1);
INSERT INTO `tb_system_user` VALUES ('52f91ff2-f51b-11ed-ac59-1c697a6d26a2', 'liming', '李明', '123456', '123456789', NULL, NULL, '2023-05-18 09:45:09', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `tb_system_user` VALUES ('7b5d2ac1-494b-4159-aefb-7fd92854297e', NULL, '李红', '123456', '15755762399', NULL, NULL, '2023-05-19 10:12:06', NULL, '2023-05-19 10:12:06', NULL, 0, 1, NULL, 2);
INSERT INTO `tb_system_user` VALUES ('e1361bd6-5a9c-4dea-bf2b-2c7905dfc6e9', NULL, '小孬', 'xiaonao123456', '15755782999', NULL, NULL, '2023-05-29 23:55:40', '小孬', '2023-05-29 23:55:40', '小孬', 0, 1, NULL, 2);
INSERT INTO `tb_system_user` VALUES ('ed8870d9-9aec-4f44-90bf-8d60a86f109c', NULL, '楚风', '123456', '15755762755', NULL, NULL, '2023-05-19 10:15:34', '楚风', '2023-05-19 10:15:34', '楚风', 0, 1, NULL, 2);

SET FOREIGN_KEY_CHECKS = 1;
