# Serveur Live - Variables d'Environnement

## Ajouter dans votre fichier .env

```env
# Serveur Live Shopping
LIVE_SERVER_PORT=3001
LIVE_SERVER_IP=127.0.0.1

# En production, remplacer par votre IP publique
# LIVE_SERVER_IP=VOTRE_IP_PUBLIQUE
```

## Utilisation

### Développement Local

```bash
# Démarrer le serveur live
node server-live.js

# Ou avec nodemon (auto-restart)
npx nodemon server-live.js
```

### Production

Remplacer `127.0.0.1` par votre IP publique dans `server-live.js` ligne 181 :

```javascript
announcedIp: 'VOTRE_IP_PUBLIQUE'
```

## Ports Utilisés

- **3000** : Next.js (application principale)
- **3001** : Serveur Live (WebRTC + Socket.io)

## Test de Connexion

Une fois le serveur démarré, vous devriez voir :

```
🎥 ========================================
🎥 Serveur Live Shopping démarré !
🎥 Port: 3001
🎥 WebRTC: Prêt
🎥 Socket.io: Prêt
🎥 ========================================
```
