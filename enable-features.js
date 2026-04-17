const mysql = require('mysql2/promise');

async function enableFeatures() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'doucka2026_videoboutique'
  });

  console.log('Connexion à la base de données réussie.');

  // Afficher les paramètres actuels
  const [rows] = await conn.execute('SELECT * FROM `Setting` WHERE `key` LIKE "platform.%"');
  console.log('\nParametres actuels:', JSON.stringify(rows, null, 2));

  // Activer l'inscription publique
  await conn.execute(
    'INSERT INTO `Setting` (`key`, `value`, `description`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
    ['platform.public_registration_enabled', 'true', 'Inscription publique activee', 'true']
  );
  console.log('\n✅ Inscription publique : ACTIVEE');

  // Activer le mode multi-vendeur (signup default vendor)
  await conn.execute(
    'INSERT INTO `Setting` (`key`, `value`, `description`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
    ['platform.signup_default_vendor', 'true', 'Nouveaux comptes crees comme vendeur', 'true']
  );
  console.log('✅ Mode multi-vendeur (signup_default_vendor) : ACTIVE');

  // Vérifier le résultat
  const [updated] = await conn.execute('SELECT * FROM `Setting` WHERE `key` LIKE "platform.%"');
  console.log('\nParametres mis à jour:', JSON.stringify(updated, null, 2));

  await conn.end();
  console.log('\nTerminé !');
}

enableFeatures().catch(console.error);
