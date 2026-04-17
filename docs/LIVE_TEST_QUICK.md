# Test Rapide Live Shopping - DÉMARRAGE

## 🚀 Étapes Rapides

### 1️⃣ Démarrer les Serveurs

**Terminal 1 - Next.js :**
```bash
npm run dev
```
Attendez : `✓ Ready`

**Terminal 2 - Serveur Live :**
```bash
npm run live-server
```
Attendez : `🎥 Serveur Live Shopping démarré !`

---

### 2️⃣ Créer un Live (Vendeur)

1. **Connexion** : http://localhost:3000/login
2. **Créer Live** : http://localhost:3000/dashboard/live/create
   - Titre : "Test Live"
   - Description : "Premier test"
   - Cliquer "Créer le Live"

3. **Démarrer Stream** :
   - Autoriser caméra + micro
   - Cliquer "🎥 Démarrer Live"
   - Vérifier badge "EN DIRECT"

---

### 3️⃣ Regarder le Live (Viewer)

**Ouvrir Mode Incognito** (Ctrl+Shift+N)

1. Aller sur : http://localhost:3000/live
2. Cliquer sur votre live
3. Vérifier :
   - ✅ Vidéo s'affiche
   - ✅ Audio fonctionne
   - ✅ Chat visible

---

### 4️⃣ Tester le Chat

**Viewer** : Envoyer message
**Vendeur** : Répondre

Les messages doivent apparaître instantanément !

---

## ✅ Checklist Rapide

- [ ] Next.js démarré (port 3000)
- [ ] Serveur Live démarré (port 3001)
- [ ] Live créé
- [ ] Stream démarré
- [ ] Viewer voit la vidéo
- [ ] Chat fonctionne

---

## 🐛 Problème ?

**Serveur ne démarre pas ?**
→ Vérifier qu'aucun autre serveur n'utilise les ports 3000/3001

**Caméra non détectée ?**
→ Autoriser dans les paramètres du navigateur

**Pas de vidéo chez viewer ?**
→ Rafraîchir la page

---

**Durée : 5 minutes** ⏱️

**Prêt ? Lancez les commandes ci-dessus !** 🎬
