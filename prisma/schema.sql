-- Script SQL pour créer toutes les tables de VideoBoutique
-- Base de données: videoboutique

USE videoboutique;

-- Table User
CREATE TABLE `User` (
  `id` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NULL,
  `password` VARCHAR(191) NOT NULL,
  `avatar` VARCHAR(191) NULL,
  `language` VARCHAR(191) NOT NULL DEFAULT 'fr',
  `verified` BOOLEAN NOT NULL DEFAULT false,
  `premium` BOOLEAN NOT NULL DEFAULT false,
  `premiumUntil` DATETIME(3) NULL,
  `premiumTier` VARCHAR(191) NOT NULL DEFAULT 'free',
  `subdomain` VARCHAR(191) NULL,
  `customDomain` VARCHAR(191) NULL,
  `bannerUrl` VARCHAR(191) NULL,
  `bio` TEXT NULL,
  `shopTheme` VARCHAR(191) NOT NULL DEFAULT 'default',
  `socialLinks` JSON NULL,
  `rating` DOUBLE NOT NULL DEFAULT 0,
  `totalRatings` INT NOT NULL DEFAULT 0,
  `totalSales` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  UNIQUE INDEX `User_phone_key`(`phone`),
  UNIQUE INDEX `User_email_key`(`email`),
  UNIQUE INDEX `User_subdomain_key`(`subdomain`),
  UNIQUE INDEX `User_customDomain_key`(`customDomain`),
  INDEX `User_phone_idx`(`phone`),
  INDEX `User_email_idx`(`email`),
  INDEX `User_subdomain_idx`(`subdomain`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Table Listing
CREATE TABLE `Listing` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `description` TEXT NOT NULL,
  `price` INT NOT NULL,
  `category` VARCHAR(191) NOT NULL,
  `videoUrl` VARCHAR(191) NOT NULL,
  `thumbnailUrl` VARCHAR(191) NOT NULL,
  `duration` INT NOT NULL,
  `location` VARCHAR(191) NOT NULL,
  `latitude` DOUBLE NULL,
  `longitude` DOUBLE NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'active',
  `views` INT NOT NULL DEFAULT 0,
  `boosted` BOOLEAN NOT NULL DEFAULT false,
  `boostedUntil` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  `expiresAt` DATETIME(3) NOT NULL,

  INDEX `Listing_category_status_createdAt_idx`(`category`, `status`, `createdAt`),
  INDEX `Listing_userId_idx`(`userId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Table Conversation
CREATE TABLE `Conversation` (
  `id` VARCHAR(191) NOT NULL,
  `listingId` VARCHAR(191) NOT NULL,
  `buyerId` VARCHAR(191) NOT NULL,
  `sellerId` VARCHAR(191) NOT NULL,
  `lastMessageAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  UNIQUE INDEX `Conversation_listingId_buyerId_key`(`listingId`, `buyerId`),
  INDEX `Conversation_buyerId_idx`(`buyerId`),
  INDEX `Conversation_sellerId_idx`(`sellerId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Table Message
CREATE TABLE `Message` (
  `id` VARCHAR(191) NOT NULL,
  `conversationId` VARCHAR(191) NOT NULL,
  `senderId` VARCHAR(191) NOT NULL,
  `listingId` VARCHAR(191) NOT NULL,
  `content` TEXT NOT NULL,
  `type` VARCHAR(191) NOT NULL DEFAULT 'text',
  `mediaUrl` VARCHAR(191) NULL,
  `duration` INT NULL,
  `isAutomatic` BOOLEAN NOT NULL DEFAULT false,
  `read` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  INDEX `Message_conversationId_createdAt_idx`(`conversationId`, `createdAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Table Review
CREATE TABLE `Review` (
  `id` VARCHAR(191) NOT NULL,
  `reviewerId` VARCHAR(191) NOT NULL,
  `reviewedId` VARCHAR(191) NOT NULL,
  `listingId` VARCHAR(191) NOT NULL,
  `rating` INT NOT NULL,
  `comment` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  UNIQUE INDEX `Review_reviewerId_listingId_key`(`reviewerId`, `listingId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Table Favorite
CREATE TABLE `Favorite` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `listingId` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  UNIQUE INDEX `Favorite_userId_listingId_key`(`userId`, `listingId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Table AutoReplyTemplate
CREATE TABLE `AutoReplyTemplate` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `trigger` VARCHAR(191) NOT NULL,
  `response` TEXT NOT NULL,
  `active` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Table Transaction
CREATE TABLE `Transaction` (
  `id` VARCHAR(191) NOT NULL,
  `buyerId` VARCHAR(191) NOT NULL,
  `sellerId` VARCHAR(191) NOT NULL,
  `listingId` VARCHAR(191) NOT NULL,
  `amount` INT NOT NULL,
  `commission` INT NOT NULL,
  `paymentMethod` VARCHAR(191) NOT NULL,
  `status` VARCHAR(191) NOT NULL,
  `transactionId` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  INDEX `Transaction_buyerId_idx`(`buyerId`),
  INDEX `Transaction_sellerId_idx`(`sellerId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Foreign Keys
ALTER TABLE `Listing` ADD CONSTRAINT `Listing_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `Conversation` ADD CONSTRAINT `Conversation_buyerId_fkey` FOREIGN KEY (`buyerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `Message` ADD CONSTRAINT `Message_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `Conversation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `Message` ADD CONSTRAINT `Message_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `Message` ADD CONSTRAINT `Message_listingId_fkey` FOREIGN KEY (`listingId`) REFERENCES `Listing`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `Review` ADD CONSTRAINT `Review_reviewerId_fkey` FOREIGN KEY (`reviewerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_listingId_fkey` FOREIGN KEY (`listingId`) REFERENCES `Listing`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
