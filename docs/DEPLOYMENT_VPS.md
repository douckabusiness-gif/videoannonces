# Guide de Déploiement VPS - VideoBoutique

## 📋 Prérequis

- VPS OVH (4,99€/mois) commandé
- Accès SSH (IP + root password)
- Nom de domaine (optionnel mais recommandé)

---

## 🚀 Étape 1 : Connexion et Configuration Initiale

### 1.1 Connexion SSH

```bash
ssh root@VOTRE_IP_VPS
```

### 1.2 Mise à jour du système

```bash
apt update && apt upgrade -y
```

### 1.3 Créer un utilisateur non-root

```bash
adduser videoboutique
usermod -aG sudo videoboutique
```

### 1.4 Configuration SSH (sécurité)

```bash
nano /etc/ssh/sshd_config
```

Modifier :
```
PermitRootLogin no
PasswordAuthentication yes  # Ou no si vous utilisez des clés SSH
```

Redémarrer SSH :
```bash
systemctl restart sshd
```

---

## 🔧 Étape 2 : Installation des Dépendances

### 2.1 Node.js 20.x

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs
node --version  # Vérifier version
npm --version
```

### 2.2 MySQL 8.0

```bash
apt install -y mysql-server
mysql_secure_installation
```

Répondre :
- Remove anonymous users? **Yes**
- Disallow root login remotely? **Yes**
- Remove test database? **Yes**
- Reload privilege tables? **Yes**

Créer la base de données :
```bash
mysql -u root -p
```

```sql
CREATE DATABASE videoboutique CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'vbuser'@'localhost' IDENTIFIED BY 'VOTRE_MOT_DE_PASSE_FORT';
GRANT ALL PRIVILEGES ON videoboutique.* TO 'vbuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2.3 Nginx

```bash
apt install -y nginx
systemctl start nginx
systemctl enable nginx
```

### 2.4 PM2 (Process Manager)

```bash
npm install -g pm2
```

### 2.5 Certbot (SSL)

```bash
apt install -y certbot python3-certbot-nginx
```

---

## 📦 Étape 3 : Déploiement de l'Application

### 3.1 Cloner le projet

```bash
cd /home/videoboutique
git clone VOTRE_REPO_GIT videoboutique
cd videoboutique
```

Ou via SFTP/SCP si pas de Git :
```bash
# Depuis votre PC local
scp -r c:\laragon\www\videoboutique videoboutique@VOTRE_IP:/home/videoboutique/
```

### 3.2 Installer les dépendances

```bash
npm install
```

### 3.3 Configuration .env

```bash
nano .env
```

Contenu :
```env
# Database
DATABASE_URL="mysql://vbuser:VOTRE_MOT_DE_PASSE@localhost:3306/videoboutique"

# NextAuth
NEXTAUTH_URL=https://votre-domaine.com
NEXTAUTH_SECRET=GENERER_UNE_CLE_SECRETE_ALEATOIRE

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=votre_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=videoboutique

# Live Server
LIVE_SERVER_PORT=3001
LIVE_SERVER_IP=VOTRE_IP_PUBLIQUE

# Cron
CRON_SECRET=GENERER_UNE_CLE_SECRETE

# Encryption
ENCRYPTION_KEY=GENERER_UNE_CLE_32_CARACTERES
```

Générer clés secrètes :
```bash
# NextAuth Secret
openssl rand -base64 32

# Encryption Key
openssl rand -hex 16
```

### 3.4 Prisma Migration

```bash
npx prisma generate
npx prisma db push
```

### 3.5 Seed initial (badges)

```bash
node prisma/seeds/badges.js
```

### 3.6 Build Next.js

```bash
npm run build
```

---

## ⚙️ Étape 4 : Configuration PM2

### 4.1 Créer ecosystem.config.js

```bash
nano ecosystem.config.js
```

Contenu :
```javascript
module.exports = {
  apps: [
    {
      name: 'videoboutique-web',
      script: 'npm',
      args: 'start',
      cwd: '/home/videoboutique/videoboutique',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
    {
      name: 'videoboutique-live',
      script: 'server-live.js',
      cwd: '/home/videoboutique/videoboutique',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
```

### 4.2 Démarrer avec PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Copier et exécuter la commande affichée.

### 4.3 Vérifier les logs

```bash
pm2 logs
pm2 status
```

---

## 🌐 Étape 5 : Configuration Nginx

### 5.1 Créer la configuration

```bash
nano /etc/nginx/sites-available/videoboutique
```

Contenu :
```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name votre-domaine.com www.votre-domaine.com;

    # SSL Configuration (sera ajouté par Certbot)
    # ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Next.js App
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Live Server WebSocket
    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Upload limit for videos
    client_max_body_size 100M;
}
```

### 5.2 Activer le site

```bash
ln -s /etc/nginx/sites-available/videoboutique /etc/nginx/sites-enabled/
nginx -t  # Tester la configuration
systemctl restart nginx
```

---

## 🔒 Étape 6 : SSL avec Let's Encrypt

```bash
certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

Répondre aux questions et choisir :
- Redirect HTTP to HTTPS? **Yes**

Renouvellement automatique :
```bash
certbot renew --dry-run
```

---

## 🔥 Étape 7 : Firewall

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
ufw status
```

---

## 📊 Étape 8 : Monitoring

### 8.1 PM2 Monitoring

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 8.2 Vérifier l'utilisation

```bash
pm2 monit
htop
df -h  # Espace disque
```

---

## 🔄 Étape 9 : Mises à Jour

### Script de déploiement

```bash
nano /home/videoboutique/deploy.sh
```

Contenu :
```bash
#!/bin/bash
cd /home/videoboutique/videoboutique

# Pull latest code
git pull origin main

# Install dependencies
npm install

# Build
npm run build

# Restart services
pm2 restart all

echo "✅ Déploiement terminé !"
```

Rendre exécutable :
```bash
chmod +x /home/videoboutique/deploy.sh
```

Utilisation :
```bash
./deploy.sh
```

---

## 🧹 Étape 10 : Cron Jobs

### Nettoyage stories expirées

```bash
crontab -e
```

Ajouter :
```cron
# Nettoyer stories expirées toutes les heures
0 * * * * curl -H "Authorization: Bearer VOTRE_CRON_SECRET" https://votre-domaine.com/api/cron/clean-stories

# Backup DB tous les jours à 3h
0 3 * * * mysqldump -u vbuser -pVOTRE_MOT_DE_PASSE videoboutique > /home/videoboutique/backups/db_$(date +\%Y\%m\%d).sql
```

Créer dossier backups :
```bash
mkdir -p /home/videoboutique/backups
```

---

## ✅ Vérification Finale

### Checklist

- [ ] Site accessible via HTTPS
- [ ] Next.js fonctionne
- [ ] Serveur Live fonctionne (port 3001)
- [ ] SSL actif
- [ ] PM2 auto-restart configuré
- [ ] Firewall activé
- [ ] Cron jobs configurés
- [ ] Backups automatiques

### Tests

```bash
# Test Next.js
curl https://votre-domaine.com

# Test Live Server
curl http://localhost:3001

# Vérifier PM2
pm2 status

# Vérifier Nginx
systemctl status nginx

# Vérifier MySQL
systemctl status mysql
```

---

## 🆘 Dépannage

### Logs

```bash
# PM2 logs
pm2 logs videoboutique-web
pm2 logs videoboutique-live

# Nginx logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

# MySQL logs
tail -f /var/log/mysql/error.log
```

### Redémarrer services

```bash
pm2 restart all
systemctl restart nginx
systemctl restart mysql
```

---

## 📞 Support

En cas de problème :
1. Vérifier les logs
2. Vérifier la configuration
3. Redémarrer les services
4. Vérifier le firewall

**Votre site sera accessible à : https://votre-domaine.com** 🎉
