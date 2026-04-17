'use client';

import Link from 'next/link';

export default function PrivacyPage() {
    const sections = [
        {
            title: '1. Introduction',
            content: `VideoBoutique ("nous", "notre") s'engage à protéger votre vie privée. Cette Politique de Confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos informations personnelles lorsque vous utilisez notre plateforme de petites annonces vidéo.`
        },
        {
            title: '2. Informations que nous collectons',
            content: `Nous collectons les informations suivantes :

• Informations de compte : nom, numéro de téléphone, email, mot de passe (crypté)
• Informations de profil : photo de profil, description, localisation
• Contenu publié : vidéos, descriptions d'annonces, messages
• Données de paiement : informations de transaction (via nos partenaires de paiement)
• Données techniques : adresse IP, type de navigateur, système d'exploitation
• Données d'utilisation : pages visitées, annonces consultées, interactions`
        },
        {
            title: '3. Comment nous utilisons vos informations',
            content: `Nous utilisons vos informations pour :

• Fournir et améliorer nos services
• Créer et gérer votre compte
• Publier et afficher vos annonces
• Faciliter les communications entre acheteurs et vendeurs
• Traiter les paiements d'abonnement Premium
• Personnaliser votre expérience
• Détecter et prévenir la fraude
• Envoyer des notifications importantes
• Analyser l'utilisation de la plateforme
• Respecter nos obligations légales`
        },
        {
            title: '4. Partage de vos informations',
            content: `Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos informations avec :

• Autres utilisateurs : votre profil public et vos annonces sont visibles par tous
• Prestataires de services : hébergement, paiement, analytics (sous contrat strict)
• Autorités légales : si requis par la loi ou pour protéger nos droits
• En cas de fusion/acquisition : vos données peuvent être transférées

Nous ne partageons vos données qu'avec votre consentement ou dans les cas mentionnés ci-dessus.`
        },
        {
            title: '5. Sécurité de vos données',
            content: `Nous mettons en œuvre des mesures de sécurité pour protéger vos informations :

• Cryptage SSL/TLS pour toutes les transmissions
• Mots de passe hashés avec bcrypt
• Serveurs sécurisés avec pare-feu
• Accès limité aux données personnelles
• Surveillance continue des menaces
• Sauvegardes régulières

Aucun système n'est 100% sécurisé. Nous vous recommandons d'utiliser un mot de passe fort et unique.`
        },
        {
            title: '6. Vos droits',
            content: `Conformément aux lois sur la protection des données, vous avez le droit de :

• Accéder à vos données personnelles
• Corriger vos informations inexactes
• Supprimer votre compte et vos données
• Exporter vos données
• Vous opposer au traitement de vos données
• Retirer votre consentement
• Déposer une plainte auprès de l'autorité compétente

Pour exercer ces droits, contactez-nous à privacy@videoboutique.ci`
        },
        {
            title: '7. Cookies et technologies similaires',
            content: `Nous utilisons des cookies pour :

• Maintenir votre session connectée
• Mémoriser vos préférences
• Analyser l'utilisation du site
• Améliorer les performances

Vous pouvez désactiver les cookies dans votre navigateur, mais cela peut affecter certaines fonctionnalités.`
        },
        {
            title: '8. Conservation des données',
            content: `Nous conservons vos données tant que votre compte est actif. Après suppression de votre compte :

• Vos données personnelles sont supprimées dans les 30 jours
• Certaines données peuvent être conservées pour des obligations légales
• Les données anonymisées peuvent être conservées pour des statistiques

Vous pouvez demander la suppression immédiate de vos données à tout moment.`
        },
        {
            title: '9. Données des mineurs',
            content: `VideoBoutique est réservé aux personnes de 18 ans et plus. Nous ne collectons pas sciemment d'informations sur les mineurs. Si vous pensez qu'un mineur a créé un compte, contactez-nous immédiatement.`
        },
        {
            title: '10. Transferts internationaux',
            content: `Vos données sont stockées en Côte d'Ivoire. Si nous transférons des données hors du pays, nous nous assurons qu'elles bénéficient d'une protection adéquate conforme aux normes internationales.`
        },
        {
            title: '11. Marketing et communications',
            content: `Nous pouvons vous envoyer :

• Notifications sur votre compte et vos annonces
• Mises à jour importantes du service
• Offres promotionnelles (avec votre consentement)

Vous pouvez vous désabonner des communications marketing à tout moment via les paramètres de votre compte.`
        },
        {
            title: '12. Modifications de cette politique',
            content: `Nous pouvons modifier cette Politique de Confidentialité. Les changements importants seront notifiés par email ou via une notification sur la plateforme. La date de dernière mise à jour est indiquée en haut de cette page.`
        },
        {
            title: '13. Contact',
            content: `Pour toute question concernant cette politique ou vos données personnelles :

Email : privacy@videoboutique.ci
Téléphone : +225 07 09 19 43 18
Adresse : Abidjan, Côte d'Ivoire

Nous nous engageons à répondre dans les 48 heures.`
        }
    ];

    const highlights = [
        {
            icon: '🔒',
            title: 'Sécurité maximale',
            description: 'Vos données sont cryptées et protégées'
        },
        {
            icon: '🚫',
            title: 'Pas de vente de données',
            description: 'Nous ne vendons jamais vos informations'
        },
        {
            icon: '✅',
            title: 'Contrôle total',
            description: 'Vous pouvez accéder, modifier ou supprimer vos données'
        },
        {
            icon: '🇨🇮',
            title: 'Conformité locale',
            description: 'Respect des lois ivoiriennes sur les données'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Retour à l'accueil
                    </Link>
                    <h1 className="text-5xl font-black mb-4">Politique de Confidentialité 🔐</h1>
                    <p className="text-xl text-white/90">Dernière mise à jour : 27 novembre 2024</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Introduction */}
                <div className="bg-white rounded-3xl p-8 shadow-sm mb-8">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="text-5xl">🛡️</div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 mb-3">Votre vie privée est importante</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Chez VideoBoutique, nous prenons la protection de vos données personnelles très au sérieux.
                                Cette politique explique en détail comment nous collectons, utilisons et protégeons vos informations.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Highlights */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                    {highlights.map((item, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="text-4xl mb-3">{item.icon}</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                            <p className="text-gray-600 text-sm">{item.description}</p>
                        </div>
                    ))}
                </div>

                {/* Table of Contents */}
                <div className="bg-white rounded-3xl p-8 shadow-sm mb-8">
                    <h2 className="text-2xl font-black text-gray-900 mb-6">📑 Table des matières</h2>
                    <div className="grid md:grid-cols-2 gap-3">
                        {sections.map((section, index) => (
                            <a
                                key={index}
                                href={`#section-${index}`}
                                className="text-orange-600 hover:text-orange-700 hover:underline font-medium"
                            >
                                {section.title}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Sections */}
                <div className="space-y-6">
                    {sections.map((section, index) => (
                        <div
                            key={index}
                            id={`section-${index}`}
                            className="bg-white rounded-3xl p-8 shadow-sm scroll-mt-8"
                        >
                            <h2 className="text-2xl font-black text-gray-900 mb-4">{section.title}</h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{section.content}</p>
                        </div>
                    ))}
                </div>

                {/* GDPR-style Notice */}
                <div className="mt-8 bg-blue-50 border-2 border-blue-500 rounded-3xl p-8">
                    <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
                        <span className="text-3xl">ℹ️</span>
                        Vos droits en résumé
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">✓</span>
                            <span>Droit d'accès à vos données</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">✓</span>
                            <span>Droit de rectification</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">✓</span>
                            <span>Droit à l'effacement</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">✓</span>
                            <span>Droit à la portabilité</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">✓</span>
                            <span>Droit d'opposition</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">✓</span>
                            <span>Droit de retrait du consentement</span>
                        </div>
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="mt-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-8 text-white text-center">
                    <h2 className="text-3xl font-black mb-4">Des questions sur vos données ?</h2>
                    <p className="text-xl text-white/90 mb-6">Contactez notre équipe de protection des données</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="mailto:privacy@videoboutique.ci"
                            className="px-8 py-4 bg-white text-orange-600 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-lg"
                        >
                            privacy@videoboutique.ci
                        </a>
                        <Link
                            href="/contact"
                            className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-bold text-lg hover:scale-105 transition-transform"
                        >
                            Formulaire de contact
                        </Link>
                    </div>
                </div>

                {/* Legal Notice */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>© 2024 VideoBoutique. Tous droits réservés.</p>
                    <p className="mt-2">
                        <Link href="/terms" className="hover:text-orange-600">Conditions d'utilisation</Link>
                        {' • '}
                        <Link href="/contact" className="hover:text-orange-600">Contact</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
