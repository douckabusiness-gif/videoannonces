'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSuccess(true);
                setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            } else {
                setError('Une erreur est survenue. Veuillez réessayer.');
            }
        } catch (err) {
            setError('Impossible d\'envoyer le message. Vérifiez votre connexion.');
        } finally {
            setLoading(false);
        }
    };

    const contactMethods = [
        {
            icon: '📧',
            title: 'Email',
            value: 'contact@videoboutique.ci',
            link: 'mailto:contact@videoboutique.ci',
            color: 'from-blue-500 to-blue-600'
        },
        {
            icon: '📱',
            title: 'Téléphone',
            value: '+225 07 09 19 43 18',
            link: 'tel:+2250709194318',
            color: 'from-green-500 to-green-600'
        },
        {
            icon: '💬',
            title: 'WhatsApp',
            value: 'Chat en direct',
            link: 'https://wa.me/2250709194318',
            color: 'from-emerald-500 to-emerald-600'
        },
        {
            icon: '📍',
            title: 'Adresse',
            value: 'Abidjan, Côte d\'Ivoire',
            link: '#',
            color: 'from-orange-500 to-red-600'
        }
    ];

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
                    <h1 className="text-5xl font-black mb-4">Contactez-nous 📞</h1>
                    <p className="text-xl text-white/90">Nous sommes là pour vous aider !</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 mb-6">Envoyez-nous un message</h2>

                        {success && (
                            <div className="mb-6 p-4 bg-green-50 border-2 border-green-500 rounded-2xl text-green-800">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">✅</span>
                                    <div>
                                        <div className="font-bold">Message envoyé !</div>
                                        <div className="text-sm">Nous vous répondrons dans les 24 heures.</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-2xl text-red-800">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">❌</span>
                                    <div className="font-bold">{error}</div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                    Nom complet *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                                    placeholder="Votre nom"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                                        placeholder="votre@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">
                                        Téléphone
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                                        placeholder="0709194318"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                    Sujet *
                                </label>
                                <select
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                                >
                                    <option value="">Choisissez un sujet</option>
                                    <option value="support">Support technique</option>
                                    <option value="account">Problème de compte</option>
                                    <option value="payment">Question de paiement</option>
                                    <option value="report">Signaler un problème</option>
                                    <option value="partnership">Partenariat</option>
                                    <option value="other">Autre</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    rows={6}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-500 focus:border-orange-500 outline-none transition resize-none"
                                    placeholder="Décrivez votre demande en détail..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${loading
                                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:scale-105'
                                    }`}
                            >
                                {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 mb-6">Autres moyens de contact</h2>

                        <div className="space-y-4 mb-8">
                            {contactMethods.map((method, index) => (
                                <a
                                    key={index}
                                    href={method.link}
                                    target={method.link.startsWith('http') ? '_blank' : undefined}
                                    rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    className="block bg-white rounded-2xl p-6 hover:shadow-lg transition-all hover:scale-105"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
                                            {method.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-bold text-gray-500 uppercase">{method.title}</div>
                                            <div className="text-lg font-bold text-gray-900">{method.value}</div>
                                        </div>
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* Hours */}
                        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white">
                            <h3 className="text-xl font-bold mb-4">⏰ Horaires de support</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Lundi - Vendredi</span>
                                    <span className="font-bold">8h - 18h</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Samedi</span>
                                    <span className="font-bold">9h - 14h</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Dimanche</span>
                                    <span className="font-bold">Fermé</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/20 text-sm text-white/90">
                                Temps de réponse moyen : <strong>2-4 heures</strong>
                            </div>
                        </div>

                        {/* FAQ Link */}
                        <div className="mt-6 bg-white rounded-2xl p-6 text-center">
                            <div className="text-4xl mb-3">💡</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Besoin d'aide rapide ?</h3>
                            <p className="text-gray-600 mb-4">Consultez notre centre d'aide pour des réponses immédiates</p>
                            <Link
                                href="/help"
                                className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:scale-105 transition-transform"
                            >
                                Centre d'aide
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
