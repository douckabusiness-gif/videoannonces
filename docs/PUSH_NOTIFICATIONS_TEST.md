# Guide de Test - Notifications Push 🔔

## Prérequis

✅ Clés VAPID configurées dans `.env`  
✅ Package `web-push` installé  
✅ Serveur Next.js en cours d'exécution  
✅ Navigateur moderne (Chrome, Firefox, Edge)

---

## 1. Configuration Initiale

### Étape 1 : Ajouter les Clés VAPID

Ouvrez `.env` et ajoutez :

```env
# Web Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BAZvNJso2CWiqaMuOOR-6vbwviT5l4K_XG00OaPC5OW9zpOKLdpKG4JA0994kyL8Csa5F6LV26dkw97fan-bO4Pw
VAPID_PRIVATE_KEY=hwQboV_S_Z369IgHyTsmEi8EWEOJeD5BU7YMnOptECI
```

### Étape 2 : Migrer la Base de Données

```bash
npx prisma migrate dev --name add_push_notifications
```

### Étape 3 : Redémarrer le Serveur

```bash
npm run dev
```

---

## 2. Ajouter le Composant NotificationBell

### Dans votre Layout ou Navbar

Ajoutez le composant `NotificationBell` :

```tsx
import NotificationBell from '@/components/notifications/NotificationBell';

// Dans votre composant
<NotificationBell />
```

**Exemple d'intégration dans la navbar :**

```tsx
<nav className="flex items-center gap-4">
  <Link href="/dashboard">Dashboard</Link>
  <NotificationBell />
  <UserMenu />
</nav>
```

---

## 3. Tests de Base

### Test 1 : Vérifier le Support

1. Ouvrez votre application
2. Connectez-vous
3. Cliquez sur l'icône 🔔
4. Vérifiez que le bouton "Activer les notifications" s'affiche

**Résultat attendu :** Bouton visible et cliquable

---

### Test 2 : S'Abonner aux Notifications

1. Cliquez sur "🔔 Activer les notifications"
2. Acceptez la permission dans le navigateur
3. Le bouton devrait changer en "🔕 Désactiver les notifications"

**Résultat attendu :**
- Permission accordée
- Service Worker enregistré
- Abonnement créé en base de données

**Vérification en base :**
```sql
SELECT * FROM PushSubscription WHERE userId = 'votre_user_id';
```

---

### Test 3 : Notification de Test (Live)

1. Créez un live shopping
2. Démarrez le live
3. Vous devriez recevoir une notification

**Résultat attendu :**
- Notification push affichée
- Titre : "🎥 Votre live a démarré !"
- Corps : Titre du live
- Clic ouvre la page du live

---

## 4. Tests Avancés

### Test 4 : Historique des Notifications

1. Cliquez sur l'icône 🔔
2. Vérifiez que la notification du live apparaît
3. Badge de compteur doit afficher "1"

**Résultat attendu :**
- Notification visible dans le dropdown
- Badge rouge avec le nombre
- Notification marquée comme non lue (fond orange)

---

### Test 5 : Marquer comme Lu

1. Cliquez sur une notification dans le dropdown
2. Elle devrait disparaître du compteur
3. Le fond orange devrait disparaître

**Résultat attendu :**
- Compteur décrémenté
- Notification marquée comme lue en base
- Redirection vers l'URL de la notification

---

### Test 6 : Désabonnement

1. Cliquez sur "🔕 Désactiver les notifications"
2. L'abonnement devrait être supprimé

**Résultat attendu :**
- Bouton redevient "🔔 Activer les notifications"
- Abonnement supprimé de la base
- Plus de notifications reçues

---

### Test 7 : Multi-Appareils

1. Connectez-vous sur 2 navigateurs différents
2. Activez les notifications sur les deux
3. Démarrez un live
4. Les deux appareils devraient recevoir la notification

**Résultat attendu :**
- 2 abonnements en base pour le même user
- 2 notifications envoyées
- Les deux appareils reçoivent

---

## 5. Vérifications Console

### Console Navigateur (F12)

**Messages attendus :**
```
✅ Service Worker enregistré
Abonnement actuel: Actif
✅ Abonné aux notifications push
```

### Console Serveur

**Messages attendus :**
```
✅ Abonnement push créé/mis à jour: [id]
✅ Notification envoyée: [endpoint]
✅ Notification live envoyée
✅ Notification traitée: [id]
```

---

## 6. Debugging

### Problème : Permission Refusée

**Solution :**
1. Ouvrir les paramètres du site (🔒 dans la barre d'adresse)
2. Réinitialiser les permissions
3. Recharger la page
4. Réessayer

---

### Problème : Service Worker Non Enregistré

**Solution :**
1. Ouvrir DevTools > Application > Service Workers
2. Vérifier que `/sw.js` est enregistré
3. Si non, cliquer "Unregister" puis recharger

---

### Problème : Notifications Non Reçues

**Vérifications :**
1. Clés VAPID correctes dans `.env`
2. Service Worker actif
3. Permission accordée
4. Abonnement en base de données
5. Console serveur pour erreurs

---

## 7. Test de Production

### HTTPS Requis

⚠️ **Important :** Les notifications push nécessitent HTTPS en production !

**Sur VPS :**
1. Configurer SSL avec Let's Encrypt
2. Vérifier que le site est en `https://`
3. Tester les notifications

---

## 8. Checklist Complète

- [ ] Clés VAPID configurées
- [ ] Migration DB effectuée
- [ ] Composant NotificationBell ajouté
- [ ] Service Worker enregistré
- [ ] Permission accordée
- [ ] Abonnement créé
- [ ] Notification de test reçue
- [ ] Historique visible
- [ ] Marquer comme lu fonctionne
- [ ] Désabonnement fonctionne
- [ ] Multi-appareils testé
- [ ] Console sans erreurs

---

## 9. Prochaines Étapes

Une fois les tests validés, vous pouvez :

1. **Ajouter d'autres déclencheurs :**
   - Nouveau message
   - Nouvelle vente
   - Nouvelle commande
   - Nouvel avis

2. **Personnaliser les notifications :**
   - Icônes personnalisées
   - Sons différents
   - Actions personnalisées

3. **Analytics :**
   - Taux d'ouverture
   - Taux de clic
   - Désabonnements

---

## Support

**Navigateurs supportés :**
- ✅ Chrome 42+
- ✅ Firefox 44+
- ✅ Edge 17+
- ✅ Safari 16+ (macOS)
- ❌ iOS Safari (pas de support)

**Bon test ! 🚀**
