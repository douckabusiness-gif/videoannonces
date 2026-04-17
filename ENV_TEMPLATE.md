# Variables d'environnement - VideoBoutique

# Base de données MySQL
DATABASE_URL=mysql://root@localhost:3306/videoboutique

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre-secret-genere-ici-changez-moi

# Cloudinary (à configurer)
CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=votre-api-key
CLOUDINARY_API_SECRET=votre-api-secret

# OpenAI (optionnel pour l'instant)
OPENAI_API_KEY=

# Redis (optionnel en dev)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# Paiements (à configurer plus tard)
ORANGE_MONEY_API_KEY=
MTN_MONEY_API_KEY=
WAVE_API_KEY=

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000

# Mode vitrine solo (pas de marketplace ouverte : seul toi / les admins publient)
# Même valeur côté client pour masquer les boutons « Publier » (true / 1)
NEXT_PUBLIC_SOLO_BUSINESS_MODE=false
# Optionnel : SOLO_BUSINESS_MODE=true (prioritaire sur NEXT_PUBLIC si défini)
# SOLO_BUSINESS_MODE=false
# ID Prisma du compte autorisé à publier (sinon : uniquement les comptes ADMIN)
# SOLO_PUBLISHER_USER_ID=
# Plusieurs comptes : SOLO_PUBLISHER_USER_IDS=id1,id2
# Message d’erreur API personnalisé (optionnel)
# SOLO_PUBLISH_DENIED_MESSAGE=

# Inscription & vendeur par défaut (sinon : tout gérer depuis Admin → Utilisateurs, bandeau en haut)
# Les valeurs sont stockées en base (table setting) une fois modifiées dans l’admin.
