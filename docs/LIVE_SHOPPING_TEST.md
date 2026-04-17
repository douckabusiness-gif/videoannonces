# Guide de Test - Live Shopping

## 🎯 Objectif
Tester le système de Live Shopping en local avec WebRTC.

---

## ⚠️ Prérequis

### 1. Base de données à jour
```bash
npx prisma generate
npx prisma db push
```

### 2. Serveurs arrêtés
Si vous avez des serveurs en cours, arrêtez-les (Ctrl+C).

---

## 🚀 Étape 1 : Démarrer les Serveurs

### Terminal 1 : Next.js
```bash
npm run dev
```

Attendez le message : `✓ Ready in X ms`

### Terminal 2 : Serveur Live
```bash
npm run live-server
```

Vous devriez voir :
```
🎥 ========================================
🎥 Serveur Live Shopping démarré !
🎥 Port: 3001
🎥 WebRTC: Prêt
🎥 Socket.io: Prêt
🎥 ========================================
```

---

## 📝 Étape 2 : Créer une Session Live

### 2.1 Se connecter
1. Ouvrez http://localhost:3000
2. Connectez-vous avec votre compte

### 2.2 Créer un live
1. Allez sur http://localhost:3000/dashboard/live/create
2. Remplissez le formulaire :
   - **Titre** : "Test Live Shopping"
   - **Description** : "Premier test du système live"
3. Cliquez "🎥 Créer le Live"

Vous serez redirigé vers `/dashboard/live/[id]`

---

## 🎥 Étape 3 : Démarrer le Stream (Vendeur)

### 3.1 Autoriser caméra/micro
Le navigateur va demander l'accès :
- ✅ Autoriser la caméra
- ✅ Autoriser le microphone

### 3.2 Démarrer le live
1. Cliquez sur "🎥 Démarrer Live"
2. Vous devriez voir :
   - Votre vidéo en preview
   - Badge "EN DIRECT" rouge
   - Compteur "0 viewers"

### 3.3 Vérifier les logs
Dans le terminal du serveur live, vous devriez voir :
```
🔌 Client connecté: xxx
📹 Producer video créé pour stream xxx
📹 Producer audio créé pour stream xxx
```

---

## 👁️ Étape 4 : Regarder le Live (Viewer)

### 4.1 Ouvrir un second navigateur
**Option A : Mode Incognito**
- Chrome : Ctrl+Shift+N
- Firefox : Ctrl+Shift+P

**Option B : Autre navigateur**
- Si vous avez Chrome, utilisez Firefox (ou inverse)

### 4.2 Accéder au live
1. Allez sur http://localhost:3000/live
2. Vous devriez voir votre live dans la liste
3. Cliquez dessus

### 4.3 Vérifier le stream
Vous devriez voir :
- La vidéo du vendeur
- Badge "EN DIRECT"
- Chat à droite

### 4.4 Vérifier le compteur
Sur l'écran du vendeur, le compteur devrait passer à "1 viewer"

---

## 💬 Étape 5 : Tester le Chat

### Côté Viewer
1. Tapez un message dans le chat
2. Appuyez sur Entrée ou cliquez "Envoyer"

### Côté Vendeur
Le message devrait apparaître instantanément dans le chat

### Test bidirectionnel
Le vendeur peut aussi envoyer des messages que le viewer verra

---

## 🧪 Tests à Effectuer

### ✅ Checklist Vendeur
- [ ] Caméra s'affiche
- [ ] Micro fonctionne
- [ ] Bouton "Démarrer Live" fonctionne
- [ ] Badge "EN DIRECT" apparaît
- [ ] Compteur viewers s'incrémente
- [ ] Chat fonctionne
- [ ] Bouton "Arrêter Live" fonctionne

### ✅ Checklist Viewer
- [ ] Liste des lives affiche le live
- [ ] Clic ouvre le viewer
- [ ] Vidéo se charge
- [ ] Audio fonctionne
- [ ] Chat fonctionne
- [ ] Messages apparaissent en temps réel

### ✅ Checklist Technique
- [ ] Serveur Next.js : Port 3000
- [ ] Serveur Live : Port 3001
- [ ] WebRTC connecté
- [ ] Socket.io connecté
- [ ] Pas d'erreurs console

---

## 🐛 Dépannage

### Problème : "Impossible de se connecter au live"

**Solution 1 : Vérifier les serveurs**
```bash
# Terminal 1
npm run dev

# Terminal 2
npm run live-server
```

**Solution 2 : Vérifier les ports**
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :3001
```

### Problème : "Caméra non détectée"

**Solutions :**
1. Vérifier que la caméra n'est pas utilisée par une autre app
2. Autoriser l'accès dans les paramètres du navigateur
3. Essayer un autre navigateur

### Problème : "Pas de vidéo côté viewer"

**Vérifier dans la console :**
```javascript
// Ouvrir DevTools (F12)
// Onglet Console
// Chercher les erreurs WebRTC
```

**Solutions :**
1. Rafraîchir la page viewer
2. Redémarrer le serveur live
3. Vérifier que le vendeur a bien démarré le stream

### Problème : "Chat ne fonctionne pas"

**Vérifier :**
1. Socket.io connecté (badge vert dans le chat)
2. Pas d'erreurs dans la console
3. Serveur live en cours d'exécution

---

## 📊 Logs à Surveiller

### Terminal Next.js
```
✓ Compiled in X ms
GET /api/live 200
GET /api/live/[id] 200
```

### Terminal Serveur Live
```
🔌 Client connecté: xxx
📹 Producer video créé
📹 Producer audio créé
👁️ Viewer xxx consomme stream
```

### Console Navigateur (F12)
```
✅ Stream démarré
✅ Stream reçu
Socket.io: Connecté
```

---

## 🎬 Scénario de Test Complet

### 1. Préparation (2 min)
- [ ] Démarrer Next.js
- [ ] Démarrer serveur live
- [ ] Se connecter

### 2. Création (1 min)
- [ ] Créer session live
- [ ] Autoriser caméra/micro
- [ ] Démarrer stream

### 3. Viewing (2 min)
- [ ] Ouvrir mode incognito
- [ ] Accéder à /live
- [ ] Cliquer sur le live
- [ ] Vérifier vidéo/audio

### 4. Interaction (2 min)
- [ ] Envoyer message (viewer)
- [ ] Répondre (vendeur)
- [ ] Vérifier temps réel

### 5. Fin (1 min)
- [ ] Arrêter le live
- [ ] Vérifier statut "ENDED"
- [ ] Viewer déconnecté

**Durée totale : ~8 minutes**

---

## ✅ Résultat Attendu

Si tout fonctionne :
- ✅ Vidéo en temps réel
- ✅ Audio clair
- ✅ Chat instantané
- ✅ Compteur viewers précis
- ✅ Pas de lag (<1s)

---

## 📞 Problèmes Fréquents

### "ERR_CONNECTION_REFUSED"
→ Serveur live non démarré

### "Camera not found"
→ Pas de caméra ou non autorisée

### "WebRTC failed"
→ Redémarrer serveur live

### "Socket disconnected"
→ Vérifier port 3001

---

## 🎉 Test Réussi !

Si vous voyez :
- Vidéo du vendeur chez le viewer
- Chat qui fonctionne
- Compteur qui s'incrémente

**Félicitations ! Le Live Shopping fonctionne ! 🚀**

---

## 📝 Notes

- Le système utilise WebRTC peer-to-peer
- Latence normale : <1 seconde
- Qualité vidéo : 720p par défaut
- Limite viewers : Dépend du CPU

**Prêt pour tester ?** Suivez les étapes ci-dessus ! 🎬
