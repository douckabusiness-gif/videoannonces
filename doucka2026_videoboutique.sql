/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.4.10-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: doucka2026_videoboutique
-- ------------------------------------------------------
-- Server version	11.4.10-MariaDB-ubu2404

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ad`
--

DROP TABLE IF EXISTS `ad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ad` (
  `id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `imageUrl` varchar(191) NOT NULL,
  `linkUrl` varchar(191) NOT NULL,
  `position` varchar(191) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `clicks` int(11) NOT NULL DEFAULT 0,
  `impressions` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Ad_position_isActive_idx` (`position`,`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ad`
--

LOCK TABLES `ad` WRITE;
/*!40000 ALTER TABLE `ad` DISABLE KEYS */;
/*!40000 ALTER TABLE `ad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `adminlog`
--

DROP TABLE IF EXISTS `adminlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `adminlog` (
  `id` varchar(191) NOT NULL,
  `adminId` varchar(191) NOT NULL,
  `action` varchar(191) NOT NULL,
  `targetType` varchar(191) NOT NULL,
  `targetId` varchar(191) DEFAULT NULL,
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`details`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `AdminLog_adminId_idx` (`adminId`),
  KEY `AdminLog_action_idx` (`action`),
  CONSTRAINT `adminlog_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `user` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adminlog`
--

LOCK TABLES `adminlog` WRITE;
/*!40000 ALTER TABLE `adminlog` DISABLE KEYS */;
INSERT INTO `adminlog` VALUES
('cmjfk66tr0002kcr0izybqkly','cmjacjyam0000kc1s95fj9pzu','payment_method_created','payment_method','cmjfk66s30000kcr0jhv65i0y','{\"methodName\": \"WAVE\"}','2025-12-21 10:02:28.240'),
('cmjfk7vs20005kcr011fbov4x','cmjacjyam0000kc1s95fj9pzu','payment_method_created','payment_method','cmjfk7vri0003kcr0wtdbgnhy','{\"methodName\": \"ORANGE\"}','2025-12-21 10:03:47.234'),
('cmjfk9z1q0008kcr0ch4cqqij','cmjacjyam0000kc1s95fj9pzu','subscription_plan_created','subscription_plan','cmjfk9z0z0006kcr0rcszstxs','{\"planName\": \"BOUTIQUE PRO\"}','2025-12-21 10:05:24.782'),
('cmjh3tkfz0001kcwwmwzea918','cmjacjyam0000kc1s95fj9pzu','payment_method_updated','payment_method','cmjfk66s30000kcr0jhv65i0y','{\"methodName\": \"WAVE\"}','2025-12-22 12:00:17.851'),
('cmjh3tpyp0003kcww04b5meuw','cmjacjyam0000kc1s95fj9pzu','payment_method_updated','payment_method','cmjfk7vri0003kcr0wtdbgnhy','{\"methodName\": \"ORANGE\"}','2025-12-22 12:00:25.010'),
('cmjh3wbjd0005kcww3msh237x','cmjacjyam0000kc1s95fj9pzu','subscription_plan_deleted','subscription_plan','cmjfk9z0z0006kcr0rcszstxs','{\"planName\": \"BOUTIQUE PRO\"}','2025-12-22 12:02:26.281'),
('cmjh4dk150001kcvct4av1lkt','cmjacjyam0000kc1s95fj9pzu','subscription_plan_updated','subscription_plan','cmjfovmwo0000kc242n8ud0xd','{\"planName\": \"Pro\"}','2025-12-22 12:15:50.441'),
('cmjh4ebeg0003kcvcu06psoug','cmjacjyam0000kc1s95fj9pzu','subscription_plan_updated','subscription_plan','cmjfovmwo0000kc242n8ud0xd','{\"planName\": \"Pro\"}','2025-12-22 12:16:25.912'),
('cmjh4ffwl0006kcvc4otks3lp','cmjacjyam0000kc1s95fj9pzu','boost_package_created','boost_package','cmjh4ffw00004kcvcpkyz68sg','{\"boostName\": \"BOOSTE VOTRE ANNONCE\"}','2025-12-22 12:17:18.405'),
('cmjhxvwm80001kcbomqbo0etb','cmjacjyam0000kc1s95fj9pzu','subscription_approved','user','cmjac07i4000ekclw0vnprddx','{\"amount\": 25000, \"paymentId\": \"cmjhxgpie0002kcv89tf4agp4\", \"reference\": \"SUB-1766454606372-825pc4mef\"}','2025-12-23 02:01:55.424'),
('cmjiaek5f0003kc6gs7dcxg9f','cmjacjyam0000kc1s95fj9pzu','subscription_approved','user','cmjac07i4000ekclw0vnprddx','{\"amount\": 2000, \"paymentId\": \"cmjiadd3n0001kc6g9f5nh717\", \"reference\": \"BOOST-1766476285330-ce3vhrvj3\"}','2025-12-23 07:52:21.124'),
('cmjiao6yd0005kc6gmzu8tjsn','cmjacjyam0000kc1s95fj9pzu','payment_method_updated','payment_method','cmjfk66s30000kcr0jhv65i0y','{\"methodName\": \"WAVE\"}','2025-12-23 07:59:50.582'),
('cmjib0s8x000dkc6gir96sonf','cmjacjyam0000kc1s95fj9pzu','subscription_approved','user','cmjac07i4000ekclw0vnprddx','{\"amount\": 2000, \"paymentId\": \"cmjiazxny000bkc6g8o1xynso\", \"reference\": \"BOOST-1766477338413-o2h7c5x4b\"}','2025-12-23 08:09:38.049'),
('cmjibe40d000jkc6gbqhxegs8','cmjacjyam0000kc1s95fj9pzu','subscription_approved','user','cmjac07i4000ekclw0vnprddx','{\"amount\": 2000, \"paymentId\": \"cmjibdsu0000hkc6gc3finqa1\", \"reference\": \"BOOST-1766477985334-89i9vzs5m\"}','2025-12-23 08:19:59.822'),
('cmjlql9jf0003kc1wuicn57zg','cmjacjyam0000kc1s95fj9pzu','subscription_approved','user','cmjac07i4000ekclw0vnprddx','{\"amount\": 2000, \"paymentId\": \"cmjlnbg090001kc1wjvt97oll\", \"reference\": \"BOOST-1766679429311-1bx8ws0pj\"}','2025-12-25 17:48:46.345'),
('cmjtac1gd0009s3eomkryphia','cmjacjyam0000kc1s95fj9pzu','payment_method_updated','payment_method','cmjfk66s30000kcr0jhv65i0y','{\"methodName\":\"WAVE\"}','2025-12-31 00:35:51.517'),
('cmjtafe1t000bs3eoczs0rl5j','cmjacjyam0000kc1s95fj9pzu','payment_method_updated','payment_method','cmjfk66s30000kcr0jhv65i0y','{\"methodName\":\"WAVE\"}','2025-12-31 00:38:27.810'),
('cmjtvubjc0003s3plnr4c5xw7','cmjacjyam0000kc1s95fj9pzu','subscription_approved','user','cmjta8bpg0006s3eoq7r2tbtr','{\"paymentId\":\"cmjtpo9210001s3plxq4er8u5\",\"reference\":\"SUB-1767167115481-qgdzko4up\",\"amount\":25000}','2025-12-31 10:37:56.327'),
('cmjvchx3d000is3hpku0th5w2','cmjacjyam0000kc1s95fj9pzu','subscription_approved','user','cmjvcb2yd0003s3hpaumissjj','{\"paymentId\":\"cmjvchr4r000gs3hpkr00cyev\",\"reference\":\"SUB-1767265909658-4ewjtmpfz\",\"amount\":25000}','2026-01-01 11:11:57.386'),
('cmjvcjwf7000ms3hpp091advh','cmjacjyam0000kc1s95fj9pzu','subscription_approved','user','cmjvcb2yd0003s3hpaumissjj','{\"paymentId\":\"cmjvcj6zt000ks3hp8wltgjav\",\"reference\":\"SUB-1767265976872-utmf6m4n3\",\"amount\":25000}','2026-01-01 11:13:29.828'),
('cmjwjjxwi000fs36qsl2ixxfy','cmjacjyam0000kc1s95fj9pzu','subscription_approved','user','cmjwjbfdk000as36qia8cbz7v','{\"paymentId\":\"cmjwjdasp000ds36qj3kd7kzc\",\"reference\":\"SUB-1767337925352-1cydm0lbc\",\"amount\":25000}','2026-01-02 07:17:15.234');
/*!40000 ALTER TABLE `adminlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `automationconfig`
--

DROP TABLE IF EXISTS `automationconfig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `automationconfig` (
  `id` varchar(191) NOT NULL,
  `feature` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `category` varchar(191) NOT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT 0,
  `config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`config`)),
  `apiProvider` varchar(191) DEFAULT NULL,
  `apiKey` text DEFAULT NULL,
  `apiEndpoint` varchar(191) DEFAULT NULL,
  `dailyQuota` int(11) DEFAULT NULL,
  `monthlyQuota` int(11) DEFAULT NULL,
  `usageCount` int(11) NOT NULL DEFAULT 0,
  `lastResetAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `costPerCall` double DEFAULT NULL,
  `totalCost` double NOT NULL DEFAULT 0,
  `schedule` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`schedule`)),
  `conditions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`conditions`)),
  `priority` int(11) NOT NULL DEFAULT 0,
  `version` varchar(191) NOT NULL DEFAULT '1.0',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `AutomationConfig_feature_key` (`feature`),
  KEY `AutomationConfig_feature_idx` (`feature`),
  KEY `AutomationConfig_enabled_idx` (`enabled`),
  KEY `AutomationConfig_category_idx` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `automationconfig`
--

LOCK TABLES `automationconfig` WRITE;
/*!40000 ALTER TABLE `automationconfig` DISABLE KEYS */;
INSERT INTO `automationconfig` VALUES
('cmjjnxy2k0000kc2gk6cduxnt','content_moderation','Modération de Contenu IA','Analyse automatique des annonces et commentaires pour détecter le contenu inapproprié','moderation',1,'{\"model\": \"gpt-4\", \"maxTokens\": 500, \"temperature\": 0.3}','openai',NULL,NULL,1000,30000,0,'2025-12-24 06:59:06.811',0.002,0,NULL,NULL,10,'1.0','2025-12-24 06:59:06.811','2025-12-24 06:59:06.811'),
('cmjjnxy3a0001kc2gorivhajl','image_moderation','Modération d\'Images','Détection automatique de contenu visuel inapproprié dans les images uploadées','moderation',1,'{\"model\": \"gpt-4-vision\", \"confidence\": 0.8}','openai',NULL,NULL,500,15000,0,'2025-12-24 06:59:06.838',0.005,0,NULL,NULL,9,'1.0','2025-12-24 06:59:06.838','2025-12-24 06:59:06.838'),
('cmjjnxy3t0002kc2g0757kz29','auto_title_generation','Génération de Titres','Génère automatiquement des titres optimisés pour les annonces','content',0,'{\"model\": \"gpt-3.5-turbo\", \"maxLength\": 60}','openai',NULL,NULL,200,6000,0,'2025-12-24 06:59:06.858',0.001,0,NULL,NULL,5,'1.0','2025-12-24 06:59:06.858','2025-12-24 06:59:06.858'),
('cmjjnxy470003kc2gbhlqre6g','auto_description','Amélioration de Descriptions','Améliore automatiquement les descriptions des annonces pour plus d\'impact','content',0,'{\"tone\": \"professional\", \"model\": \"gpt-4\"}','openai',NULL,NULL,150,4500,0,'2025-12-24 06:59:06.872',0.003,0,NULL,NULL,4,'1.0','2025-12-24 06:59:06.872','2025-12-24 06:59:06.872'),
('cmjjnxy4l0004kc2gijy7byg1','sentiment_analysis','Analyse de Sentiment','Analyse le sentiment des commentaires et messages pour détecter les problèmes','analytics',1,'{\"model\": \"gpt-3.5-turbo\"}','openai',NULL,NULL,500,15000,0,'2025-12-24 06:59:06.886',0.001,0,NULL,NULL,6,'1.0','2025-12-24 06:59:06.886','2025-12-24 06:59:06.886'),
('cmjjnxy4y0005kc2gcauxidwp','auto_response','Réponses Automatiques','Génère des réponses automatiques aux questions fréquentes','engagement',0,'{\"model\": \"gpt-4\", \"temperature\": 0.7}','openai',NULL,NULL,300,9000,0,'2025-12-24 06:59:06.899',0.002,0,NULL,NULL,3,'1.0','2025-12-24 06:59:06.899','2025-12-24 06:59:06.899'),
('cmjjnxy5d0006kc2g1ra8kmk5','spam_detection','Détection de Spam','Détecte et bloque automatiquement les annonces et messages spam','moderation',1,'{\"model\": \"gpt-3.5-turbo\", \"threshold\": 0.9}','openai',NULL,NULL,1000,30000,0,'2025-12-24 06:59:06.914',0.001,0,NULL,NULL,10,'1.0','2025-12-24 06:59:06.914','2025-12-24 06:59:06.914'),
('cmjjnxy5q0007kc2gcdh6bz6f','trend_analysis','Analyse de Tendances','Analyse les tendances du marché et suggère des optimisations','analytics',0,'{\"model\": \"gpt-4\", \"analysisDepth\": \"deep\"}','openai',NULL,NULL,50,1500,0,'2025-12-24 06:59:06.927',0.01,0,NULL,NULL,2,'1.0','2025-12-24 06:59:06.927','2025-12-24 06:59:06.927');
/*!40000 ALTER TABLE `automationconfig` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `automationlog`
--

DROP TABLE IF EXISTS `automationlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `automationlog` (
  `id` varchar(191) NOT NULL,
  `configId` varchar(191) NOT NULL,
  `action` varchar(191) NOT NULL,
  `feature` varchar(191) NOT NULL,
  `input` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`input`)),
  `output` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`output`)),
  `error` text DEFAULT NULL,
  `executionTime` int(11) DEFAULT NULL,
  `tokensUsed` int(11) DEFAULT NULL,
  `cost` double DEFAULT NULL,
  `userId` varchar(191) DEFAULT NULL,
  `targetId` varchar(191) DEFAULT NULL,
  `targetType` varchar(191) DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `AutomationLog_configId_idx` (`configId`),
  KEY `AutomationLog_feature_idx` (`feature`),
  KEY `AutomationLog_action_idx` (`action`),
  KEY `AutomationLog_createdAt_idx` (`createdAt`),
  KEY `AutomationLog_userId_idx` (`userId`),
  CONSTRAINT `automationlog_configId_fkey` FOREIGN KEY (`configId`) REFERENCES `automationconfig` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `automationlog`
--

LOCK TABLES `automationlog` WRITE;
/*!40000 ALTER TABLE `automationlog` DISABLE KEYS */;
/*!40000 ALTER TABLE `automationlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `automationtemplate`
--

DROP TABLE IF EXISTS `automationtemplate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `automationtemplate` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `trigger` varchar(191) NOT NULL,
  `conditions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`conditions`)),
  `actions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`actions`)),
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `AutomationTemplate_userId_idx` (`userId`),
  KEY `AutomationTemplate_active_idx` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `automationtemplate`
--

LOCK TABLES `automationtemplate` WRITE;
/*!40000 ALTER TABLE `automationtemplate` DISABLE KEYS */;
/*!40000 ALTER TABLE `automationtemplate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `badge`
--

DROP TABLE IF EXISTS `badge`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `badge` (
  `id` varchar(191) NOT NULL,
  `type` enum('VERIFIED','TOP_SELLER','FAST_RESPONDER','PREMIUM','NEW_SELLER','TRUSTED','EXPERT') NOT NULL,
  `name` varchar(191) NOT NULL,
  `nameFr` varchar(191) NOT NULL,
  `nameAr` varchar(191) DEFAULT NULL,
  `description` text NOT NULL,
  `icon` varchar(191) NOT NULL,
  `color` varchar(191) NOT NULL,
  `criteria` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`criteria`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Badge_type_key` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `badge`
--

LOCK TABLES `badge` WRITE;
/*!40000 ALTER TABLE `badge` DISABLE KEYS */;
/*!40000 ALTER TABLE `badge` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `boostpackage`
--

DROP TABLE IF EXISTS `boostpackage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `boostpackage` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `price` int(11) NOT NULL,
  `duration` int(11) NOT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`features`)),
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `BoostPackage_active_idx` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `boostpackage`
--

LOCK TABLES `boostpackage` WRITE;
/*!40000 ALTER TABLE `boostpackage` DISABLE KEYS */;
INSERT INTO `boostpackage` VALUES
('cmjh4ffw00004kcvcpkyz68sg','BOOSTE VOTRE ANNONCE','',2000,7,'[]',1,'2025-12-22 12:17:18.384','2025-12-22 12:17:18.384');
/*!40000 ALTER TABLE `boostpackage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `nameFr` varchar(191) NOT NULL,
  `nameAr` varchar(191) DEFAULT NULL,
  `nameEn` varchar(191) DEFAULT NULL,
  `slug` varchar(191) NOT NULL,
  `icon` varchar(191) DEFAULT NULL,
  `image` varchar(191) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `color` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `parentId` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Category_slug_key` (`slug`),
  KEY `Category_slug_idx` (`slug`),
  KEY `Category_order_idx` (`order`),
  KEY `Category_parentId_idx` (`parentId`),
  CONSTRAINT `category_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES
('cmjm48due0000kcd8cjky0omc','Électronique','Électronique',NULL,NULL,'electronics','📱',NULL,NULL,1,1,'from-blue-500 to-indigo-600','2025-12-26 00:10:40.022','2025-12-26 00:10:40.022',NULL),
('cmjm48duu0002kcd82lyqbsrq','Téléphones & Tablettes','Téléphones & Tablettes',NULL,NULL,'phones-tablets','📲',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.039','2025-12-26 00:10:40.039','cmjm48due0000kcd8cjky0omc'),
('cmjm48dv90004kcd8sz3e9v81','Ordinateurs','Ordinateurs',NULL,NULL,'computers','💻',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.053','2025-12-26 00:10:40.053','cmjm48due0000kcd8cjky0omc'),
('cmjm48dvg0006kcd889kumhzm','Accessoires','Accessoires',NULL,NULL,'electronics-accessories','🎧',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.061','2025-12-26 00:10:40.061','cmjm48due0000kcd8cjky0omc'),
('cmjm48dvq0008kcd81ugifoz5','TV & Audio','TV & Audio',NULL,NULL,'tv-audio','📺',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.070','2025-12-26 00:10:40.070','cmjm48due0000kcd8cjky0omc'),
('cmjm48dvx0009kcd8hxz5hakw','Mode','Mode',NULL,NULL,'fashion','👔',NULL,NULL,2,1,'from-pink-500 to-rose-600','2025-12-26 00:10:40.077','2025-12-26 00:10:40.077',NULL),
('cmjm48dw7000bkcd821501myt','Vêtements Homme','Vêtements Homme',NULL,NULL,'men-fashion','👕',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.088','2025-12-26 00:10:40.088','cmjm48dvx0009kcd8hxz5hakw'),
('cmjm48dwh000dkcd8bg55voo0','Vêtements Femme','Vêtements Femme',NULL,NULL,'women-fashion','👗',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.097','2025-12-26 00:10:40.097','cmjm48dvx0009kcd8hxz5hakw'),
('cmjm48dwt000fkcd8ea7j70dt','Chaussures','Chaussures',NULL,NULL,'shoes','👟',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.109','2025-12-26 00:10:40.109','cmjm48dvx0009kcd8hxz5hakw'),
('cmjm48dx1000hkcd848eupyx9','Sacs & Accessoires','Sacs & Accessoires',NULL,NULL,'fashion-accessories','👜',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.117','2025-12-26 00:10:40.117','cmjm48dvx0009kcd8hxz5hakw'),
('cmjm48dx8000ikcd8paeo1tfw','Véhicules','Véhicules',NULL,NULL,'vehicles','🚗',NULL,NULL,3,1,'from-orange-500 to-red-600','2025-12-26 00:10:40.124','2025-12-26 00:10:40.124',NULL),
('cmjm48dxn000kkcd892t6zrxz','Voitures','Voitures',NULL,NULL,'cars','🏎️',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.139','2025-12-26 00:10:40.139','cmjm48dx8000ikcd8paeo1tfw'),
('cmjm48dy0000mkcd8e2a17t0i','Motos & Scooters','Motos & Scooters',NULL,NULL,'motorcycles','🏍️',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.152','2025-12-26 00:10:40.152','cmjm48dx8000ikcd8paeo1tfw'),
('cmjm48dy8000okcd8zlmaf0t6','Pièces Détachées','Pièces Détachées',NULL,NULL,'vehicle-parts','⚙️',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.161','2025-12-26 00:10:40.161','cmjm48dx8000ikcd8paeo1tfw'),
('cmjm48dyh000qkcd8vwbijtoh','Engins Lourds','Engins Lourds',NULL,NULL,'heavy-equipment','🚜',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.169','2025-12-26 00:10:40.169','cmjm48dx8000ikcd8paeo1tfw'),
('cmjm48dyo000rkcd8dox7m8cs','Immobilier','Immobilier',NULL,NULL,'real-estate','🏠',NULL,NULL,4,1,'from-emerald-500 to-teal-600','2025-12-26 00:10:40.176','2025-12-26 00:10:40.176',NULL),
('cmjm48dyz000tkcd8g5bvk7yo','Appartements à louer','Appartements à louer',NULL,NULL,'apartments-rent','🏢',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.188','2025-12-26 00:10:40.188','cmjm48dyo000rkcd8dox7m8cs'),
('cmjm48dz8000vkcd89oonuzak','Maisons à vendre','Maisons à vendre',NULL,NULL,'houses-sale','🏡',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.196','2025-12-26 00:10:40.196','cmjm48dyo000rkcd8dox7m8cs'),
('cmjm48dzh000xkcd87fgs9uvo','Terrains','Terrains',NULL,NULL,'land','📐',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.205','2025-12-26 00:10:40.205','cmjm48dyo000rkcd8dox7m8cs'),
('cmjm48dzt000zkcd89wnc2vkf','Bureaux & Commerces','Bureaux & Commerces',NULL,NULL,'commercial','🏪',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.217','2025-12-26 00:10:40.217','cmjm48dyo000rkcd8dox7m8cs'),
('cmjm48e050010kcd89ktq0iuk','Maison','Maison',NULL,NULL,'home','🪑',NULL,NULL,5,1,'from-amber-500 to-yellow-600','2025-12-26 00:10:40.230','2025-12-26 00:10:40.230',NULL),
('cmjm48e0e0012kcd8ck7d67it','Meubles','Meubles',NULL,NULL,'furniture','🛋️',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.238','2025-12-26 00:10:40.238','cmjm48e050010kcd89ktq0iuk'),
('cmjm48e0l0014kcd8kcbowyuk','Électroménager','Électroménager',NULL,NULL,'appliances','🍳',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.245','2025-12-26 00:10:40.245','cmjm48e050010kcd89ktq0iuk'),
('cmjm48e0s0016kcd8ubdv4yac','Décoration','Décoration',NULL,NULL,'decoration','🖼️',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.252','2025-12-26 00:10:40.252','cmjm48e050010kcd89ktq0iuk'),
('cmjm48e0z0018kcd8z1a02zhu','Jardin & Bricolage','Jardin & Bricolage',NULL,NULL,'garden-diy','🛠️',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.259','2025-12-26 00:10:40.259','cmjm48e050010kcd89ktq0iuk'),
('cmjm48e170019kcd80mdzf6f4','Services','Services',NULL,NULL,'services','🛠️',NULL,NULL,6,1,'from-cyan-500 to-blue-600','2025-12-26 00:10:40.267','2025-12-26 00:10:40.267',NULL),
('cmjm48e1l001bkcd82bi6d2ro','Cours & Formations','Cours & Formations',NULL,NULL,'training','📚',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.281','2025-12-26 00:10:40.281','cmjm48e170019kcd80mdzf6f4'),
('cmjm48e29001dkcd8jdcei4y6','Réparation & Travaux','Réparation & Travaux',NULL,NULL,'repairs','🔨',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.306','2025-12-26 00:10:40.306','cmjm48e170019kcd80mdzf6f4'),
('cmjm48e2i001fkcd8nagd3ra1','Événementiel','Événementiel',NULL,NULL,'events','🎉',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.315','2025-12-26 00:10:40.315','cmjm48e170019kcd80mdzf6f4'),
('cmjm48e2p001hkcd8cphxxi6k','Transport & Déménagement','Transport & Déménagement',NULL,NULL,'transport','🚚',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.321','2025-12-26 00:10:40.321','cmjm48e170019kcd80mdzf6f4'),
('cmjm48e2v001ikcd8zhn0kbet','Beauté & Santé','Beauté & Santé',NULL,NULL,'beauty-health','💄',NULL,NULL,7,1,'from-purple-500 to-violet-600','2025-12-26 00:10:40.328','2025-12-26 00:10:40.328',NULL),
('cmjm48e33001kkcd8w5riu497','Cosmétiques','Cosmétiques',NULL,NULL,'cosmetics','💅',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.335','2025-12-26 00:10:40.335','cmjm48e2v001ikcd8zhn0kbet'),
('cmjm48e3b001mkcd8xz53oc2k','Soins du corps','Soins du corps',NULL,NULL,'body-care','🧴',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.343','2025-12-26 00:10:40.343','cmjm48e2v001ikcd8zhn0kbet'),
('cmjm48e3h001okcd8earfl5uq','Parfums','Parfums',NULL,NULL,'perfumes','✨',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.350','2025-12-26 00:10:40.350','cmjm48e2v001ikcd8zhn0kbet'),
('cmjm48e3o001qkcd83snc7mm2','Équipements médicaux','Équipements médicaux',NULL,NULL,'medical-equipment','🩺',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.356','2025-12-26 00:10:40.356','cmjm48e2v001ikcd8zhn0kbet'),
('cmjm48e3v001rkcd84gharggh','Agriculture & Alimentation','Agriculture & Alimentation',NULL,NULL,'agriculture-food','🌾',NULL,NULL,8,1,'from-lime-500 to-green-600','2025-12-26 00:10:40.364','2025-12-26 00:10:40.364',NULL),
('cmjm48e45001tkcd8j3p7flqs','Produits Agricoles','Produits Agricoles',NULL,NULL,'farm-products','🍅',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.373','2025-12-26 00:10:40.373','cmjm48e3v001rkcd84gharggh'),
('cmjm48e4g001vkcd8hvmx3wz3','Élevage','Élevage',NULL,NULL,'livestock','🐄',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.384','2025-12-26 00:10:40.384','cmjm48e3v001rkcd84gharggh'),
('cmjm48e4r001xkcd83t0b6aj9','Matériel Agricole','Matériel Agricole',NULL,NULL,'farm-tools','🚜',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.395','2025-12-26 00:10:40.395','cmjm48e3v001rkcd84gharggh'),
('cmjm48e55001zkcd8mvt1tc7j','Epicerie','Epicerie',NULL,NULL,'grocery','🥫',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.409','2025-12-26 00:10:40.409','cmjm48e3v001rkcd84gharggh'),
('cmjm48e5h0020kcd8cnf562f0','Emploi','Emploi',NULL,NULL,'jobs','💼',NULL,NULL,9,1,'from-slate-500 to-gray-600','2025-12-26 00:10:40.421','2025-12-26 00:10:40.421',NULL),
('cmjm48e5o0022kcd8942g7wry','Offres d\'emploi','Offres d\'emploi',NULL,NULL,'job-offers','📝',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.428','2025-12-26 00:10:40.428','cmjm48e5h0020kcd8cnf562f0'),
('cmjm48e5w0024kcd84k638n7j','Demandes d\'emploi','Demandes d\'emploi',NULL,NULL,'job-requests','🤝',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.436','2025-12-26 00:10:40.436','cmjm48e5h0020kcd8cnf562f0'),
('cmjm48e6c0027kcd86cqj4zqi','Équipement Sportif','Équipement Sportif',NULL,NULL,'sport-gear','🏀',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.452','2025-12-26 00:10:40.452',NULL),
('cmjm48e6q002bkcd8vyrnsi2x','Livres & Musique','Livres & Musique',NULL,NULL,'books-music','🎸',NULL,NULL,0,1,NULL,'2025-12-26 00:10:40.466','2025-12-26 00:10:40.466',NULL),
('cmjm48e6z002ckcd8jn4r27vt','Autre','Autre',NULL,NULL,'other','📦',NULL,NULL,11,1,'from-gray-400 to-gray-500','2025-12-26 00:10:40.475','2025-12-26 00:10:40.475',NULL);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contactmessage`
--

DROP TABLE IF EXISTS `contactmessage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `contactmessage` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `subject` varchar(191) NOT NULL,
  `message` text NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'pending',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ContactMessage_status_idx` (`status`),
  KEY `ContactMessage_createdAt_idx` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contactmessage`
--

LOCK TABLES `contactmessage` WRITE;
/*!40000 ALTER TABLE `contactmessage` DISABLE KEYS */;
/*!40000 ALTER TABLE `contactmessage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversation`
--

DROP TABLE IF EXISTS `conversation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversation` (
  `id` varchar(191) NOT NULL,
  `listingId` varchar(191) DEFAULT NULL,
  `buyerId` varchar(191) NOT NULL,
  `sellerId` varchar(191) NOT NULL,
  `lastMessage` text DEFAULT NULL,
  `lastMessageAt` datetime(3) DEFAULT NULL,
  `unreadCount` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Conversation_buyerId_idx` (`buyerId`),
  KEY `Conversation_sellerId_idx` (`sellerId`),
  KEY `Conversation_listingId_idx` (`listingId`),
  CONSTRAINT `conversation_buyerId_fkey` FOREIGN KEY (`buyerId`) REFERENCES `user` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversation`
--

LOCK TABLES `conversation` WRITE;
/*!40000 ALTER TABLE `conversation` DISABLE KEYS */;
/*!40000 ALTER TABLE `conversation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emailconfig`
--

DROP TABLE IF EXISTS `emailconfig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `emailconfig` (
  `id` varchar(191) NOT NULL,
  `smtpHost` varchar(191) NOT NULL,
  `smtpPort` int(11) NOT NULL,
  `smtpUser` varchar(191) NOT NULL,
  `smtpPassword` text NOT NULL,
  `fromEmail` varchar(191) NOT NULL,
  `fromName` varchar(191) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 0,
  `welcomeTemplate` text DEFAULT NULL,
  `verificationTemplate` text DEFAULT NULL,
  `resetPasswordTemplate` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emailconfig`
--

LOCK TABLES `emailconfig` WRITE;
/*!40000 ALTER TABLE `emailconfig` DISABLE KEYS */;
INSERT INTO `emailconfig` VALUES
('cmjq82pw40000kc4smngy99sj','vps117186.serveur-vps.net',465,'no-reply@ivoireci.com','1834d52ff4a2a567c05c21e568cdfd98:7d2904c6ba3d1da6e0b3cff1e61b97f1','no-reply@ivoireci.com','VIDEOANNONCES-CI',1,'','','','2025-12-28 21:09:18.863','2025-12-31 00:21:25.499');
/*!40000 ALTER TABLE `emailconfig` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorite`
--

DROP TABLE IF EXISTS `favorite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorite` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `listingId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Favorite_userId_listingId_key` (`userId`,`listingId`),
  KEY `Favorite_userId_idx` (`userId`),
  KEY `Favorite_listingId_idx` (`listingId`),
  CONSTRAINT `favorite_listingId_fkey` FOREIGN KEY (`listingId`) REFERENCES `listing` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `favorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorite`
--

LOCK TABLES `favorite` WRITE;
/*!40000 ALTER TABLE `favorite` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listing`
--

DROP TABLE IF EXISTS `listing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `listing` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `price` int(11) NOT NULL,
  `category` varchar(191) NOT NULL,
  `videoUrl` varchar(191) NOT NULL,
  `thumbnailUrl` varchar(191) NOT NULL,
  `duration` int(11) NOT NULL,
  `location` varchar(191) NOT NULL,
  `quartier` varchar(191) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'active',
  `moderationStatus` varchar(191) NOT NULL DEFAULT 'pending',
  `moderatedBy` varchar(191) DEFAULT NULL,
  `moderatedAt` datetime(3) DEFAULT NULL,
  `rejectionReason` text DEFAULT NULL,
  `views` int(11) NOT NULL DEFAULT 0,
  `boosted` tinyint(1) NOT NULL DEFAULT 0,
  `boostedUntil` datetime(3) DEFAULT NULL,
  `isUrgent` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Listing_category_status_createdAt_idx` (`category`,`status`,`createdAt`),
  KEY `Listing_userId_idx` (`userId`),
  CONSTRAINT `listing_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listing`
--

LOCK TABLES `listing` WRITE;
/*!40000 ALTER TABLE `listing` DISABLE KEYS */;
INSERT INTO `listing` VALUES
('cmo21s1zb0001pi0jp3xhpxau','cmjacjyam0000kc1s95fj9pzu','LOCATION','DOUCOURE OUMAR DOIT FAIRE ',6000000,'vehicles','https://res.cloudinary.com/ddp01dqel/video/upload/v1776378306/videoboutique/listings/eab3wzrulkp6xf0jfeg0.mp4','https://res.cloudinary.com/ddp01dqel/video/upload/c_fill,g_center,h_640,w_360/v1/videoboutique/listings/eab3wzrulkp6xf0jfeg0.jpg?_a=BAMAAAfk0',0,'Abidjan','Adjamé',NULL,NULL,'active','approved','cmjacjyam0000kc1s95fj9pzu','2026-04-16 22:25:26.788',NULL,3,0,NULL,0,'2026-04-16 22:25:07.079','2026-04-16 23:05:56.313','2026-05-16 22:25:07.077');
/*!40000 ALTER TABLE `listing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `id` varchar(191) NOT NULL,
  `conversationId` varchar(191) NOT NULL,
  `listingId` varchar(191) DEFAULT NULL,
  `senderId` varchar(191) NOT NULL,
  `content` text NOT NULL,
  `type` varchar(191) NOT NULL DEFAULT 'text',
  `mediaUrl` varchar(191) DEFAULT NULL,
  `read` tinyint(1) NOT NULL DEFAULT 0,
  `audioDuration` int(11) DEFAULT NULL,
  `fileSize` int(11) DEFAULT NULL,
  `deliveredAt` datetime(3) DEFAULT NULL,
  `readAt` datetime(3) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT 0,
  `deletedAt` datetime(3) DEFAULT NULL,
  `deletedForAll` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `Message_conversationId_idx` (`conversationId`),
  KEY `Message_listingId_idx` (`listingId`),
  KEY `Message_senderId_idx` (`senderId`),
  CONSTRAINT `message_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `conversation` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `message_listingId_fkey` FOREIGN KEY (`listingId`) REFERENCES `listing` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `message_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `user` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `type` enum('MESSAGE','SALE','ORDER','REVIEW','SYSTEM') NOT NULL,
  `title` varchar(191) NOT NULL,
  `body` text NOT NULL,
  `icon` varchar(191) DEFAULT NULL,
  `url` varchar(191) DEFAULT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `read` tinyint(1) NOT NULL DEFAULT 0,
  `sent` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `Notification_userId_idx` (`userId`),
  KEY `Notification_read_idx` (`read`),
  KEY `Notification_createdAt_idx` (`createdAt`),
  CONSTRAINT `notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `amount` int(11) NOT NULL,
  `currency` varchar(191) NOT NULL DEFAULT 'XOF',
  `status` varchar(191) NOT NULL DEFAULT 'pending',
  `paymentMethod` varchar(191) NOT NULL,
  `transactionId` varchar(191) DEFAULT NULL,
  `reference` varchar(191) NOT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `adminNote` varchar(191) DEFAULT NULL,
  `paymentMethodId` varchar(191) DEFAULT NULL,
  `proofUrl` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Payment_reference_key` (`reference`),
  KEY `Payment_userId_idx` (`userId`),
  KEY `Payment_status_idx` (`status`),
  KEY `Payment_reference_idx` (`reference`),
  KEY `Payment_paymentMethodId_fkey` (`paymentMethodId`),
  CONSTRAINT `payment_paymentMethodId_fkey` FOREIGN KEY (`paymentMethodId`) REFERENCES `paymentmethod` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `payment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES
('cmjwjdasp000ds36qj3kd7kzc','cmjwjbfdk000as36qia8cbz7v',25000,'XOF','completed','WAVE','08jjbbjjjhtt','SUB-1767337925352-1cydm0lbc','{\"type\":\"subscription\",\"planId\":\"cmjfovmwo0000kc242n8ud0xd\",\"phoneNumber\":\"0759579042\",\"methodName\":\"WAVE\"}','2026-01-02 07:12:05.353','2026-01-02 07:17:15.223',NULL,'cmjfk66s30000kcr0jhv65i0y',NULL);
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paymentmessage`
--

DROP TABLE IF EXISTS `paymentmessage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `paymentmessage` (
  `id` varchar(191) NOT NULL,
  `message` text NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `bgColor` varchar(191) NOT NULL DEFAULT '#FF6B35',
  `textColor` varchar(191) NOT NULL DEFAULT '#FFFFFF',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paymentmessage`
--

LOCK TABLES `paymentmessage` WRITE;
/*!40000 ALTER TABLE `paymentmessage` DISABLE KEYS */;
INSERT INTO `paymentmessage` VALUES
('cmjhxehcz0000kcv8osnjemd1','Procédure :\n\nEffectuez le paiement via Orange Money ou Wave Money sur le numéro indiqué.\n\nConservez le reçu ou faites une capture d’écran de la transaction.\n\nEnvoyez la preuve de paiement avec votre nom et la référence de la commande.\n\nUne fois le paiement confirmé, votre commande sera traitée.',1,'#FF6B35','#FFFFFF','2025-12-23 01:48:22.498','2025-12-23 01:48:22.498');
/*!40000 ALTER TABLE `paymentmessage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paymentmethod`
--

DROP TABLE IF EXISTS `paymentmethod`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `paymentmethod` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(191) DEFAULT NULL,
  `color` varchar(191) NOT NULL DEFAULT 'from-gray-500 to-gray-600',
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `order` int(11) NOT NULL DEFAULT 0,
  `config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`config`)),
  `phoneNumber` varchar(191) DEFAULT NULL,
  `paymentLink` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `instruction` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `PaymentMethod_code_key` (`code`),
  KEY `PaymentMethod_active_idx` (`active`),
  KEY `PaymentMethod_code_idx` (`code`),
  KEY `PaymentMethod_order_idx` (`order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paymentmethod`
--

LOCK TABLES `paymentmethod` WRITE;
/*!40000 ALTER TABLE `paymentmethod` DISABLE KEYS */;
INSERT INTO `paymentmethod` VALUES
('cmjfk66s30000kcr0jhv65i0y','WAVE','wave_monney','Procédure :\n\nEffectuez le paiement via Orange Money ou Wave Money sur le numéro indiqué.\n\nConservez le reçu ou faites une capture d’écran de la transaction.\n\nEnvoyez la preuve de paiement avec votre nom et la référence de la commande.\n\nUne fois le paiement confirmé, votre commande sera traitée.','/uploads/payment-logos/payment-logo-1767141507677-s1cf99.jpg','from-gray-500 to-gray-600',1,0,'null','+2250759579042','https://pay.wave.com/m/M_ci_kAXFcuRHsGu2/c/ci/','2025-12-21 10:02:28.176','2025-12-31 07:43:07.673','BINE VENUE DAM BOUTIQUE'),
('cmjfk7vri0003kcr0wtdbgnhy','ORANGE','orange_monney','Procédure :\n\nEffectuez le paiement via Orange Money ou Wave Money sur le numéro indiqué.\n\nConservez le reçu ou faites une capture d’écran de la transaction.\n\nEnvoyez la preuve de paiement avec votre nom et la référence de la commande.\n\nUne fois le paiement confirmé, votre commande sera traitée.','/uploads/payment-logos/payment-logo-1766311427128-v7385t.png','from-gray-500 to-gray-600',1,0,'null','+2250709194318','','2025-12-21 10:03:47.214','2025-12-31 07:43:07.673',NULL),
('cmjtat3hz000us34vrfl7r5hu','Orange Money','OM','Paiement via Orange Money','🟠','from-orange-500 to-orange-600',0,1,NULL,'0700000000',NULL,'2025-12-31 00:49:07.320','2025-12-31 07:43:07.665','Composez le #144*... pour effectuer le paiement de {amount} FCFA vers le 0700000000.'),
('cmjtat3ib000vs34vikhyc016','Wave','WAVE','Paiement sans frais via Wave','🌊','from-blue-400 to-blue-500',1,2,NULL,'0700000000',NULL,'2025-12-31 00:49:07.331','2025-12-31 07:43:07.673','Envoyez {amount} FCFA vers le 0700000000 via l\'application Wave.'),
('cmjtat3ie000ws34v8t3mpgld','MTN Mobile Money','MTN','Paiement via MTN MoMo','🟡','from-yellow-400 to-yellow-500',0,3,NULL,'0500000000',NULL,'2025-12-31 00:49:07.334','2025-12-31 07:43:07.665','Composez le *133*... pour envoyer {amount} FCFA vers le 0500000000.'),
('cmjtat3ig000xs34vo1lgbo4f','Moov Money','MOOV','Paiement via Moov Money','🔵','from-blue-600 to-blue-700',0,4,NULL,'0100000000',NULL,'2025-12-31 00:49:07.336','2025-12-31 07:43:07.665','Effectuez un transfert de {amount} FCFA vers le 0100000000.');
/*!40000 ALTER TABLE `paymentmethod` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pushsubscription`
--

DROP TABLE IF EXISTS `pushsubscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `pushsubscription` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `endpoint` varchar(191) NOT NULL,
  `p256dh` varchar(191) NOT NULL,
  `auth` varchar(191) NOT NULL,
  `userAgent` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `PushSubscription_endpoint_key` (`endpoint`),
  KEY `PushSubscription_userId_idx` (`userId`),
  CONSTRAINT `pushsubscription_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pushsubscription`
--

LOCK TABLES `pushsubscription` WRITE;
/*!40000 ALTER TABLE `pushsubscription` DISABLE KEYS */;
/*!40000 ALTER TABLE `pushsubscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `id` varchar(191) NOT NULL,
  `reviewerId` varchar(191) NOT NULL,
  `reviewedId` varchar(191) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `Review_reviewerId_idx` (`reviewerId`),
  KEY `Review_reviewedId_idx` (`reviewedId`),
  CONSTRAINT `review_reviewerId_fkey` FOREIGN KEY (`reviewerId`) REFERENCES `user` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seosettings`
--

DROP TABLE IF EXISTS `seosettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `seosettings` (
  `id` varchar(191) NOT NULL,
  `defaultTitle` varchar(191) DEFAULT NULL,
  `defaultDescription` text DEFAULT NULL,
  `defaultKeywords` text DEFAULT NULL,
  `ogImage` varchar(191) DEFAULT NULL,
  `ogType` varchar(191) DEFAULT 'website',
  `twitterHandle` varchar(191) DEFAULT NULL,
  `twitterCardType` varchar(191) DEFAULT 'summary_large_image',
  `googleAnalyticsId` varchar(191) DEFAULT NULL,
  `googleTagManagerId` varchar(191) DEFAULT NULL,
  `facebookPixelId` varchar(191) DEFAULT NULL,
  `sitemapEnabled` tinyint(1) NOT NULL DEFAULT 1,
  `robotsTxt` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seosettings`
--

LOCK TABLES `seosettings` WRITE;
/*!40000 ALTER TABLE `seosettings` DISABLE KEYS */;
INSERT INTO `seosettings` VALUES
('cmjja39ga0003kc78drszw7a0','Petites annonces vidéo en Côte d’Ivoire | IvoireCI','Publiez et découvrez des petites annonces 100% vidéo en Côte d’Ivoire. Achetez, vendez et promouvez vos produits facilement sur IvoireCI.','petites annonces vidéo, annonces vidéo Côte d’Ivoire, marketplace vidéo CI, vendre en vidéo, annonces Abidjan',NULL,'website',NULL,'summary_large_image',NULL,NULL,NULL,1,'User-agent: *\nAllow: /\n\nSitemap: https://ivoireci.com/sitemap.xml\n','2025-12-24 00:31:20.219','2026-01-01 23:36:11.053');
/*!40000 ALTER TABLE `seosettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `setting`
--

DROP TABLE IF EXISTS `setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `setting` (
  `id` varchar(191) NOT NULL,
  `key` varchar(191) NOT NULL,
  `value` text NOT NULL,
  `description` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Setting_key_key` (`key`),
  KEY `Setting_key_idx` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `setting`
--

LOCK TABLES `setting` WRITE;
/*!40000 ALTER TABLE `setting` DISABLE KEYS */;
INSERT INTO `setting` VALUES
('cmjjnp1p00000kcowvc0d1npb','i18n_settings','{\"multiLanguageEnabled\":false,\"availableLanguages\":[\"fr\"],\"defaultLanguage\":\"fr\",\"autoDetect\":true}',NULL,'2025-12-24 06:52:11.599','2025-12-27 11:30:56.423'),
('cmjjytyhj0000kckg4r5oipl2','homepage_banner','{\"enabled\":true,\"slides\":[]}','Configuration de la bannière de la page d\'accueil','2025-12-24 12:03:56.502','2025-12-25 20:00:22.430'),
('cmo209fny0000p70jpc5pg42f','platform.solo_mode_enabled','false','Mode Solo : Seul l’administrateur peut publier des annonces','2026-04-16 21:42:38.729','2026-04-16 22:29:22.538'),
('plat3c89e45f-3929-11f1-b','platform.public_registration_enabled','false','Inscription publique activee','2026-04-16 00:14:28.928','2026-04-16 22:29:23.346'),
('plat3c8d992f-3929-11f1-b','platform.signup_default_vendor','false','Nouveaux comptes crees comme vendeur','2026-04-16 00:14:28.960','2026-04-16 22:29:24.196');
/*!40000 ALTER TABLE `setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sitesettings`
--

DROP TABLE IF EXISTS `sitesettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sitesettings` (
  `id` varchar(191) NOT NULL,
  `siteName` varchar(191) NOT NULL DEFAULT 'VideoBoutique',
  `siteSlogan` varchar(191) DEFAULT NULL,
  `siteDescription` text DEFAULT NULL,
  `heroTitle` text DEFAULT NULL,
  `heroSubtitle` text DEFAULT NULL,
  `urgentSectionTitle` varchar(191) DEFAULT 'Annonces Urgentes',
  `recentSectionTitle` varchar(191) DEFAULT 'Annonces Récentes',
  `shopsSectionTitle` varchar(191) DEFAULT 'Boutiques Premium',
  `logo` varchar(191) DEFAULT NULL,
  `favicon` varchar(191) DEFAULT NULL,
  `contactEmail` varchar(191) DEFAULT NULL,
  `contactPhone` varchar(191) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `socialFacebook` varchar(191) DEFAULT NULL,
  `socialTwitter` varchar(191) DEFAULT NULL,
  `socialInstagram` varchar(191) DEFAULT NULL,
  `socialLinkedIn` varchar(191) DEFAULT NULL,
  `socialYouTube` varchar(191) DEFAULT NULL,
  `socialTikTok` varchar(191) DEFAULT NULL,
  `maintenanceMode` tinyint(1) NOT NULL DEFAULT 0,
  `maintenanceMessage` text DEFAULT NULL,
  `homeLayout` varchar(191) NOT NULL DEFAULT 'modern',
  `dashboardLayout` varchar(191) NOT NULL DEFAULT 'nebula',
  `primaryColor` varchar(191) NOT NULL DEFAULT '#FF6B35',
  `secondaryColor` varchar(191) NOT NULL DEFAULT '#F7931E',
  `accentColor` varchar(191) NOT NULL DEFAULT '#FDC830',
  `enableAIDescriptionGenerator` tinyint(1) NOT NULL DEFAULT 1,
  `homepageSections` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`homepageSections`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `backgroundColor` varchar(191) NOT NULL DEFAULT '#FFF7ED',
  `footerColor` varchar(191) NOT NULL DEFAULT '#FFFFFF',
  `footerTextColor` varchar(191) NOT NULL DEFAULT '#000000',
  `headerColor` varchar(191) NOT NULL DEFAULT '#FFFFFF',
  `headerTextColor` varchar(191) NOT NULL DEFAULT '#000000',
  `recentBgColor` varchar(191) NOT NULL DEFAULT '#FFFFFF',
  `recentTextColor` varchar(191) NOT NULL DEFAULT '#000000',
  `shopsBgColor` varchar(191) NOT NULL DEFAULT '#FFFFFF',
  `shopsTextColor` varchar(191) NOT NULL DEFAULT '#000000',
  `urgentBgColor` varchar(191) NOT NULL DEFAULT '#FFFFFF',
  `urgentTextColor` varchar(191) NOT NULL DEFAULT '#000000',
  `pwaIcon` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sitesettings`
--

LOCK TABLES `sitesettings` WRITE;
/*!40000 ALTER TABLE `sitesettings` DISABLE KEYS */;
INSERT INTO `sitesettings` VALUES
('cmja9rbrj0000kcpglvfs96x2','','','','Petites annonces vidéo en Côte d’Ivoire |','','','','','/uploads/banners/banner-1767313376739-x3ag6v.png','','','','','','','','','','',0,'','cosmic','nebula','#FF6B35','#F7931E','#FDC830',1,'null','2025-12-17 17:12:07.759','2026-04-16 17:45:25.384','#FFF7ED','#FFFFFF','#000000','#FFFFFF','#000000','#FFFFFF','#000000','#FFFFFF','#000000','#FFFFFF','#000000',NULL);
/*!40000 ALTER TABLE `sitesettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscription`
--

DROP TABLE IF EXISTS `subscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscription` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `plan` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'active',
  `startDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `endDate` datetime(3) DEFAULT NULL,
  `autoRenew` tinyint(1) NOT NULL DEFAULT 1,
  `paymentMethodId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Subscription_userId_key` (`userId`),
  KEY `Subscription_userId_idx` (`userId`),
  KEY `Subscription_status_idx` (`status`),
  CONSTRAINT `subscription_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscription`
--

LOCK TABLES `subscription` WRITE;
/*!40000 ALTER TABLE `subscription` DISABLE KEYS */;
/*!40000 ALTER TABLE `subscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriptionplan`
--

DROP TABLE IF EXISTS `subscriptionplan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriptionplan` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `price` int(11) NOT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`features`)),
  `maxListings` int(11) DEFAULT NULL,
  `maxVideosPerListing` int(11) DEFAULT 1,
  `maxVideoDuration` int(11) DEFAULT NULL,
  `allowSubdomain` tinyint(1) NOT NULL DEFAULT 0,
  `allowCustomDomain` tinyint(1) NOT NULL DEFAULT 0,
  `allowLiveStreaming` tinyint(1) NOT NULL DEFAULT 0,
  `allowStories` tinyint(1) NOT NULL DEFAULT 0,
  `priority` int(11) NOT NULL DEFAULT 0,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `popular` tinyint(1) NOT NULL DEFAULT 0,
  `color` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `SubscriptionPlan_slug_key` (`slug`),
  KEY `SubscriptionPlan_slug_idx` (`slug`),
  KEY `SubscriptionPlan_active_idx` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriptionplan`
--

LOCK TABLES `subscriptionplan` WRITE;
/*!40000 ALTER TABLE `subscriptionplan` DISABLE KEYS */;
INSERT INTO `subscriptionplan` VALUES
('cmjfovmwo0000kc242n8ud0xd','Pro','pro','Plan professionnel avec toutes les fonctionnalités premium : domaine personnalisé, annonces illimitées, live streaming, stories et support prioritaire.',25000,'[\"Annonces illimitées\", \"Vidéos jusqu\'à 5 minutes\", \"Sous-domaine personnalisé (votreboutique.videoboutique.com)\", \"Stories 24h illimitées\", \"Badge \\\"PRO\\\" sur votre profil\", \"Statistiques avancées\", \"Support prioritaire 24/7\", \"Pas de publicités\"]',NULL,10,1,1,0,1,1,1,1,1,'#FF6B35','2025-12-21 12:14:13.943','2025-12-22 12:16:25.886');
/*!40000 ALTER TABLE `subscriptionplan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `systemlog`
--

DROP TABLE IF EXISTS `systemlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `systemlog` (
  `id` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL,
  `action` varchar(191) NOT NULL,
  `message` text NOT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `userId` varchar(191) DEFAULT NULL,
  `ipAddress` varchar(191) DEFAULT NULL,
  `userAgent` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `SystemLog_type_idx` (`type`),
  KEY `SystemLog_category_idx` (`category`),
  KEY `SystemLog_createdAt_idx` (`createdAt`),
  KEY `SystemLog_userId_idx` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `systemlog`
--

LOCK TABLES `systemlog` WRITE;
/*!40000 ALTER TABLE `systemlog` DISABLE KEYS */;
INSERT INTO `systemlog` VALUES
('cmjj8o1d60000kc781emkq1c3','info','system','update_site_settings','Paramètres du site mis à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-23 23:51:30.281'),
('cmjj8okwo0001kc78wreicdi1','info','system','update_site_settings','Paramètres du site mis à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-23 23:51:55.608'),
('cmjj8p0b20002kc78dmestp0n','info','system','update_site_settings','Paramètres du site mis à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-23 23:52:15.566'),
('cmjjzg3qp0001kckgo00z4ply','warning','admin','category_deleted','Catégorie \"Sports & Loisirs\" supprimée','{\"categoryId\": \"cmjjcm97t0007kcqofj50lvzl\"}','cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-24 12:21:09.744'),
('cmjlv9rw30002kchssfye5n5e','info','system','update_site_settings','Paramètres du site mis à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-25 19:59:48.340'),
('cmjm4plp90000kc5khmyj5qj9','warning','admin','category_deleted','Catégorie \"Loisirs & Jeux\" supprimée','{\"categoryId\": \"cmjm48e6i0029kcd80o4k79q2\"}','cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-26 00:24:03.356'),
('cmjm4q0so0001kc5k4oge9zge','warning','admin','category_deleted','Catégorie \"Sports & Loisirs\" supprimée','{\"categoryId\": \"cmjm48e650025kcd8g1kc7umh\"}','cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-26 00:24:22.920'),
('cmjnm54fg0000kcu4g0yqpj1g','info','system','update_site_settings','Paramètres du site mis à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-27 01:19:47.115'),
('cmjnmaxnt0001kcu4nloqolti','info','system','update_site_settings','Paramètres du site mis à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-27 01:24:18.282'),
('cmjnmfc9o0002kcu4c2rv6b43','info','system','update_site_settings','Paramètres du site mis à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-27 01:27:43.836'),
('cmjnmkm6m0003kcu4og4bzbr8','info','system','update_site_settings','Paramètres du site mis à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-27 01:31:49.966'),
('cmjnmq7ir0004kcu4g9z8b703','info','system','update_site_settings','Paramètres du site mis à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-27 01:36:10.899'),
('cmjnmw8aw0005kcu4kyb7zesi','info','system','update_site_settings','Paramètres du site mis à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-27 01:40:51.848'),
('cmjnmwsjf0006kcu4zvxnq9l6','info','system','update_site_settings','Paramètres du site mis à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-27 01:41:18.075'),
('cmjnn049g0007kcu46z2oayrj','info','system','update_site_settings','Paramètres du site mis à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-27 01:43:53.236'),
('cmjo7ygzs0000kcdsmtiok0ya','info','system','update_site_settings','Paramètres du site mis à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-27 11:30:28.359'),
('cmjq82px00001kc4ssipebmfp','info','system','update_email_config','Configuration email mise à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-28 21:09:18.900'),
('cmjq82tql0002kc4sam96a7mm','error','email','test_email_failed','Échec du test email: Hostname/IP does not match certificate\'s altnames: Host: mail.ivoireci.com. is not in the cert\'s altnames: DNS:vps117186.serveur-vps.net',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-28 21:09:23.853'),
('cmjq832rs0003kc4s6hvmvm48','info','system','update_email_config','Configuration email mise à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-28 21:09:35.560'),
('cmjq83sd60004kc4smsq1lxvo','error','email','test_email_failed','Échec du test email: connect ETIMEDOUT 185.98.136.40:464',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-28 21:10:08.729'),
('cmjq84nhq0005kc4sbsjc4lfu','error','email','test_email_failed','Échec du test email: connect ETIMEDOUT 185.98.136.40:464',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-28 21:10:49.069'),
('cmjq85a9s0006kc4sghpmr7v6','error','email','test_email_failed','Échec du test email: connect ETIMEDOUT 185.98.136.40:464',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-28 21:11:18.592'),
('cmjq85vi90007kc4s9a5lqfab','error','email','test_email_failed','Échec du test email: connect ETIMEDOUT 185.98.136.40:464',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-28 21:11:46.113'),
('cmjq87wx10008kc4s6j4uzzuw','info','system','update_email_config','Configuration email mise à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-28 21:13:21.253'),
('cmjq88gef0009kc4scm7j6sn9','error','email','test_email_failed','Échec du test email: connect ETIMEDOUT 185.98.136.40:585',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-28 21:13:46.502'),
('cmjq99uyl000akc4sdcogqhzj','info','system','update_email_config','Configuration email mise à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-28 21:42:51.645'),
('cmjq99yag000bkc4sngcnuwsp','success','email','test_email','Email de test envoyé à oumar01doucoure01@gmail.com',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-28 21:42:55.960'),
('cmjqghgq50004kcg0auanst8q','info','system','update_email_config','Configuration email mise à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-29 01:04:43.757'),
('cmjqghtvz0005kcg0gefbffuv','success','email','test_email','Email de test envoyé à OUMAR01DOUCOURE01@GMAIL.COM',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-29 01:05:00.816'),
('cmjqu84jl0000kc14j2jgytfy','info','system','update_email_config','Configuration email mise à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-29 07:29:22.688'),
('cmjqu8khz0001kc14kw8036qb','error','email','test_email_failed','Échec du test email: Invalid login: 535 5.7.8 Error: authentication failed: (reason unavailable)',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-29 07:29:43.367'),
('cmjqu8qcv0002kc148i9xcii7','info','system','update_email_config','Configuration email mise à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-29 07:29:50.960'),
('cmjqu8wt00003kc14r4ffuia8','error','email','test_email_failed','Échec du test email: Invalid login: 535 5.7.8 Error: authentication failed: (reason unavailable)',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-29 07:29:59.316'),
('cmjquanzb0004kc145wtroxgl','error','email','test_email_failed','Échec du test email: Invalid login: 535 5.7.8 Error: authentication failed: (reason unavailable)',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-29 07:31:21.191'),
('cmjqud9ed0005kc14iom6cvu9','info','system','update_email_config','Configuration email mise à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-29 07:33:22.261'),
('cmjquddpy0006kc14z8zac6ao','error','email','test_email_failed','Échec du test email: Invalid login: 535 5.7.8 Error: authentication failed: (reason unavailable)',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-29 07:33:27.862'),
('cmjquik420007kc14w9v6kviu','success','email','test_email','Email de test envoyé à doucourebusinesspro@gmail.com',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-29 07:37:29.425'),
('cmjquir4f0008kc14854zht9q','success','email','test_email','Email de test envoyé à doucourebusinesspro@gmail.com',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-29 07:37:38.511'),
('cmjt9th8p0000s3eouc9qwrbi','info','system','update_email_config','Configuration email mise à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-31 00:21:25.514'),
('cmjt9tiye0001s3eomwhyz2z8','success','email','test_email','Email de test envoyé à doucourebusinesspro@gmail.com',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2025-12-31 00:21:27.735'),
('cmjv1zvm20002s3hp17fhmnjn','info','system','clean_logs','0 logs supprimés (plus de 90 jours)',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2026-01-01 06:17:59.497'),
('cmjw2k1k90000s36qw2isvxpk','info','system','update_site_settings','Paramètres du site mis à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2026-01-01 23:21:26.501'),
('cmjw2mnmz0001s36q1ur0stis','info','system','update_site_settings','Paramètres du site mis à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2026-01-01 23:23:28.428'),
('cmjw2zrob0002s36qpghepp2s','info','system','update_seo_settings','Configuration SEO mise à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2026-01-01 23:33:40.188'),
('cmjw330340003s36qe9tx6zai','info','system','update_seo_settings','Configuration SEO mise à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2026-01-01 23:36:11.056'),
('cmjw3o2vk0004s36qdnhxa07a','info','system','update_site_settings','Paramètres du site mis à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2026-01-01 23:52:34.449'),
('cmjw3stwf0005s36q49s5rnrm','info','system','update_site_settings','Paramètres du site mis à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2026-01-01 23:56:16.095'),
('cmjw3u4jh0006s36qd7n3jv8f','info','system','update_site_settings','Paramètres du site mis à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2026-01-01 23:57:16.541'),
('cmjw4qqb70007s36q1abs5h78','info','system','update_site_settings','Paramètres du site mis à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2026-01-02 00:22:37.747'),
('cmjw4qs220008s36qz03qnh42','info','system','update_site_settings','Paramètres du site mis à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2026-01-02 00:22:40.011'),
('cmjw4r7bz0009s36qc44zc7yc','info','system','update_site_settings','Paramètres du site mis à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2026-01-02 00:22:59.808'),
('cmo1rsd5s0006ti0k7x0h653s','info','system','update_site_settings','Paramètres du site mis à jour',NULL,'cmjacjyam0000kc1s95fj9pzu',NULL,NULL,'2026-04-16 17:45:25.408');
/*!40000 ALTER TABLE `systemlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `systemsettings`
--

DROP TABLE IF EXISTS `systemsettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `systemsettings` (
  `id` varchar(191) NOT NULL,
  `key` varchar(191) NOT NULL,
  `value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`value`)),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `SystemSettings_key_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `systemsettings`
--

LOCK TABLES `systemsettings` WRITE;
/*!40000 ALTER TABLE `systemsettings` DISABLE KEYS */;
/*!40000 ALTER TABLE `systemsettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(191) NOT NULL,
  `phone` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) DEFAULT NULL,
  `password` varchar(191) NOT NULL,
  `avatar` varchar(191) DEFAULT NULL,
  `language` varchar(191) NOT NULL DEFAULT 'fr',
  `verified` tinyint(1) NOT NULL DEFAULT 0,
  `premium` tinyint(1) NOT NULL DEFAULT 0,
  `premiumUntil` datetime(3) DEFAULT NULL,
  `isPremium` tinyint(1) NOT NULL DEFAULT 0,
  `premiumTier` varchar(191) NOT NULL DEFAULT 'free',
  `role` varchar(191) NOT NULL DEFAULT 'USER',
  `isVendor` tinyint(1) NOT NULL DEFAULT 0,
  `suspended` tinyint(1) NOT NULL DEFAULT 0,
  `suspendedUntil` datetime(3) DEFAULT NULL,
  `suspendedReason` text DEFAULT NULL,
  `subdomain` varchar(191) DEFAULT NULL,
  `customDomain` varchar(191) DEFAULT NULL,
  `bannerUrl` varchar(191) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `shopTheme` varchar(191) NOT NULL DEFAULT 'default',
  `socialLinks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`socialLinks`)),
  `videoUrl` varchar(191) DEFAULT NULL,
  `whatsappNumber` varchar(191) DEFAULT NULL,
  `galleryImages` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`galleryImages`)),
  `testimonials` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`testimonials`)),
  `trustBadges` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`trustBadges`)),
  `fontFamily` varchar(191) DEFAULT 'inter',
  `activePromotion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`activePromotion`)),
  `aboutSection` text DEFAULT NULL,
  `customColors` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`customColors`)),
  `logoUrl` varchar(191) DEFAULT NULL,
  `businessHours` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`businessHours`)),
  `shopLayout` varchar(191) NOT NULL DEFAULT 'mobile-first',
  `rating` double NOT NULL DEFAULT 0,
  `totalRatings` int(11) NOT NULL DEFAULT 0,
  `totalSales` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `backgroundUrl` varchar(191) DEFAULT NULL,
  `aiReplyEnabled` tinyint(1) NOT NULL DEFAULT 1,
  `seoDescription` text DEFAULT NULL,
  `seoKeywords` text DEFAULT NULL,
  `seoTitle` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_phone_key` (`phone`),
  UNIQUE KEY `User_email_key` (`email`),
  UNIQUE KEY `User_subdomain_key` (`subdomain`),
  UNIQUE KEY `User_customDomain_key` (`customDomain`),
  KEY `User_phone_idx` (`phone`),
  KEY `User_email_idx` (`email`),
  KEY `User_subdomain_idx` (`subdomain`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES
('cmjacjyam0000kc1s95fj9pzu','0123456789','doucoure oumar','douckabusiness@gmail.com','$2b$10$mDA5QzGNH73i.G5SH8z5.OruGba9WnqXXMgXFyJLII0zSvmomHMEW',NULL,'fr',1,1,NULL,0,'free','ADMIN',1,0,NULL,NULL,'annoncesvideoci',NULL,NULL,NULL,'default',NULL,NULL,'+2250709194318',NULL,NULL,NULL,'inter',NULL,NULL,NULL,NULL,NULL,'mobile-first',0,0,0,'2025-12-17 18:30:22.558','2026-04-17 00:01:01.471',NULL,1,NULL,NULL,NULL),
('cmjwjbfdk000as36qia8cbz7v','0759579042','Oumar doucoure','oumardoucoure2019@gmail.com','$2b$10$GfFZNbryZ3yTR5ueuPJMj.PwPd.F96f5Dxp.RFjEkSeI.eCr7TyX2',NULL,'fr',1,1,NULL,0,'free','ADMIN',1,0,NULL,NULL,'autobusiness',NULL,'/uploads/banners/banner-1776353445360-9k2dae.png','','default','{\"facebook\":\"\",\"instagram\":\"\",\"youtube\":\"\",\"tiktok\":\"\"}','','',NULL,NULL,'[]','inter',NULL,'','{\"primary\":\"#10B981\",\"secondary\":\"#059669\"}','/uploads/logos/logo-1776353452180-bgzltb.png','{\"monday\":{\"open\":\"09:00\",\"close\":\"18:00\",\"closed\":false},\"tuesday\":{\"open\":\"09:00\",\"close\":\"18:00\",\"closed\":false},\"wednesday\":{\"open\":\"09:00\",\"close\":\"18:00\",\"closed\":false},\"thursday\":{\"open\":\"09:00\",\"close\":\"18:00\",\"closed\":false},\"friday\":{\"open\":\"09:00\",\"close\":\"18:00\",\"closed\":false},\"saturday\":{\"open\":\"10:00\",\"close\":\"16:00\",\"closed\":false},\"sunday\":{\"open\":\"\",\"close\":\"\",\"closed\":true}}','marketplace',0,0,0,'2026-01-02 07:10:37.966','2026-04-16 19:27:36.656','',0,NULL,NULL,NULL),
('cmjwlzck0000ks36qw0iz9odt','0140454545','Jejrjrjuru','12345oumar12@gmail.com','$2b$10$k9DSW0uRd5XQov18mc9mBur2kn.wGt7mHt7sOzhhC1f.eqA4/V.g6',NULL,'fr',1,0,NULL,0,'free','ADMIN',1,0,NULL,NULL,NULL,NULL,NULL,NULL,'default',NULL,NULL,NULL,NULL,NULL,NULL,'inter',NULL,NULL,NULL,NULL,NULL,'mobile-first',0,0,0,'2026-01-02 08:25:13.290','2026-04-16 19:27:36.656',NULL,1,NULL,NULL,NULL),
('cmo1dvy3w0002mm0jdgiibq58','0510101010','Oumar Doucoure','doucourebusinesspro@gmail.com','$2b$10$Q8sdYIsm35ABpv2CRSK2M.Ykj8LCEiMGZ5LBArXc2vlWuNObnsx42',NULL,'fr',1,0,NULL,0,'free','ADMIN',1,0,NULL,NULL,NULL,NULL,NULL,NULL,'default',NULL,NULL,NULL,NULL,NULL,NULL,'inter',NULL,NULL,NULL,NULL,NULL,'mobile-first',0,0,0,'2026-04-16 11:16:17.900','2026-04-16 19:27:36.656',NULL,1,NULL,NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userbadge`
--

DROP TABLE IF EXISTS `userbadge`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `userbadge` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `badgeType` enum('VERIFIED','TOP_SELLER','FAST_RESPONDER','PREMIUM','NEW_SELLER','TRUSTED','EXPERT') NOT NULL,
  `awardedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `expiresAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UserBadge_userId_badgeType_key` (`userId`,`badgeType`),
  KEY `UserBadge_userId_idx` (`userId`),
  KEY `UserBadge_badgeType_fkey` (`badgeType`),
  CONSTRAINT `userbadge_badgeType_fkey` FOREIGN KEY (`badgeType`) REFERENCES `badge` (`type`) ON UPDATE CASCADE,
  CONSTRAINT `userbadge_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userbadge`
--

LOCK TABLES `userbadge` WRITE;
/*!40000 ALTER TABLE `userbadge` DISABLE KEYS */;
/*!40000 ALTER TABLE `userbadge` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verificationcode`
--

DROP TABLE IF EXISTS `verificationcode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `verificationcode` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `used` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `VerificationCode_email_code_idx` (`email`,`code`),
  KEY `VerificationCode_expiresAt_idx` (`expiresAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verificationcode`
--

LOCK TABLES `verificationcode` WRITE;
/*!40000 ALTER TABLE `verificationcode` DISABLE KEYS */;
INSERT INTO `verificationcode` VALUES
('cmjq9jdpn000dkc4sgtp0xwle','12345oumar12@gmail.com','732575','EMAIL_VERIFICATION','2025-12-28 22:05:15.846',0,'2025-12-28 21:50:15.851'),
('cmjq9qfy5000fkc4sjxbngrmv','12345kadara123@gmail.com','830751','EMAIL_VERIFICATION','2025-12-28 22:10:45.339',1,'2025-12-28 21:55:45.341'),
('cmjq9ve2d000gkc4sc0093qhi','12345kadara123@gmail.com','985610','EMAIL_VERIFICATION','2025-12-28 22:14:36.177',0,'2025-12-28 21:59:36.181'),
('cmjqfh9cz0001kcg0f7lh50r9','oumarbcoulou235@gmail.com','644669','EMAIL_VERIFICATION','2025-12-29 00:51:34.592',1,'2025-12-29 00:36:34.595'),
('cmjqfsvcq0002kcg0y0s99zqr','oumarbcoulou235@gmail.com','550548','EMAIL_VERIFICATION','2025-12-29 01:00:36.313',1,'2025-12-29 00:45:36.315'),
('cmjqg99au0003kcg0x1s19p9g','oumarbcoulou235@gmail.com','844555','EMAIL_VERIFICATION','2025-12-29 01:13:20.885',1,'2025-12-29 00:58:20.886'),
('cmjqgia050006kcg0idlhvn56','oumarbcoulou235@gmail.com','589214','EMAIL_VERIFICATION','2025-12-29 01:20:21.699',0,'2025-12-29 01:05:21.701'),
('cmjqhbbm90008kcg0oymsh6sh','oumarbcoulou235@gmail.com','678853','EMAIL_VERIFICATION','2025-12-29 01:42:56.814',0,'2025-12-29 01:27:56.817'),
('cmjqi9wa60001kcus386687cy','doucourebusinesspro@gmail.com','277909','EMAIL_VERIFICATION','2025-12-29 02:09:49.899',1,'2025-12-29 01:54:49.903'),
('cmjqigrk20002kcusx55j4aco','doucourebusinesspro@gmail.com','427413','EMAIL_VERIFICATION','2025-12-29 02:15:10.368',1,'2025-12-29 02:00:10.370'),
('cmjquk9o7000akc144likwjcq','doucourebusinesspro@gmail.com','257895','EMAIL_VERIFICATION','2025-12-29 07:53:49.200',1,'2025-12-29 07:38:49.207'),
('cmjquuv21000bkc14uvnrjthj','doucourebusinesspro@gmail.com','784807','EMAIL_VERIFICATION','2025-12-29 08:02:03.479',1,'2025-12-29 07:47:03.481'),
('cmjquxqrx000ckc145gs0ikw5','doucourebusinesspro@gmail.com','624571','EMAIL_VERIFICATION','2025-12-29 08:04:17.900',0,'2025-12-29 07:49:17.902'),
('cmjqvhb9c0001kcso8rnnsde0','doucourebusinesspro@gmail.com','927007','EMAIL_VERIFICATION','2025-12-29 08:19:30.909',1,'2025-12-29 08:04:30.912'),
('cmjqyt51j0001kcv00d6loqr5','12345doucoure12@gmail.com','895199','EMAIL_VERIFICATION','2025-12-29 09:52:41.572',1,'2025-12-29 09:37:41.575'),
('cmjqyyut50002kcv0d794rfsf','12345doucoure12@gmail.com','238466','EMAIL_VERIFICATION','2025-12-29 09:57:08.246',1,'2025-12-29 09:42:08.250'),
('cmjqz10v10004kcv05m06tcqm','doumar1222@gmail.com','582943','EMAIL_VERIFICATION','2025-12-29 09:58:49.402',1,'2025-12-29 09:43:49.405'),
('cmjqz2hs70005kcv071an7ir9','doumar1222@gmail.com','369558','EMAIL_VERIFICATION','2025-12-29 09:59:57.989',0,'2025-12-29 09:44:57.992'),
('cmjqzsumi0007kcv0y6el8qe2','doumar1222@gmail.com','271693','EMAIL_VERIFICATION','2025-12-29 10:20:27.689',1,'2025-12-29 10:05:27.691'),
('cmjta8bpq0007s3eo1tgim3up','doucourebusinesspro@gmail.com','207990','EMAIL_VERIFICATION','2025-12-31 00:47:58.190',1,'2025-12-31 00:32:58.191'),
('cmjvcb2yu0004s3hpys4jgzj5','12345doucoure12@gmail.com','245915','EMAIL_VERIFICATION','2026-01-01 11:21:38.405',1,'2026-01-01 11:06:38.406'),
('cmjwjbfe2000bs36qjmycc1ur','oumardoucoure2019@gmail.com','157203','EMAIL_VERIFICATION','2026-01-02 07:25:37.993',1,'2026-01-02 07:10:37.994'),
('cmjwlzcka000ls36qehgsy5lz','12345oumar12@gmail.com','514341','EMAIL_VERIFICATION','2026-01-02 08:40:13.305',0,'2026-01-02 08:25:13.306'),
('cmo1dvy470003mm0j2fp7iwcg','doucourebusinesspro@gmail.com','160847','EMAIL_VERIFICATION','2026-04-16 11:31:17.910',0,'2026-04-16 11:16:17.911');
/*!40000 ALTER TABLE `verificationcode` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-04-17  6:22:43
