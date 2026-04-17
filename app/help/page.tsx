'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

export default function HelpCenterPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { id: 'all', name: 'Toutes', icon: '📚' },
        { id: 'account', name: 'Compte', icon: '👤' },
        { id: 'listing', name: 'Annonces', icon: '📱' },
        { id: 'payment', name: 'Paiements', icon: '💳' },
        { id: 'security', name: 'Sécurité', icon: '🔒' },
        { id: 'premium', name: 'Premium', icon: '⭐' },
    ];

    const faqs: FAQItem[] = [
        {
            category: 'account',
            question: 'Comment créer un compte sur VideoBoutique ?',
            answer: 'Pour créer un compte, cliquez sur "S\'inscrire" en haut de la page, entrez votre numéro de téléphone et créez un mot de passe. Vous recevrez un code de vérification par SMS pour confirmer votre compte.'
        },
        {
            category: 'account',
            question: 'J\'ai oublié mon mot de passe, que faire ?',
            answer: 'Cliquez sur "Mot de passe oublié" sur la page de connexion. Entrez votre numéro de téléphone et suivez les instructions pour réinitialiser votre mot de passe.'
        },
        {
            category: 'listing',
            question: 'Comment publier une annonce vidéo ?',
            answer: 'Connectez-vous à votre compte, cliquez sur "Publier une annonce", remplissez les informations (titre, description, prix, catégorie), enregistrez ou téléchargez votre vidéo, puis publiez. Votre annonce sera visible immédiatement.'
        },
        {
            category: 'listing',
            question: 'Quelle est la durée maximale d\'une vidéo ?',
            answer: 'Les vidéos peuvent durer jusqu\'à 2 minutes pour les comptes gratuits et jusqu\'à 5 minutes pour les comptes Premium. Assurez-vous que votre vidéo soit claire et présente bien votre produit.'
        },
        {
            category: 'listing',
            question: 'Puis-je modifier mon annonce après publication ?',
            answer: 'Oui ! Accédez à "Mes annonces" dans votre tableau de bord, sélectionnez l\'annonce à modifier, puis cliquez sur "Modifier". Vous pouvez changer le texte, le prix, mais pas la vidéo.'
        },
        {
            category: 'payment',
            question: 'Quels moyens de paiement acceptez-vous ?',
            answer: 'Nous acceptons Orange Money, MTN Mobile Money et Wave pour les paiements d\'abonnement Premium. Les transactions entre acheteurs et vendeurs se font directement entre eux.'
        },
        {
            category: 'payment',
            question: 'Comment fonctionne l\'abonnement Premium ?',
            answer: 'L\'abonnement Premium coûte 5000 FCFA/mois et vous donne accès à des annonces illimitées, un sous-domaine personnalisé, des analytics avancés et un support prioritaire.'
        },
        {
            category: 'security',
            question: 'Comment éviter les arnaques ?',
            answer: 'Ne payez jamais avant d\'avoir vu le produit. Rencontrez le vendeur dans un lieu public. Vérifiez l\'état du produit avant de payer. Méfiez-vous des prix trop bas. Utilisez notre système de signalement si quelque chose vous semble suspect.'
        },
        {
            category: 'security',
            question: 'Comment signaler une annonce suspecte ?',
            answer: 'Sur chaque annonce, cliquez sur les trois points (...) puis "Signaler". Choisissez la raison du signalement et notre équipe examinera l\'annonce dans les 24 heures.'
        },
        {
            category: 'premium',
            question: 'Quels sont les avantages du compte Premium ?',
            answer: 'Avec Premium, vous obtenez : annonces illimitées, sous-domaine personnalisé (votrenom.videoboutique.ci), analytics détaillés, boost d\'annonces, support prioritaire, et badge Premium sur votre profil.'
        },
        {
            category: 'premium',
            question: 'Puis-je annuler mon abonnement Premium ?',
            answer: 'Oui, vous pouvez annuler à tout moment depuis votre tableau de bord. Votre abonnement restera actif jusqu\'à la fin de la période payée.'
        },
        {
            category: 'listing',
            question: 'Combien d\'annonces puis-je publier ?',
            answer: 'Les comptes gratuits peuvent publier jusqu\'à 5 annonces actives. Les comptes Premium n\'ont aucune limite.'
        },
        {
            category: 'account',
            question: 'Comment supprimer mon compte ?',
            answer: 'Allez dans Paramètres > Compte > Supprimer mon compte. Attention : cette action est irréversible et supprimera toutes vos annonces et données.'
        },
    ];

    const filteredFAQs = faqs.filter(faq => {
        const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
        const matchesSearch = searchQuery === '' ||
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Retour à l'accueil
                    </Link>
                    <h1 className="text-5xl font-black mb-4">Centre d'aide 💡</h1>
                    <p className="text-xl text-white/90 mb-8">Comment pouvons-nous vous aider aujourd'hui ?</p>

                    {/* Search Bar */}
                    <div className="max-w-2xl">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Rechercher dans l'aide..."
                                className="w-full px-6 py-4 pr-12 rounded-2xl text-gray-900 text-lg focus:ring-4 focus:ring-white/30 outline-none"
                            />
                            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Categories */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Catégories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`p-4 rounded-2xl text-center transition-all ${selectedCategory === cat.id
                                        ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg scale-105'
                                        : 'bg-white text-gray-700 hover:shadow-md hover:scale-105'
                                    }`}
                            >
                                <div className="text-3xl mb-2">{cat.icon}</div>
                                <div className="font-bold text-sm">{cat.name}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* FAQs */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Questions fréquentes ({filteredFAQs.length})
                    </h2>
                    <div className="space-y-4">
                        {filteredFAQs.map((faq, index) => (
                            <details key={index} className="bg-white rounded-2xl shadow-sm overflow-hidden group">
                                <summary className="px-6 py-5 cursor-pointer hover:bg-gray-50 transition-colors list-none flex items-center justify-between">
                                    <span className="font-bold text-gray-900 pr-4">{faq.question}</span>
                                    <svg className="w-5 h-5 text-orange-600 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </div>
                            </details>
                        ))}
                    </div>

                    {filteredFAQs.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-2xl">
                            <div className="text-6xl mb-4">🔍</div>
                            <p className="text-gray-600 text-lg">Aucun résultat trouvé pour votre recherche.</p>
                        </div>
                    )}
                </div>

                {/* Contact CTA */}
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-8 text-white text-center">
                    <h2 className="text-3xl font-black mb-4">Vous n'avez pas trouvé votre réponse ?</h2>
                    <p className="text-xl text-white/90 mb-6">Notre équipe est là pour vous aider !</p>
                    <Link
                        href="/contact"
                        className="inline-block px-8 py-4 bg-white text-orange-600 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-lg"
                    >
                        Contactez-nous
                    </Link>
                </div>
            </div>
        </div>
    );
}
