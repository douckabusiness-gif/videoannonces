# 📱 VideoBoutique - Plateforme E-commerce Innovante

> Plateforme de vente en ligne avec Live Shopping, Stories 24h, et Notifications Push

## 🎯 Fonctionnalités Principales

### ✅ Phase 1 - COMPLÈTE

1. **Stories 24h** 📸
   - Upload vidéo éphémère
   - Expiration automatique
   - Viewer fullscreen
   - Tracking des vues

2. **Badges Vendeurs** 🏆
   - 7 types de badges
   - Attribution automatique
   - Affichage dynamique

3. **Live Shopping** 🎥
   - Streaming WebRTC natif
   - Chat temps réel
   - 100% indépendant
   - Multi-viewers

4. **Notifications Push** 🔔
   - Web Push API
   - Multi-appareils
   - Historique persistant
   - Badge de compteur

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- MySQL 8+
- npm ou yarn

### Installation

```bash
# Cloner le projet
git clone [votre-repo]
cd videoboutique

# Installer dépendances
npm install

# Configurer .env
cp .env.example .env
# Éditer .env avec vos clés

# Migrer la base de données
npx prisma migrate dev

# Démarrer le serveur
npm run dev
```

### Serveur Live (optionnel)

```bash
# Dans un autre terminal
npm run live-server
```

## 📚 Documentation

### Guides de Test
- [Stories Testing](docs/STORIES_TESTING.md)
- [Live Shopping Test](docs/LIVE_SHOPPING_TEST.md)
- [Push Notifications Quick Start](docs/PUSH_QUICK_START.md)

### Déploiement
- [Guide VPS Complet](docs/DEPLOYMENT_VPS.md)
- [Phase 1 Complete](docs/PHASE_1_COMPLETE.md)

## 🛠️ Stack Technique

- **Frontend:** Next.js 15, React, TailwindCSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Base de données:** MySQL
- **Auth:** NextAuth.js
- **Upload:** Cloudinary
- **Live:** Mediasoup (WebRTC)
- **Chat:** Socket.io
- **Notifications:** Web Push API

## 💰 Coûts

- **Développement:** Gratuit
- **Production:** ~6€/mois (VPS + domaine)
- **Aucun coût tiers** pour live, notifications, chat

## 📦 Scripts Disponibles

```bash
npm run dev          # Serveur Next.js (port 3000)
npm run live-server  # Serveur Live (port 3001)
npm run dev:all      # Les deux en parallèle
npm run build        # Build production
npm start            # Démarrer production
```

## 🎉 Statut

**Phase 1 : ✅ COMPLÈTE**

Toutes les fonctionnalités innovantes sont implémentées et testées.
Prêt pour le déploiement en production !

## 📄 Licence

[Votre Licence]

## 🙏 Support

Pour toute question, consultez la documentation dans `/docs`

---

**Créé avec ❤️ pour VideoBoutique**
