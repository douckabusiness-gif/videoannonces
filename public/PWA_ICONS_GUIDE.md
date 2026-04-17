# Guide de création des icônes PWA

Vous avez besoin de créer des icônes supplémentaires pour le manifest.json.

## Icônes requises

À partir de votre `icon-512.png` existant, créez les tailles suivantes :
- icon-72.png (72x72)
- icon-96.png (96x96)
- icon-128.png (128x128)
- icon-144.png (144x144)
- icon-152.png (152x152)
- icon-384.png (384x384)

## Option 1 : Outil en ligne (Le plus simple)

1. Allez sur https://realfavicongenerator.net/
2. Uploadez `public/icon-512.png`
3. Téléchargez toutes les tailles générées
4. Placez-les dans `public/`

## Option 2 : ImageMagick (Ligne de commande)

Si vous avez ImageMagick installé :

```bash
cd public
magick convert icon-512.png -resize 72x72 icon-72.png
magick convert icon-512.png -resize 96x96 icon-96.png
magick convert icon-512.png -resize 128x128 icon-128.png
magick convert icon-512.png -resize 144x144 icon-144.png
magick convert icon-512.png -resize 152x152 icon-152.png
magick convert icon-512.png -resize 384x384 icon-384.png
```

## Option 3 : Photoshop / GIMP

Ouvrez `icon-512.png` et exportez en plusieurs tailles.

## Icônes de shortcuts

Créez également dans `public/shortcuts/` :
- add.png (96x96) - Icône "+"
- messages.png (96x96) - Icône message/chat
- dashboard.png (96x96) - Icône tableau de bord

## Screenshots

Créez des captures d'écran dans `public/screenshots/` :
- home.png (540x720) - Homepage mobile
- listing.png (540x720) - Page produit mobile
- dashboard.png (1280x720) - Dashboard desktop

**Astuce** : Utilisez les DevTools Chrome en mode mobile (F12 > Toggle device toolbar) pour prendre les screenshots.
