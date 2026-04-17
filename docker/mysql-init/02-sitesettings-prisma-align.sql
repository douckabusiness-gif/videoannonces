-- Colonnes ajoutées dans Prisma après d'anciens dumps (idempotent pour réimport)
ALTER TABLE `sitesettings`
  ADD COLUMN IF NOT EXISTS `backgroundColor` varchar(191) NOT NULL DEFAULT '#FFF7ED',
  ADD COLUMN IF NOT EXISTS `headerColor` varchar(191) NOT NULL DEFAULT '#FFFFFF',
  ADD COLUMN IF NOT EXISTS `footerColor` varchar(191) NOT NULL DEFAULT '#FFFFFF',
  ADD COLUMN IF NOT EXISTS `headerTextColor` varchar(191) NOT NULL DEFAULT '#000000',
  ADD COLUMN IF NOT EXISTS `footerTextColor` varchar(191) NOT NULL DEFAULT '#000000',
  ADD COLUMN IF NOT EXISTS `urgentBgColor` varchar(191) NOT NULL DEFAULT '#FFFFFF',
  ADD COLUMN IF NOT EXISTS `shopsBgColor` varchar(191) NOT NULL DEFAULT '#FFFFFF',
  ADD COLUMN IF NOT EXISTS `recentBgColor` varchar(191) NOT NULL DEFAULT '#FFFFFF',
  ADD COLUMN IF NOT EXISTS `urgentTextColor` varchar(191) NOT NULL DEFAULT '#000000',
  ADD COLUMN IF NOT EXISTS `shopsTextColor` varchar(191) NOT NULL DEFAULT '#000000',
  ADD COLUMN IF NOT EXISTS `recentTextColor` varchar(191) NOT NULL DEFAULT '#000000',
  ADD COLUMN IF NOT EXISTS `pwaIcon` varchar(191) NULL;
