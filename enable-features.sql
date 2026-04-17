-- Activer l'inscription publique et le mode multi-vendeur
INSERT INTO setting (id, `key`, value, description, createdAt, updatedAt)
VALUES (
    CONCAT('plat', LEFT(UUID(), 20)),
    'platform.public_registration_enabled',
    'true',
    'Inscription publique activee',
    NOW(3),
    NOW(3)
) ON DUPLICATE KEY UPDATE value = 'true', updatedAt = NOW(3);

INSERT INTO setting (id, `key`, value, description, createdAt, updatedAt)
VALUES (
    CONCAT('plat', LEFT(UUID(), 20)),
    'platform.signup_default_vendor',
    'true',
    'Nouveaux comptes crees comme vendeur',
    NOW(3),
    NOW(3)
) ON DUPLICATE KEY UPDATE value = 'true', updatedAt = NOW(3);

-- Verification
SELECT `key`, value FROM setting WHERE `key` LIKE 'platform.%';
