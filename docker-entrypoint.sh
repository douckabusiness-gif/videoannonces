#!/bin/sh
set -e

echo "🔄 Exécution des migrations Prisma PostgreSQL..."
npx prisma migrate deploy

echo "🌱 Vérification et insertion des catégories..."
npx tsx /app/seed-categories.ts || echo "⚠️  Seed catégories déjà effectué ou erreur ignorée"

echo "🚀 Démarrage de l'application Next.js..."
exec npm start
