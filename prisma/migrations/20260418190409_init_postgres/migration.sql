-- CreateEnum
CREATE TYPE "BadgeType" AS ENUM ('VERIFIED', 'TOP_SELLER', 'FAST_RESPONDER', 'PREMIUM', 'NEW_SELLER', 'TRUSTED', 'EXPERT');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('MESSAGE', 'SALE', 'ORDER', 'REVIEW', 'SYSTEM');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "language" TEXT NOT NULL DEFAULT 'fr',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "premium" BOOLEAN NOT NULL DEFAULT false,
    "premiumUntil" TIMESTAMP(3),
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "premiumTier" TEXT NOT NULL DEFAULT 'free',
    "role" TEXT NOT NULL DEFAULT 'USER',
    "isVendor" BOOLEAN NOT NULL DEFAULT false,
    "suspended" BOOLEAN NOT NULL DEFAULT false,
    "suspendedUntil" TIMESTAMP(3),
    "suspendedReason" TEXT,
    "subdomain" TEXT,
    "customDomain" TEXT,
    "bannerUrl" TEXT,
    "bio" TEXT,
    "shopTheme" TEXT NOT NULL DEFAULT 'default',
    "socialLinks" JSONB,
    "fbUserId" TEXT,
    "fbAccessToken" TEXT,
    "fbPageId" TEXT,
    "fbPageName" TEXT,
    "fbPageAccessToken" TEXT,
    "videoUrl" TEXT,
    "whatsappNumber" TEXT,
    "aiReplyEnabled" BOOLEAN NOT NULL DEFAULT true,
    "galleryImages" JSONB,
    "testimonials" JSONB,
    "trustBadges" JSONB,
    "fontFamily" TEXT DEFAULT 'inter',
    "activePromotion" JSONB,
    "aboutSection" TEXT,
    "customColors" JSONB,
    "logoUrl" TEXT,
    "backgroundUrl" TEXT,
    "businessHours" JSONB,
    "shopLayout" TEXT NOT NULL DEFAULT 'mobile-first',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalRatings" INTEGER NOT NULL DEFAULT 0,
    "totalSales" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badge" (
    "id" TEXT NOT NULL,
    "type" "BadgeType" NOT NULL,
    "name" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameAr" TEXT,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "criteria" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userbadge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeType" "BadgeType" NOT NULL,
    "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "userbadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "quartier" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'active',
    "moderationStatus" TEXT NOT NULL DEFAULT 'pending',
    "moderatedBy" TEXT,
    "moderatedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "boosted" BOOLEAN NOT NULL DEFAULT false,
    "boostedUntil" TIMESTAMP(3),
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation" (
    "id" TEXT NOT NULL,
    "listingId" TEXT,
    "buyerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "lastMessage" TEXT,
    "lastMessageAt" TIMESTAMP(3),
    "unreadCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "listingId" TEXT,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'text',
    "mediaUrl" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "audioDuration" INTEGER,
    "fileSize" INTEGER,
    "deliveredAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedForAll" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "reviewedId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'XOF',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paymentMethod" TEXT NOT NULL,
    "paymentMethodId" TEXT,
    "transactionId" TEXT,
    "proofUrl" TEXT,
    "adminNote" TEXT,
    "reference" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "autoRenew" BOOLEAN NOT NULL DEFAULT true,
    "paymentMethodId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptionplan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "features" JSONB NOT NULL,
    "maxListings" INTEGER,
    "maxVideosPerListing" INTEGER DEFAULT 1,
    "maxVideoDuration" INTEGER,
    "allowSubdomain" BOOLEAN NOT NULL DEFAULT false,
    "allowCustomDomain" BOOLEAN NOT NULL DEFAULT false,
    "allowLiveStreaming" BOOLEAN NOT NULL DEFAULT false,
    "allowStories" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptionplan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boostpackage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "features" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "boostpackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "icon" TEXT,
    "url" TEXT,
    "data" JSONB,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "sent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automationtemplate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "trigger" TEXT NOT NULL,
    "conditions" JSONB NOT NULL,
    "actions" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "automationtemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paymentmethod" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT NOT NULL DEFAULT 'from-gray-500 to-gray-600',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "config" JSONB,
    "phoneNumber" TEXT,
    "paymentLink" TEXT,
    "instruction" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paymentmethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paymentmessage" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "bgColor" TEXT NOT NULL DEFAULT '#FF6B35',
    "textColor" TEXT NOT NULL DEFAULT '#FFFFFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paymentmessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sitesettings" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL DEFAULT 'VideoBoutique',
    "siteSlogan" TEXT,
    "siteDescription" TEXT,
    "heroTitle" TEXT,
    "heroSubtitle" TEXT,
    "urgentSectionTitle" TEXT DEFAULT 'Annonces Urgentes',
    "recentSectionTitle" TEXT DEFAULT 'Annonces Récentes',
    "shopsSectionTitle" TEXT DEFAULT 'Boutiques Premium',
    "logo" TEXT,
    "favicon" TEXT,
    "pwaIcon" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "address" TEXT,
    "socialFacebook" TEXT,
    "socialTwitter" TEXT,
    "socialInstagram" TEXT,
    "socialLinkedIn" TEXT,
    "socialYouTube" TEXT,
    "socialTikTok" TEXT,
    "facebookAppId" TEXT,
    "facebookAppSecret" TEXT,
    "facebookLoginEnabled" BOOLEAN NOT NULL DEFAULT false,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "maintenanceMessage" TEXT,
    "homeLayout" TEXT NOT NULL DEFAULT 'modern',
    "dashboardLayout" TEXT NOT NULL DEFAULT 'nebula',
    "primaryColor" TEXT NOT NULL DEFAULT '#FF6B35',
    "secondaryColor" TEXT NOT NULL DEFAULT '#F7931E',
    "accentColor" TEXT NOT NULL DEFAULT '#FDC830',
    "backgroundColor" TEXT NOT NULL DEFAULT '#FFF7ED',
    "headerColor" TEXT NOT NULL DEFAULT '#FFFFFF',
    "footerColor" TEXT NOT NULL DEFAULT '#FFFFFF',
    "headerTextColor" TEXT NOT NULL DEFAULT '#000000',
    "footerTextColor" TEXT NOT NULL DEFAULT '#000000',
    "urgentBgColor" TEXT NOT NULL DEFAULT '#FFFFFF',
    "shopsBgColor" TEXT NOT NULL DEFAULT '#FFFFFF',
    "recentBgColor" TEXT NOT NULL DEFAULT '#FFFFFF',
    "urgentTextColor" TEXT NOT NULL DEFAULT '#000000',
    "shopsTextColor" TEXT NOT NULL DEFAULT '#000000',
    "recentTextColor" TEXT NOT NULL DEFAULT '#000000',
    "enableAIDescriptionGenerator" BOOLEAN NOT NULL DEFAULT true,
    "homepageSections" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sitesettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emailconfig" (
    "id" TEXT NOT NULL,
    "smtpHost" TEXT NOT NULL,
    "smtpPort" INTEGER NOT NULL,
    "smtpUser" TEXT NOT NULL,
    "smtpPassword" TEXT NOT NULL,
    "fromEmail" TEXT NOT NULL,
    "fromName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "welcomeTemplate" TEXT,
    "verificationTemplate" TEXT,
    "resetPasswordTemplate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emailconfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameAr" TEXT,
    "nameEn" TEXT,
    "slug" TEXT NOT NULL,
    "icon" TEXT,
    "image" TEXT,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "color" TEXT,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seosettings" (
    "id" TEXT NOT NULL,
    "defaultTitle" TEXT,
    "defaultDescription" TEXT,
    "defaultKeywords" TEXT,
    "ogImage" TEXT,
    "ogType" TEXT DEFAULT 'website',
    "twitterHandle" TEXT,
    "twitterCardType" TEXT DEFAULT 'summary_large_image',
    "googleAnalyticsId" TEXT,
    "googleTagManagerId" TEXT,
    "facebookPixelId" TEXT,
    "sitemapEnabled" BOOLEAN NOT NULL DEFAULT true,
    "robotsTxt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seosettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "setting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "systemlog" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "userId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "systemlog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pushsubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pushsubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ad" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "linkUrl" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contactmessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contactmessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automationconfig" (
    "id" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "config" JSONB,
    "apiProvider" TEXT,
    "apiKey" TEXT,
    "apiEndpoint" TEXT,
    "dailyQuota" INTEGER,
    "monthlyQuota" INTEGER,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "lastResetAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "costPerCall" DOUBLE PRECISION,
    "totalCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "schedule" JSONB,
    "conditions" JSONB,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "automationconfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automationlog" (
    "id" TEXT NOT NULL,
    "configId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "input" JSONB,
    "output" JSONB,
    "error" TEXT,
    "executionTime" INTEGER,
    "tokensUsed" INTEGER,
    "cost" DOUBLE PRECISION,
    "userId" TEXT,
    "targetId" TEXT,
    "targetType" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automationlog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adminlog" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adminlog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "systemsettings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "systemsettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verificationcode" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verificationcode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_key" ON "user"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_subdomain_key" ON "user"("subdomain");

-- CreateIndex
CREATE UNIQUE INDEX "user_customDomain_key" ON "user"("customDomain");

-- CreateIndex
CREATE INDEX "user_phone_idx" ON "user"("phone");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_subdomain_idx" ON "user"("subdomain");

-- CreateIndex
CREATE UNIQUE INDEX "badge_type_key" ON "badge"("type");

-- CreateIndex
CREATE INDEX "userbadge_userId_idx" ON "userbadge"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "userbadge_userId_badgeType_key" ON "userbadge"("userId", "badgeType");

-- CreateIndex
CREATE INDEX "listing_category_status_createdAt_idx" ON "listing"("category", "status", "createdAt");

-- CreateIndex
CREATE INDEX "listing_userId_idx" ON "listing"("userId");

-- CreateIndex
CREATE INDEX "conversation_buyerId_idx" ON "conversation"("buyerId");

-- CreateIndex
CREATE INDEX "conversation_sellerId_idx" ON "conversation"("sellerId");

-- CreateIndex
CREATE INDEX "conversation_listingId_idx" ON "conversation"("listingId");

-- CreateIndex
CREATE INDEX "message_conversationId_idx" ON "message"("conversationId");

-- CreateIndex
CREATE INDEX "message_listingId_idx" ON "message"("listingId");

-- CreateIndex
CREATE INDEX "message_senderId_idx" ON "message"("senderId");

-- CreateIndex
CREATE INDEX "review_reviewerId_idx" ON "review"("reviewerId");

-- CreateIndex
CREATE INDEX "review_reviewedId_idx" ON "review"("reviewedId");

-- CreateIndex
CREATE INDEX "favorite_userId_idx" ON "favorite"("userId");

-- CreateIndex
CREATE INDEX "favorite_listingId_idx" ON "favorite"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_userId_listingId_key" ON "favorite"("userId", "listingId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_reference_key" ON "payment"("reference");

-- CreateIndex
CREATE INDEX "payment_userId_idx" ON "payment"("userId");

-- CreateIndex
CREATE INDEX "payment_status_idx" ON "payment"("status");

-- CreateIndex
CREATE INDEX "payment_reference_idx" ON "payment"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_userId_key" ON "subscription"("userId");

-- CreateIndex
CREATE INDEX "subscription_userId_idx" ON "subscription"("userId");

-- CreateIndex
CREATE INDEX "subscription_status_idx" ON "subscription"("status");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptionplan_slug_key" ON "subscriptionplan"("slug");

-- CreateIndex
CREATE INDEX "subscriptionplan_slug_idx" ON "subscriptionplan"("slug");

-- CreateIndex
CREATE INDEX "subscriptionplan_active_idx" ON "subscriptionplan"("active");

-- CreateIndex
CREATE INDEX "boostpackage_active_idx" ON "boostpackage"("active");

-- CreateIndex
CREATE INDEX "notification_userId_idx" ON "notification"("userId");

-- CreateIndex
CREATE INDEX "notification_read_idx" ON "notification"("read");

-- CreateIndex
CREATE INDEX "notification_createdAt_idx" ON "notification"("createdAt");

-- CreateIndex
CREATE INDEX "automationtemplate_userId_idx" ON "automationtemplate"("userId");

-- CreateIndex
CREATE INDEX "automationtemplate_active_idx" ON "automationtemplate"("active");

-- CreateIndex
CREATE UNIQUE INDEX "paymentmethod_code_key" ON "paymentmethod"("code");

-- CreateIndex
CREATE INDEX "paymentmethod_active_idx" ON "paymentmethod"("active");

-- CreateIndex
CREATE INDEX "paymentmethod_code_idx" ON "paymentmethod"("code");

-- CreateIndex
CREATE INDEX "paymentmethod_order_idx" ON "paymentmethod"("order");

-- CreateIndex
CREATE UNIQUE INDEX "category_slug_key" ON "category"("slug");

-- CreateIndex
CREATE INDEX "category_slug_idx" ON "category"("slug");

-- CreateIndex
CREATE INDEX "category_order_idx" ON "category"("order");

-- CreateIndex
CREATE INDEX "category_parentId_idx" ON "category"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "setting_key_key" ON "setting"("key");

-- CreateIndex
CREATE INDEX "setting_key_idx" ON "setting"("key");

-- CreateIndex
CREATE INDEX "systemlog_type_idx" ON "systemlog"("type");

-- CreateIndex
CREATE INDEX "systemlog_category_idx" ON "systemlog"("category");

-- CreateIndex
CREATE INDEX "systemlog_createdAt_idx" ON "systemlog"("createdAt");

-- CreateIndex
CREATE INDEX "systemlog_userId_idx" ON "systemlog"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "pushsubscription_endpoint_key" ON "pushsubscription"("endpoint");

-- CreateIndex
CREATE INDEX "pushsubscription_userId_idx" ON "pushsubscription"("userId");

-- CreateIndex
CREATE INDEX "idx_ad_pos_isact" ON "ad"("position", "isActive");

-- CreateIndex
CREATE INDEX "contactmessage_status_idx" ON "contactmessage"("status");

-- CreateIndex
CREATE INDEX "contactmessage_createdAt_idx" ON "contactmessage"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "automationconfig_feature_key" ON "automationconfig"("feature");

-- CreateIndex
CREATE INDEX "automationconfig_feature_idx" ON "automationconfig"("feature");

-- CreateIndex
CREATE INDEX "automationconfig_enabled_idx" ON "automationconfig"("enabled");

-- CreateIndex
CREATE INDEX "automationconfig_category_idx" ON "automationconfig"("category");

-- CreateIndex
CREATE INDEX "automationlog_configId_idx" ON "automationlog"("configId");

-- CreateIndex
CREATE INDEX "automationlog_feature_idx" ON "automationlog"("feature");

-- CreateIndex
CREATE INDEX "automationlog_action_idx" ON "automationlog"("action");

-- CreateIndex
CREATE INDEX "automationlog_createdAt_idx" ON "automationlog"("createdAt");

-- CreateIndex
CREATE INDEX "automationlog_userId_idx" ON "automationlog"("userId");

-- CreateIndex
CREATE INDEX "adminlog_adminId_idx" ON "adminlog"("adminId");

-- CreateIndex
CREATE INDEX "idx_adminlog_action" ON "adminlog"("action");

-- CreateIndex
CREATE UNIQUE INDEX "systemsettings_key_key" ON "systemsettings"("key");

-- CreateIndex
CREATE INDEX "verificationcode_email_code_idx" ON "verificationcode"("email", "code");

-- CreateIndex
CREATE INDEX "verificationcode_expiresAt_idx" ON "verificationcode"("expiresAt");

-- AddForeignKey
ALTER TABLE "userbadge" ADD CONSTRAINT "userbadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userbadge" ADD CONSTRAINT "userbadge_badgeType_fkey" FOREIGN KEY ("badgeType") REFERENCES "badge"("type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing" ADD CONSTRAINT "listing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "paymentmethod"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pushsubscription" ADD CONSTRAINT "pushsubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automationlog" ADD CONSTRAINT "automationlog_configId_fkey" FOREIGN KEY ("configId") REFERENCES "automationconfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adminlog" ADD CONSTRAINT "adminlog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
