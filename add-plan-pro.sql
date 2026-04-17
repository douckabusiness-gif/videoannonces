-- Ajout des colonnes pour les fonctionnalités premium
ALTER TABLE `SubscriptionPlan` 
ADD COLUMN `allowSubdomain` BOOLEAN NOT NULL DEFAULT false AFTER `maxVideoDuration`,
ADD COLUMN `allowCustomDomain` BOOLEAN NOT NULL DEFAULT false AFTER `allowSubdomain`,
ADD COLUMN `allowLiveStreaming` BOOLEAN NOT NULL DEFAULT false AFTER `allowCustomDomain`,
ADD COLUMN `allowStories` BOOLEAN NOT NULL DEFAULT false AFTER `allowLiveStreaming`,
ADD COLUMN `popular` BOOLEAN NOT NULL DEFAULT false AFTER `active`,
ADD COLUMN `color` VARCHAR(191) NULL AFTER `popular`;

-- Insertion du Plan Pro
INSERT INTO `SubscriptionPlan` (
  `id`, `name`, `slug`, `description`, `price`, `features`,
  `maxListings`, `maxVideoDuration`,
  `allowSubdomain`, `allowCustomDomain`, `allowLiveStreaming`, `allowStories`,
  `priority`, `active`, `popular`, `color`,
  `createdAt`, `updatedAt`
) VALUES (
  'plan_pro_001',
  'Pro',
  'pro',
  'Plan professionnel avec toutes les fonctionnalités premium : domaine personnalisé, annonces illimitées, live streaming, stories et support prioritaire.',
  25000,
  JSON_ARRAY(
    'Annonces illimitées',
    'Vidéos jusqu''à 5 minutes',
    'Sous-domaine personnalisé (votreboutique.videoboutique.com)',
    'Domaine personnalisé (votresite.com)',
    'Live streaming illimité',
    'Stories 24h illimitées',
    'Badge "PRO" sur votre profil',
    'Statistiques avancées',
    'Support prioritaire 24/7',
    'Pas de publicités'
  ),
  NULL,
  300,
  true,
  true,
  true,
  true,
  1,
  true,
  true,
  '#FF6B35',
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `description` = VALUES(`description`),
  `price` = VALUES(`price`),
  `features` = VALUES(`features`),
  `maxListings` = VALUES(`maxListings`),
  `maxVideoDuration` = VALUES(`maxVideoDuration`),
  `allowSubdomain` = VALUES(`allowSubdomain`),
  `allowCustomDomain` = VALUES(`allowCustomDomain`),
  `allowLiveStreaming` = VALUES(`allowLiveStreaming`),
  `allowStories` = VALUES(`allowStories`),
  `priority` = VALUES(`priority`),
  `active` = VALUES(`active`),
  `popular` = VALUES(`popular`),
  `color` = VALUES(`color`),
  `updatedAt` = NOW();
