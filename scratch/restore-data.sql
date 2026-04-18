SET NAMES utf8mb4;

SET CHARACTER SET utf8mb4;

SET FOREIGN_KEY_CHECKS = 0;

REPLACE INTO `boostpackage` (`id`, `name`, `description`, `price`, `duration`, `features`, `active`, `createdAt`, `updatedAt`) VALUES
('cmjh4ffw00004kcvcpkyz68sg','BOOSTE VOTRE ANNONCE','',2000,7,'[]',1,'2025-12-22 12:17:18.384','2025-12-22 12:17:18.384');

REPLACE INTO `category` (`id`, `name`, `nameFr`, `nameAr`, `nameEn`, `slug`, `icon`, `image`, `description`, `order`, `isActive`, `color`, `createdAt`, `updatedAt`, `parentId`) VALUES
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

REPLACE INTO `paymentmethod` (`id`, `name`, `code`, `description`, `icon`, `color`, `active`, `order`, `config`, `phoneNumber`, `paymentLink`, `createdAt`, `updatedAt`, `instruction`) VALUES
('cmjfk66s30000kcr0jhv65i0y','WAVE','wave_monney','Procédure :\n\nEffectuez le paiement via Orange Money ou Wave Money sur le numéro indiqué.\n\nConservez le reçu ou faites une capture d’écran de la transaction.\n\nEnvoyez la preuve de paiement avec votre nom et la référence de la commande.\n\nUne fois le paiement confirmé, votre commande sera traitée.','/uploads/payment-logos/payment-logo-1767141507677-s1cf99.jpg','from-gray-500 to-gray-600',1,0,'null','+2250759579042','https://pay.wave.com/m/M_ci_kAXFcuRHsGu2/c/ci/','2025-12-21 10:02:28.176','2025-12-31 07:43:07.673','BINE VENUE DAM BOUTIQUE'),
('cmjfk7vri0003kcr0wtdbgnhy','ORANGE','orange_monney','Procédure :\n\nEffectuez le paiement via Orange Money ou Wave Money sur le numéro indiqué.\n\nConservez le reçu ou faites une capture d’écran de la transaction.\n\nEnvoyez la preuve de paiement avec votre nom et la référence de la commande.\n\nUne fois le paiement confirmé, votre commande sera traitée.','/uploads/payment-logos/payment-logo-1766311427128-v7385t.png','from-gray-500 to-gray-600',1,0,'null','+2250709194318','','2025-12-21 10:03:47.214','2025-12-31 07:43:07.673',NULL),
('cmjtat3hz000us34vrfl7r5hu','Orange Money','OM','Paiement via Orange Money','🟠','from-orange-500 to-orange-600',0,1,NULL,'0700000000',NULL,'2025-12-31 00:49:07.320','2025-12-31 07:43:07.665','Composez le #144*... pour effectuer le paiement de {amount} FCFA vers le 0700000000.'),
('cmjtat3ib000vs34vikhyc016','Wave','WAVE','Paiement sans frais via Wave','🌊','from-blue-400 to-blue-500',1,2,NULL,'0700000000',NULL,'2025-12-31 00:49:07.331','2025-12-31 07:43:07.673','Envoyez {amount} FCFA vers le 0700000000 via l\'application Wave.'),
('cmjtat3ie000ws34v8t3mpgld','MTN Mobile Money','MTN','Paiement via MTN MoMo','🟡','from-yellow-400 to-yellow-500',0,3,NULL,'0500000000',NULL,'2025-12-31 00:49:07.334','2025-12-31 07:43:07.665','Composez le *133*... pour envoyer {amount} FCFA vers le 0500000000.'),
('cmjtat3ig000xs34vo1lgbo4f','Moov Money','MOOV','Paiement via Moov Money','🔵','from-blue-600 to-blue-700',0,4,NULL,'0100000000',NULL,'2025-12-31 00:49:07.336','2025-12-31 07:43:07.665','Effectuez un transfert de {amount} FCFA vers le 0100000000.');

REPLACE INTO `seosettings` (`id`, `defaultTitle`, `defaultDescription`, `defaultKeywords`, `ogImage`, `ogType`, `twitterHandle`, `twitterCardType`, `googleAnalyticsId`, `googleTagManagerId`, `facebookPixelId`, `sitemapEnabled`, `robotsTxt`, `createdAt`, `updatedAt`) VALUES
('cmjja39ga0003kc78drszw7a0','Petites annonces vidéo en Côte d’Ivoire | IvoireCI','Publiez et découvrez des petites annonces 100% vidéo en Côte d’Ivoire. Achetez, vendez et promouvez vos produits facilement sur IvoireCI.','petites annonces vidéo, annonces vidéo Côte d’Ivoire, marketplace vidéo CI, vendre en vidéo, annonces Abidjan',NULL,'website',NULL,'summary_large_image',NULL,NULL,NULL,1,'User-agent: *\nAllow: /\n\nSitemap: https://ivoireci.com/sitemap.xml\n','2025-12-24 00:31:20.219','2026-01-01 23:36:11.053');

REPLACE INTO `setting` (`id`, `key`, `value`, `description`, `createdAt`, `updatedAt`) VALUES
('cmjjnp1p00000kcowvc0d1npb','i18n_settings','{\"multiLanguageEnabled\":false,\"availableLanguages\":[\"fr\"],\"defaultLanguage\":\"fr\",\"autoDetect\":true}',NULL,'2025-12-24 06:52:11.599','2025-12-27 11:30:56.423'),
('cmjjytyhj0000kckg4r5oipl2','homepage_banner','{\"enabled\":true,\"slides\":[]}','Configuration de la bannière de la page d\'accueil','2025-12-24 12:03:56.502','2025-12-25 20:00:22.430'),
('cmo209fny0000p70jpc5pg42f','platform.solo_mode_enabled','false','Mode Solo : Seul l’administrateur peut publier des annonces','2026-04-16 21:42:38.729','2026-04-16 22:29:22.538'),
('plat3c89e45f-3929-11f1-b','platform.public_registration_enabled','false','Inscription publique activee','2026-04-16 00:14:28.928','2026-04-16 22:29:23.346'),
('plat3c8d992f-3929-11f1-b','platform.signup_default_vendor','false','Nouveaux comptes crees comme vendeur','2026-04-16 00:14:28.960','2026-04-16 22:29:24.196');

REPLACE INTO `sitesettings` (`id`, `siteName`, `siteSlogan`, `siteDescription`, `heroTitle`, `heroSubtitle`, `urgentSectionTitle`, `recentSectionTitle`, `shopsSectionTitle`, `logo`, `favicon`, `contactEmail`, `contactPhone`, `address`, `socialFacebook`, `socialTwitter`, `socialInstagram`, `socialLinkedIn`, `socialYouTube`, `socialTikTok`, `maintenanceMode`, `maintenanceMessage`, `homeLayout`, `dashboardLayout`, `primaryColor`, `secondaryColor`, `accentColor`, `enableAIDescriptionGenerator`, `homepageSections`, `createdAt`, `updatedAt`, `backgroundColor`, `footerColor`, `footerTextColor`, `headerColor`, `headerTextColor`, `recentBgColor`, `recentTextColor`, `shopsBgColor`, `shopsTextColor`, `urgentBgColor`, `urgentTextColor`, `pwaIcon`) VALUES
('cmja9rbrj0000kcpglvfs96x2','','','','Petites annonces vidéo en Côte d’Ivoire |','','','','','/uploads/banners/banner-1767313376739-x3ag6v.png','','','','','','','','','','',0,'','cosmic','nebula','#FF6B35','#F7931E','#FDC830',1,'null','2025-12-17 17:12:07.759','2026-04-16 17:45:25.384','#FFF7ED','#FFFFFF','#000000','#FFFFFF','#000000','#FFFFFF','#000000','#FFFFFF','#000000','#FFFFFF','#000000',NULL);

REPLACE INTO `subscriptionplan` (`id`, `name`, `slug`, `description`, `price`, `features`, `maxListings`, `maxVideosPerListing`, `maxVideoDuration`, `allowSubdomain`, `allowCustomDomain`, `allowLiveStreaming`, `allowStories`, `priority`, `active`, `popular`, `color`, `createdAt`, `updatedAt`) VALUES
('cmjfovmwo0000kc242n8ud0xd','Pro','pro','Plan professionnel avec toutes les fonctionnalités premium : domaine personnalisé, annonces illimitées, live streaming, stories et support prioritaire.',25000,'[\"Annonces illimitées\", \"Vidéos jusqu\'à 5 minutes\", \"Sous-domaine personnalisé (votreboutique.videoboutique.com)\", \"Stories 24h illimitées\", \"Badge \\\"PRO\\\" sur votre profil\", \"Statistiques avancées\", \"Support prioritaire 24/7\", \"Pas de publicités\"]',NULL,10,1,1,0,1,1,1,1,1,'#FF6B35','2025-12-21 12:14:13.943','2025-12-22 12:16:25.886');

SET FOREIGN_KEY_CHECKS = 1;