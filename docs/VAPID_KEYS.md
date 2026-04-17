# Web Push VAPID Keys Configuration

## Clés Générées

Ajoutez ces lignes à votre fichier `.env` :

```env
# Web Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BAZvNJso2CWiqaMuOOR-6vbwviT5l4K_XG00OaPC5OW9zpOKLdpKG4JA0994kyL8Csa5F6LV26dkw97fan-bO4Pw
VAPID_PRIVATE_KEY=hwQboV_S_Z369IgHyTsmEi8EWEOJeD5BU7YMnOptECI
```

## Instructions

1. **Ouvrez** le fichier `.env` à la racine du projet
2. **Ajoutez** les deux lignes ci-dessus
3. **Sauvegardez** le fichier
4. **Redémarrez** le serveur Next.js (`npm run dev`)

## Important

⚠️ **NE JAMAIS COMMITER** ces clés dans Git !
- Le fichier `.env` est déjà dans `.gitignore`
- Ces clés sont sensibles et doivent rester secrètes

## Pour Production

Utilisez les mêmes clés en production pour que les abonnements fonctionnent sur tous les environnements.

Configurez-les dans les variables d'environnement de votre VPS.
