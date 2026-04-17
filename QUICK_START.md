# 🚀 Guide de Démarrage - VideoBoutique

## ✅ Projet Prêt à Tester !

Le projet VideoBoutique est opérationnel avec toutes les fonctionnalités de base.

---

## 📋 Checklist Avant de Commencer

### 1. **Vérifier MySQL**
- ✅ MySQL est démarré via Laragon
- ✅ Base de données `videoboutique` créée
- ✅ Tables créées (via `prisma/schema.sql`)

### 2. **Configurer Cloudinary** (IMPORTANT pour upload vidéo)

**Étapes :**
1. Créer un compte gratuit : https://cloudinary.com
2. Aller dans Dashboard → Settings → Access Keys
3. Copier vos identifiants :
   - Cloud Name
   - API Key
   - API Secret

4. Ouvrir le fichier `.env` et ajouter :
```env
CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=votre-api-key
CLOUDINARY_API_SECRET=votre-api-secret
```

### 3. **Générer un secret NextAuth**

Dans PowerShell :
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copier le résultat dans `.env` :
```env
NEXTAUTH_SECRET=le-secret-genere
```

---

## 🎯 Tester le Projet

### **Étape 1 : Créer un compte**
1. Ouvrir http://localhost:3000
2. Cliquer sur "Inscription"
3. Remplir :
   - Nom : Test User
   - Téléphone : 0123456789
   - Mot de passe : test123
   - Langue : Français
4. Cliquer "Créer mon compte"

### **Étape 2 : Se connecter**
1. Aller sur http://localhost:3000/login
2. Téléphone : 0123456789
3. Mot de passe : test123
4. Cliquer "Se connecter"

### **Étape 3 : Créer une annonce vidéo**
1. Depuis le dashboard, cliquer "Créer une annonce"
2. Uploader une vidéo courte (max 60s, 50MB)
3. Remplir :
   - Titre : iPhone 13 Pro 256GB
   - Description : Comme neuf, avec boîte
   - Prix : 350000
   - Catégorie : Électronique
   - Localisation : Cocody, Abidjan
4. Cliquer "Publier l'annonce"

### **Étape 4 : Voir les annonces**
1. Aller sur http://localhost:3000/listings
2. Filtrer par catégorie
3. Cliquer sur une annonce pour voir les détails

### **Étape 5 : Tester la messagerie**
1. Créer un 2ème compte (autre téléphone)
2. Depuis ce compte, contacter le vendeur d'une annonce
3. Envoyer des messages
4. Retourner au 1er compte pour voir les messages

---

## 🔧 Commandes Utiles

### **Démarrer le serveur**
```bash
npm run dev
```
Serveur : http://localhost:3000

### **Voir la base de données**
```bash
npx prisma studio
```
Interface : http://localhost:5555

### **Générer le client Prisma** (si modif schema)
```bash
npx prisma generate
```

### **Voir les logs**
Les logs s'affichent dans le terminal où `npm run dev` tourne

---

## 📁 Pages Disponibles

| URL | Description |
|-----|-------------|
| `/` | Landing page |
| `/register` | Inscription |
| `/login` | Connexion |
| `/dashboard` | Tableau de bord |
| `/listings` | Liste des annonces |
| `/create` | Créer une annonce |
| `/messages` | Conversations |
| `/messages/[id]` | Chat |

---

## 🎨 Fonctionnalités Testables

✅ **Authentification**
- Inscription avec validation
- Connexion sécurisée
- Sessions JWT

✅ **Annonces Vidéo**
- Upload vers Cloudinary
- Compression automatique
- Miniatures générées
- Filtres par catégorie
- Limite 5 annonces (gratuit)

✅ **Messagerie**
- Conversations privées
- Messages texte
- Auto-refresh (3s)
- Compteur non lus

✅ **UI/UX**
- Design moderne
- Responsive mobile
- Animations fluides
- Multilingue (FR/AR/EN)

---

## ⚠️ Limitations Actuelles

**Compte Gratuit :**
- Max 5 annonces actives
- Pas de sous-domaine
- Pas de boost
- Stats basiques

**Compte Premium (5000 FCFA/mois) :**
- Annonces illimitées
- Sous-domaine personnalisé
- Boost annonces
- Stats avancées

---

## 🐛 Dépannage

### **Erreur "Cannot find module"**
```bash
npm install
```

### **Erreur Prisma**
```bash
npx prisma generate
```

### **Erreur upload vidéo**
- Vérifier que Cloudinary est configuré dans `.env`
- Vérifier que la vidéo fait moins de 50MB
- Vérifier que la durée est moins de 60s

### **Erreur base de données**
- Vérifier que MySQL est démarré
- Vérifier que la base `videoboutique` existe
- Vérifier `DATABASE_URL` dans `.env`

---

## 📊 Statistiques du Projet

**Développement :**
- Temps : ~2 heures
- Lignes de code : ~4000
- Fichiers créés : 30+
- API Routes : 10+
- Pages UI : 8

**Technologies :**
- Next.js 14
- TypeScript
- Tailwind CSS
- MySQL + Prisma
- Cloudinary
- NextAuth

---

## 🚀 Prochaines Fonctionnalités

**Phase 5 : IA** (à venir)
- Chatbot intelligent
- Réponses automatiques
- Modération contenu

**Phase 6 : Paiements** (à venir)
- Orange Money
- MTN Mobile Money
- Wave

**Phase 7 : Boutiques** (à venir)
- Sous-domaines personnalisés
- Thèmes de couleurs
- Bannières custom

---

## 💡 Conseils

1. **Testez d'abord sans vidéo** : Créez des annonces avec des vidéos de test
2. **Utilisez 2 comptes** : Pour tester la messagerie
3. **Vérifiez les logs** : En cas d'erreur, regardez le terminal
4. **Prisma Studio** : Utile pour voir les données en temps réel

---

## ✅ Projet Opérationnel !

Le MVP est prêt pour :
- ✅ Tests utilisateurs
- ✅ Démo clients
- ✅ Développement des fonctionnalités avancées

**Bon test ! 🎉**
