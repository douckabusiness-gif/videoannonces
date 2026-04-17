'use client';

import Link from 'next/link';

export default function TermsPage() {
    const sections = [
        {
            title: '1. Acceptation des conditions',
            content: `En accédant et en utilisant VideoBoutique, vous acceptez d'être lié par les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.`
        },
        {
            title: '2. Description du service',
            content: `VideoBoutique est une plateforme de petites annonces vidéo permettant aux utilisateurs de publier, consulter et répondre à des annonces de vente de produits et services en Côte d'Ivoire. Nous facilitons la mise en relation entre acheteurs et vendeurs mais ne sommes pas partie aux transactions.`
        },
        {
            title: '3. Inscription et compte utilisateur',
            content: `Pour publier des annonces, vous devez créer un compte en fournissant des informations exactes et à jour. Vous êtes responsable de la confidentialité de votre mot de passe et de toutes les activités effectuées sous votre compte. Vous devez avoir au moins 18 ans pour créer un compte.`
        },
        {
            title: '4. Publication d\'annonces',
            content: `Vous vous engagez à publier uniquement des annonces légales, véridiques et conformes à nos règles. Les annonces doivent contenir des informations exactes sur les produits ou services proposés. Vous êtes seul responsable du contenu de vos annonces et des vidéos publiées.`
        },
        {
            title: '5. Contenu interdit',
            content: `Il est strictement interdit de publier des annonces concernant : armes, drogues, produits contrefaits, contenus pornographiques, services illégaux, animaux protégés, médicaments sans autorisation, ou tout contenu violant les lois ivoiriennes. VideoBoutique se réserve le droit de supprimer toute annonce non conforme.`
        },
        {
            title: '6. Propriété intellectuelle',
            content: `Vous conservez la propriété de vos vidéos et contenus. En publiant sur VideoBoutique, vous nous accordez une licence non exclusive pour afficher, distribuer et promouvoir votre contenu sur notre plateforme. Vous garantissez avoir tous les droits nécessaires sur le contenu publié.`
        },
        {
            title: '7. Transactions entre utilisateurs',
            content: `VideoBoutique n'est qu'un intermédiaire. Nous ne sommes pas responsables des transactions entre acheteurs et vendeurs. Les paiements, livraisons et litiges doivent être résolus directement entre les parties. Nous recommandons de rencontrer les vendeurs en personne et de vérifier les produits avant tout paiement.`
        },
        {
            title: '8. Abonnement Premium',
            content: `L'abonnement Premium est facturé mensuellement à 5000 FCFA. Il se renouvelle automatiquement sauf annulation. Vous pouvez annuler à tout moment depuis votre tableau de bord. Aucun remboursement n'est effectué pour les périodes non utilisées.`
        },
        {
            title: '9. Modération et suppression de contenu',
            content: `Nous nous réservons le droit de modérer, suspendre ou supprimer tout contenu ou compte violant nos conditions, sans préavis. Nous utilisons des systèmes automatisés et manuels pour détecter les contenus inappropriés.`
        },
        {
            title: '10. Limitation de responsabilité',
            content: `VideoBoutique est fourni "tel quel". Nous ne garantissons pas l'exactitude des annonces, la disponibilité du service, ou l'absence d'erreurs. Nous ne sommes pas responsables des pertes directes ou indirectes résultant de l'utilisation de notre plateforme.`
        },
        {
            title: '11. Protection des données',
            content: `Nous collectons et traitons vos données personnelles conformément à notre Politique de Confidentialité et aux lois ivoiriennes sur la protection des données. Vos données ne seront jamais vendues à des tiers.`
        },
        {
            title: '12. Résiliation',
            content: `Vous pouvez supprimer votre compte à tout moment. Nous pouvons suspendre ou résilier votre compte en cas de violation de ces conditions, d'activité frauduleuse, ou de comportement nuisible à la communauté.`
        },
        {
            title: '13. Modifications des conditions',
            content: `Nous pouvons modifier ces conditions à tout moment. Les modifications seront publiées sur cette page avec une nouvelle date d'entrée en vigueur. Votre utilisation continue de VideoBoutique après les modifications constitue votre acceptation des nouvelles conditions.`
        },
        {
            title: '14. Droit applicable',
            content: `Ces conditions sont régies par les lois de la Côte d'Ivoire. Tout litige sera soumis à la juridiction exclusive des tribunaux d'Abidjan.`
        },
        {
            title: '15. Contact',
            content: `Pour toute question concernant ces conditions, contactez-nous à contact@videoboutique.ci ou via notre page de contact.`
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
                    <h1 className="text-5xl font-black mb-4">Conditions d'utilisation 📋</h1>
                    <p className="text-xl text-white/90">Dernière mise à jour : 27 novembre 2024</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Introduction */}
                <div className="bg-white rounded-3xl p-8 shadow-sm mb-8">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="text-5xl">⚖️</div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 mb-3">Bienvenue sur VideoBoutique</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Les présentes Conditions d'Utilisation régissent votre accès et votre utilisation de la plateforme VideoBoutique.
                                En utilisant nos services, vous acceptez ces conditions dans leur intégralité. Veuillez les lire attentivement.
                            </p>
                        </div>
                    </div>

                    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl">
                        <p className="text-sm text-gray-700">
                            <strong>Important :</strong> Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser VideoBoutique.
                        </p>
                    </div>
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

                {/* Footer CTA */}
                <div className="mt-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-8 text-white text-center">
                    <h2 className="text-3xl font-black mb-4">Des questions sur nos conditions ?</h2>
                    <p className="text-xl text-white/90 mb-6">Notre équipe est disponible pour vous aider</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/contact"
                            className="px-8 py-4 bg-white text-orange-600 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-lg"
                        >
                            Contactez-nous
                        </Link>
                        <Link
                            href="/help"
                            className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-bold text-lg hover:scale-105 transition-transform"
                        >
                            Centre d'aide
                        </Link>
                    </div>
                </div>

                {/* Legal Notice */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>© 2024 VideoBoutique. Tous droits réservés.</p>
                    <p className="mt-2">
                        <Link href="/privacy" className="hover:text-orange-600">Politique de confidentialité</Link>
                        {' • '}
                        <Link href="/contact" className="hover:text-orange-600">Contact</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
