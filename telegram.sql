-- MySQL dump 10.13  Distrib 5.7.19, for Linux (x86_64)
--
-- Host: localhost    Database: telegram
-- ------------------------------------------------------
-- Server version	5.7.19-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chatId` varchar(500) NOT NULL,
  `balance` double NOT NULL,
  `status` text NOT NULL,
  `dailyMax` double NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `chatId` (`chatId`)
) ENGINE=InnoDB AUTO_INCREMENT=120 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES (1,'322639755',0.0282752,'active',0.0077247999999999995),(2,'301102955',0.07068800000000001,'active',0.009312),(3,'353112872',0,'frozen',0),(4,'351983507',0,'frozen',0),(5,'443850897',0,'frozen',0),(6,'314292067',0,'frozen',0),(7,'446247627',0,'frozen',0),(8,'416074546',0,'frozen',0),(9,'424096326',0,'frozen',0),(10,'216092858',0,'frozen',0),(11,'367562010',0,'frozen',0),(12,'445053335',0,'frozen',0),(13,'440570940',0,'frozen',0),(14,'423629055',0,'frozen',0),(15,'314106806',0,'frozen',0),(16,'322988021',0,'frozen',0),(17,'399524758',0,'frozen',0),(18,'411605806',0,'frozen',0),(19,'335856705',0,'frozen',0),(20,'387738351',0,'frozen',0),(21,'386233430',0,'frozen',0),(22,'339528614',0,'frozen',0),(23,'279588080',0,'frozen',0),(24,'174148156',0,'frozen',0),(25,'418228984',0,'frozen',0),(26,'429034770',0,'frozen',0),(27,'392217261',0,'frozen',0),(28,'305342195',0,'frozen',0),(29,'58310247',0,'frozen',0),(30,'319860803',0,'frozen',0),(31,'308479934',0,'frozen',0),(32,'393128858',0,'frozen',0),(33,'406002295',0,'frozen',0),(34,'295682924',0,'frozen',0),(35,'394302476',0,'frozen',0),(36,'317513662',0,'frozen',0),(37,'214822886',0,'frozen',0),(38,'330023755',0,'frozen',0),(39,'378041853',0,'frozen',0),(40,'339250979',0,'frozen',0),(41,'338206360',0,'frozen',0),(42,'306099889',0,'frozen',0),(43,'395163794',0,'frozen',0),(44,'417109471',0,'frozen',0),(45,'382004158',0,'frozen',0),(46,'306248055',0,'frozen',0),(47,'446404237',0,'frozen',0),(48,'436457707',0,'frozen',0),(49,'384215947',0,'frozen',0),(50,'138562972',0,'frozen',0),(51,'353133423',0,'frozen',0),(52,'383602526',0,'frozen',0),(53,'189441379',0,'frozen',0),(54,'447934223',0,'frozen',0),(55,'293762700',0,'frozen',0),(56,'375069292',0,'frozen',0),(57,'412479075',0,'frozen',0),(58,'427267945',0,'frozen',0),(59,'188500176',0,'frozen',0),(60,'172767908',0,'frozen',0),(61,'441223026',0,'frozen',0),(62,'317344864',0,'frozen',0),(63,'437379237',0,'frozen',0),(64,'309366247',0,'frozen',0),(65,'240291406',0,'frozen',0),(66,'429624652',0,'frozen',0),(67,'370039604',0,'frozen',0),(68,'113130019',0,'frozen',0),(69,'72247631',0,'frozen',0),(70,'378707538',0,'frozen',0),(71,'375870461',0,'frozen',0),(72,'373251199',0,'frozen',0),(73,'405018322',0,'frozen',0),(74,'377766004',0,'frozen',0),(75,'279245971',0,'frozen',0),(76,'305888619',0,'frozen',0),(77,'418011806',0,'frozen',0),(78,'354383660',0,'frozen',0),(79,'188379397',0,'frozen',0),(80,'380059968',0,'frozen',0),(81,'399656801',0,'frozen',0),(82,'306973806',0,'frozen',0),(83,'399346420',0,'frozen',0),(84,'336079270',0,'frozen',0),(85,'162211201',0,'frozen',0),(86,'420492218',0,'frozen',0),(87,'357164267',0,'frozen',0),(88,'422887364',0,'frozen',0),(89,'424595809',0,'frozen',0),(90,'376021149',0,'frozen',0),(91,'397064477',0,'frozen',0),(92,'419751662',0,'frozen',0),(93,'435053817',0,'frozen',0),(94,'338121029',0,'frozen',0),(95,'342878469',0,'frozen',0),(96,'391664180',0,'frozen',0),(97,'447503047',0,'frozen',0),(98,'249775139',0,'frozen',0),(99,'404033313',0,'frozen',0),(100,'329742334',0,'frozen',0),(101,'348469554',0,'frozen',0),(102,'356156452',0,'frozen',0),(103,'318361086',0,'frozen',0),(104,'378961378',0,'frozen',0),(105,'257812010',0,'frozen',0),(106,'359887800',0,'frozen',0),(107,'422875503',0,'frozen',0),(108,'424706792',0,'frozen',0),(109,'347999746',0,'frozen',0),(110,'381670155',0,'frozen',0),(111,'354582257',0,'frozen',0),(112,'446542896',0,'frozen',0),(113,'303715775',0,'frozen',0),(114,'353290480',0,'frozen',0),(115,'364415607',0,'frozen',0),(116,'395817911',0,'frozen',0),(117,'172623681',0,'frozen',0),(118,'348739745',0,'frozen',0),(119,'304841167',0,'frozen',0);
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `address` text NOT NULL,
  `status` text NOT NULL,
  `amount` double NOT NULL,
  `created_at` text NOT NULL,
  `callback_url` text NOT NULL,
  `uuid` text NOT NULL,
  `user` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'bec594ca-6ab2-4bb0-ac61-cc3e1e76a4c7','13PQsjrKLXhuAHtxMxVojKdu12NJNrW2jM','confirmed',0.02,'1504626088','http://solidrocks.net/v1/confirmOrder','cc8383c0-8107-5cf0-b726-7aa149c97cdf','322639755'),(2,'7c222694-abd0-43c1-a8fd-0c2ae781875d','1AgBTQZH6mfnqmQRVKF4mcH9y63EiFPf5G','confirmed',0.05,'1504627917','http://solidrocks.net/v1/confirmOrder','6dc42537-dfdf-5c94-900c-ff5c83623381','301102955'),(3,'12160f7c-5f32-4e5c-a32d-54aec6a7c878','1CX3yj6LzS3YKzDX3gyr9XVFxZHhcLnC3y','pending',0.05,'1504628274','http://solidrocks.net/v1/confirmOrder','83cd48d1-fdf8-56f2-b34e-bdf23af178be','322639755'),(4,'9d7dddfd-232c-409c-ab19-e3dd481a9320','1NsCabydihHMzAnPqRrspjMT3Qsu99VN9U','pending',0.02,'1504628440','http://solidrocks.net/v1/confirmOrder','afee1bbf-4f0d-5762-b02a-01bec7ea9c02','419751662'),(5,'3101c426-1ad6-41a4-b65c-ba1e33efbf1c','1GzA2uiJs7HmQp22yEm5KPmKL2MW6pV6tV','pending',0.02,'1504630102','http://solidrocks.net/v1/confirmOrder','9fd3db0b-e08d-5cb9-83f0-a0653fedd874','342878469'),(6,'ff8714a8-986d-4783-8c9d-872f4731461d','1LphsN6gcMwGT8mqdToeSNURCfCp35T77P','pending',0.1,'1504631624','http://solidrocks.net/v1/confirmOrder','719a8dbc-7df1-5e81-afd0-0f3b0beb5684','377766004'),(7,'91a574ab-8df4-4558-b950-e51f91f86350','1CHmBosoE4b8gqaDD8M49obtzqi1y5yb8w','pending',0.02,'1504632027','http://solidrocks.net/v1/confirmOrder','940a7fba-0424-566e-8e02-f39b43df17da','317344864'),(8,'e6bac0c8-0285-4af2-ade6-28d3be20d52b','19YkgsMfX1Scs6VM7twMhaLRZwnnsW9vJd','pending',0.1,'1504632698','http://solidrocks.net/v1/confirmOrder','48dd3e76-0d40-5d45-ae3b-d144cc6275f0','447503047'),(9,'de336f5d-773d-4d8e-b17a-5e8446792fbc','1EoQUhLZ1UVvQnA7pHVdB9MKTEXBLYY9R8','pending',2,'1504632961','http://solidrocks.net/v1/confirmOrder','8e9da47d-f2b8-5c3b-aaf8-777e99c93abf','441223026'),(10,'65be502c-03c5-4c26-8fa0-6c23eda9efa6','1CgeWx84nZJyW7zNjiLBe7mC1GxeR6iiJD','pending',0.02,'1504634470','http://solidrocks.net/v1/confirmOrder','8228b36a-9dc6-5c60-a11f-cbf73b38fdd1','249775139'),(11,'75f4ef6a-ed8a-4f92-85eb-c2bbcfacce77','1Q5Xwqgu7qTxbGqrGR13zknQRHoD3pMRmw','pending',0.02,'1504635241','http://solidrocks.net/v1/confirmOrder','77ab1a6e-8e0e-575c-aa5b-2be0a3155d41','418011806'),(12,'c75ba022-3f2a-47e1-8b10-e3d9cec34519','16CaT6VqM1Vt9tMV7i3H8Yvxik6x1QZJ3J','pending',0.02,'1504638083','http://solidrocks.net/v1/confirmOrder','8ca488b5-b407-5979-b00f-df53ed92fe53','404033313'),(13,'61b1d2ac-3509-42ae-9939-17099f9c0d9a','1DhmG67WrkxNAjGSRr4YdrhaCAqRRnKhMm','pending',0.02,'1504646307','http://solidrocks.net/v1/confirmOrder','e0dd5739-9ee3-5aab-a410-cabaeb1ae1d7','356156452'),(14,'f4946771-7893-4b21-9161-786590ff22fe','1Lbz9Szx6EEpLA5FfrD18tJUmMTxF3yshc','pending',2,'1504666344','http://solidrocks.net/v1/confirmOrder','337b2e62-af1e-5104-943d-0e20c467de69','214822886'),(15,'31302990-efef-4fac-a8f3-046b377858e1','1JT1c7mkhnp5Fk5uofopdi6i747ZMRzpxZ','pending',0.02,'1504667373','http://solidrocks.net/v1/confirmOrder','bfd5dea4-ee2a-5e26-b8aa-ecbc64ecaebe','378961378'),(16,'46f84b3d-854c-460e-a15b-9ed423725514','1L1q1oTynhYyt1NwyC43UEujhV5oL9Uh7b','pending',0.02,'1504775778','http://solidrocks.net/v1/confirmOrder','dc58cb92-fe76-5924-9a6b-2e00ef8232d9','395817911'),(17,'b23ad6fc-0a85-4ca5-9468-b547d3e92da2','1FoVjt5SVvQhmHAkfHchRwzMsALfpzkKBw','pending',0.02,'1504777034','http://solidrocks.net/v1/confirmOrder','5de273fc-d066-585c-b919-bd6e1a26fefb','172623681'),(18,'1b58cda7-2a7b-4dcd-ac13-bab3f79c37d1','1KiC4ccLWzvQDmHVytphgfn48BhTzGDGLi','pending',1,'1504780187','http://solidrocks.net/v1/confirmOrder','7820b802-fb5f-5ae2-86e7-0d259eb483c8','348739745');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` text NOT NULL,
  `date` text NOT NULL,
  `verb` text NOT NULL,
  `transaction` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,'322639755','1504628036','newPayment','{\"address\":\"13PQsjrKLXhuAHtxMxVojKdu12NJNrW2jM\",\"amount\":0.02}'),(2,'301102955','1504628784','newPayment','{\"address\":\"1AgBTQZH6mfnqmQRVKF4mcH9y63EiFPf5G\",\"amount\":0.05}');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nameUser` text NOT NULL,
  `username` text,
  `dateJoined` text NOT NULL,
  `chatId` varchar(500) NOT NULL,
  `language` varchar(5) NOT NULL DEFAULT 'en',
  `referred_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `chatId` (`chatId`)
) ENGINE=InnoDB AUTO_INCREMENT=120 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Koko Ice','kokoice','1504168597006','322639755','en',NULL),(2,'Davis','Karma007','1504170123374','301102955','en',322639755),(3,'Btcdonation_hub','Btcdonationhub_Alex','1504176817982','353112872','en',NULL),(4,'Mr. Smith',NULL,'1504209054100','351983507','en',NULL),(5,'Riccardo','riccard0mentri','1504214788251','443850897','en',NULL),(6,'Wil',NULL,'1504218790397','314292067','en',NULL),(7,'nerio',NULL,'1504219120463','446247627','en',NULL),(8,'ner',NULL,'1504219194166','416074546','en',446247627),(9,'bay',NULL,'1504219235694','424096326','en',446247627),(10,'Pian',NULL,'1504219677353','216092858','en',NULL),(11,'Ices',NULL,'1504220384039','367562010','en',314292067),(12,'Evan','Shnur_Dark','1504251701672','445053335','en',NULL),(13,'Simon','SimSpru44','1504257089621','440570940','de',NULL),(14,'Nathan',NULL,'1504258352187','423629055','en',367562010),(15,'paul bp','paulbp','1504261206076','314106806','fr',NULL),(16,'Taher','Taherbadri','1504272301472','322988021','en',NULL),(17,'OFFICIAL SA',NULL,'1504275377733','399524758','en',NULL),(18,'Rahmat','poetradinara','1504280514586','411605806','en',NULL),(19,'Riss717','Riss717','1504283577744','335856705','en',NULL),(20,'Rico Dwi','Ricodwi15','1504287327113','387738351','en',NULL),(21,'Vel','VelSan','1504313173481','386233430','en',NULL),(22,'Michael','MichaelStollaire','1504320674211','339528614','en',NULL),(23,'fiaz','imposssible','1504330836244','279588080','en',NULL),(24,'mohd',NULL,'1504332025215','174148156','en',279588080),(25,'Dennis','Dennisnavto','1504332873407','418228984','en',279588080),(26,'ku1658','ku1658','1504335427284','429034770','en',NULL),(27,'crypto','bitcoinowner','1504336090885','392217261','en',279588080),(28,'Hyip','hyipexpert','1504337200071','305342195','en',NULL),(29,'Tecardo','Tecardo','1504339653630','58310247','de',NULL),(30,'Hyip',NULL,'1504340792592','319860803','en',305342195),(31,'Sabene',NULL,'1504341014451','308479934','en',305342195),(32,'Joker','Seller_0','1504341060393','393128858','en',305342195),(33,'Karan',NULL,'1504341130955','406002295','en',305342195),(34,'Kot','Kattak','1504346931083','295682924','en',NULL),(35,'Mike',NULL,'1504349421079','394302476','en',NULL),(36,'SmartTrader_Sheriff','SBT_support','1504351730117','317513662','en',NULL),(37,'Vovan','vovan79','1504355362127','214822886','en',NULL),(38,'Cindy','CSSUPP','1504355834615','330023755','de',305342195),(39,'Cyptrocurency Trader',NULL,'1504355893471','378041853','en',305342195),(40,'Honey',NULL,'1504356263785','339250979','en',305342195),(41,'Roberto','PrimeSatan','1504356266720','338206360','en',305342195),(42,'Kevin','Ozboy','1504356276030','306099889','en',305342195),(43,'Mr.Shin','Shin001','1504356921374','395163794','en',305342195),(44,'Larry Ben',NULL,'1504362615626','417109471','en',NULL),(45,'Jasmine','jasmineQQ','1504362790721','382004158','en',305342195),(46,'Rafiqin',NULL,'1504383389397','306248055','en',305342195),(47,'sheila',NULL,'1504417870047','446404237','en',305342195),(48,'Jino Dave',NULL,'1504427835713','436457707','en',305342195),(49,'Taruna',NULL,'1504431463309','384215947','en',NULL),(50,'Accountiptv.evaz','Behrouzbazrafkan','1504431863601','138562972','en',305342195),(51,'William',NULL,'1504438481542','353133423','en',279588080),(52,'Emmanuel','Bboakye','1504445909229','383602526','en',305342195),(53,'Nani',NULL,'1504453433367','189441379','en',305342195),(54,'Inder Singh',NULL,'1504456998016','447934223','en',384215947),(55,'Alswell Wellington',NULL,'1504460743959','293762700','en',305342195),(56,'Mastermind','MastermindXii','1504463961775','375069292','en',NULL),(57,'dpearlegacy','dpearlegacy','1504486370719','412479075','en',305342195),(58,'Nefelibata','NefelibataX','1504490375185','427267945','en',305342195),(59,'Chris','KiLLeR_DexX','1504505850030','188500176','de',NULL),(60,'Metas','LaVtornik','1504508889636','172767908','en',NULL),(61,'DON-K1',NULL,'1504514788461','441223026','en',NULL),(62,'Valviluc',NULL,'1504514959154','317344864','en',NULL),(63,'Scott',NULL,'1504532177232','437379237','en',NULL),(64,'Buy more Btc',NULL,'1504532945949','309366247','de',437379237),(65,'Eu Sou','soulegal1','1504535656737','240291406','en',NULL),(66,'Sovan',NULL,'1504539285440','429624652','en',305342195),(67,'Devilsmile','Bot_checki','1504539745912','370039604','en',NULL),(68,'Kamil','kkhankheri','1504539838937','113130019','en',NULL),(69,'jchap','Jchap','1504542379909','72247631','en',NULL),(70,'Salman','Salman678','1504544636290','378707538','en',305342195),(71,'Mat','Matfauzi','1504547440256','375870461','en',305342195),(72,'broooookkk','je_suis_fini','1504552199873','373251199','en',NULL),(73,'Azli','azli_othman','1504565244848','405018322','en',NULL),(74,'btcdonation_hub','btcdonationhub_Ashley','1504567742010','377766004','en',NULL),(75,'-admin','cryptofux','1504571729196','279245971','en',NULL),(76,'Toshiba BTC','Toshiba212','1504571752962','305888619','en',NULL),(77,'Vin',NULL,'1504573632421','418011806','en',NULL),(78,'SLARDAR','Slardg','1504574361801','354383660','en',NULL),(79,'Alexandre','alexandreventurin','1504581356147','188379397','en',NULL),(80,'John',NULL,'1504590890743','380059968','en',NULL),(81,'McCheenie','McCheenie','1504598687108','399656801','en',305342195),(82,'TwentyDay','Becauseofyouq','1504599388058','306973806','en',399656801),(83,'cleven','arnoldstrong','1504599550078','399346420','en',305342195),(84,'Cy',NULL,'1504601206036','336079270','en',306973806),(85,'BronyGuy','BronyGuy','1504605427593','162211201','en',NULL),(86,'HENRY',NULL,'1504606760406','420492218','en',NULL),(87,'Sudha',NULL,'1504613008579','357164267','en',305342195),(88,'Benson',NULL,'1504613231352','422887364','en',NULL),(89,'ADMIN PRINCE',NULL,'1504615046465','424595809','en',317344864),(90,'M','MSSMTK','1504628021346','376021149','en',305342195),(91,'PUMPCOINS','PUMPCOINS_Support','1504628158082','397064477','en',305342195),(92,'Sergey','Barinovsp','1504628343754','419751662','en',NULL),(93,'Kevin','Kjohn23','1504629160379','435053817','en',NULL),(94,'bitcoin','BTCinvestar','1504629161783','338121029','en',NULL),(95,'Martinez',NULL,'1504630079393','342878469','en',NULL),(96,'renato','krolithikah13','1504632460806','391664180','en',305342195),(97,'Jee Clinton',NULL,'1504632615139','447503047','en',NULL),(98,'Nanbal','Nanbaltheo','1504634440626','249775139','en',NULL),(99,'Robert','Robriat','1504638054131','404033313','en',NULL),(100,'Dario',NULL,'1504644075374','329742334','en',305342195),(101,'maria','Mavegas','1504646118005','348469554','en',NULL),(102,'Beslan','NatanBlack09','1504646276519','356156452','en',NULL),(103,'Ray',NULL,'1504658541225','318361086','en',370039604),(104,'Rakhmonov','SteveJacckson','1504667351070','378961378','en',NULL),(105,'Engki.ef','Engki_ef','1504683819807','257812010','en',NULL),(106,'Quojo','SirElvs','1504684062165','359887800','en',NULL),(107,'ANNA','Chloe923','1504685301395','422875503','en',NULL),(108,'Annarobertson',NULL,'1504685668237','424706792','en',422875503),(109,'Ainura','Babysarakon','1504685821957','347999746','en',422875503),(110,'Johnsnow','MenInBlack2017','1504710308636','381670155','en',NULL),(111,'A',NULL,'1504730999204','354582257','en',305342195),(112,'Bot_support',NULL,'1504732357901','446542896','en',NULL),(113,'Kamil','Smiechu','1504733729479','303715775','en',NULL),(114,'Babablue','Bbabablue','1504749629406','353290480','en',370039604),(115,'Mary','Sonnie7','1504755800875','364415607','en',370039604),(116,'RAYMOND',NULL,'1504775750114','395817911','en',NULL),(117,'Özer','erdonmez','1504777020112','172623681','en',NULL),(118,'Johnson David',NULL,'1504780146581','348739745','en',NULL),(119,'Rafhael','rafhaelanugrah','1504781272980','304841167','en',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-09-07 11:20:11
