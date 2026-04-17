#!/bin/bash

echo "🚀 Déploiement VideoBoutique..."

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Aller dans le dossier du projet
cd /home/videoboutique/videoboutique || exit

# Pull latest code
echo "📥 Récupération du code..."
git pull origin main

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors du pull Git${NC}"
    exit 1
fi

# Install dependencies
echo "📦 Installation des dépendances..."
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors de l'installation${NC}"
    exit 1
fi

# Prisma generate
echo "🔧 Génération Prisma..."
npx prisma generate

# Build Next.js
echo "🏗️  Build de l'application..."
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors du build${NC}"
    exit 1
fi

# Restart PM2
echo "🔄 Redémarrage des services..."
pm2 restart all

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors du redémarrage PM2${NC}"
    exit 1
fi

# Save PM2 config
pm2 save

echo -e "${GREEN}✅ Déploiement terminé avec succès !${NC}"
echo ""
echo "📊 Status des services :"
pm2 status
