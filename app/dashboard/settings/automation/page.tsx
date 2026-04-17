'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Template {
    id: string;
    trigger: string;
    response: string;
    active: boolean;
}

export default function AutomationSettingsPage() {
    const { data: session } = useSession();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState<Partial<Template>>({
        trigger: '',
        response: '',
        active: true
    });

    const isPremium = session?.user?.premium;

    useEffect(() => {
        if (isPremium) {
            fetchTemplates();
        } else {
            setLoading(false);
        }
    }, [isPremium]);

    const fetchTemplates = async () => {
        try {
            const res = await fetch('/api/automation/templates');
            if (res.ok) {
                const data = await res.json();
                setTemplates(data);
            }
        } catch (error) {
            console.error('Erreur chargement templates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/automation/templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentTemplate),
            });

            if (res.ok) {
                await fetchTemplates();
                setIsEditing(false);
                setCurrentTemplate({ trigger: '', response: '', active: true });
            }
        } catch (error) {
            console.error('Erreur sauvegarde:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette règle ?')) return;
        try {
            await fetch(`/api/automation/templates?id=${id}`, { method: 'DELETE' });
            fetchTemplates();
        } catch (error) {
            console.error('Erreur suppression:', error);
        }
    };

    if (!isPremium && !loading) {
        return (
            <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1 md:mb-2">🤖 Réponses Automatiques</h1>
                    <p className="text-sm md:text-base text-gray-600">Automatisez vos échanges pour gagner du temps.</p>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl md:rounded-3xl p-6 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                    <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                        <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30 rotate-3">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>

                        <h2 className="text-xl md:text-3xl font-black">Fonctionnalité Premium 💎</h2>
                        <p className="text-gray-300 text-sm md:text-lg leading-relaxed">
                            Les réponses automatiques sont réservées aux membres Premium.
                            Gagnez du temps en répondant automatiquement aux questions fréquentes de vos clients (prix, disponibilité, localisation...).
                        </p>

                        <div className="pt-6">
                            <Link
                                href="/dashboard/subscription"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl font-bold text-lg hover:scale-105 transition transform shadow-xl shadow-orange-500/20"
                            >
                                Passer Premium maintenant
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                        <p className="text-sm text-gray-500 mt-4">À partir de 5000 FCFA / mois</p>
                    </div>
                </div>

                {/* Preview floutée pour donner envie */}
                <div className="opacity-50 blur-sm pointer-events-none select-none" aria-hidden="true">
                    <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Vos règles actives</h2>
                            <button className="px-6 py-3 bg-gray-200 text-gray-500 rounded-xl font-bold flex items-center gap-2">
                                <span>+</span> Nouvelle règle
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">Si message contient</span>
                                        <span className="font-black text-gray-900">"prix"</span>
                                    </div>
                                    <p className="text-gray-600 italic">"Le prix est fixe : 15.000 FCFA"</p>
                                </div>
                            </div>
                            <div className="flex items-start justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">Si message contient</span>
                                        <span className="font-black text-gray-900">"dispo"</span>
                                    </div>
                                    <p className="text-gray-600 italic">"Oui, l'article est toujours disponible !"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1 md:mb-2">🤖 Réponses Automatiques</h1>
                <p className="text-sm md:text-base text-gray-600">Configurez des réponses automatiques pour gagner du temps.</p>
            </div>

            {/* Liste des règles */}
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-8 border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900">Vos règles actives</h2>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="w-full md:w-auto px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition flex items-center justify-center gap-2"
                    >
                        <span>+</span> Nouvelle règle
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-8">Chargement...</div>
                ) : templates.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-500 font-medium">Aucune règle configurée pour le moment.</p>
                        <p className="text-sm text-gray-400 mt-2">Créez votre première réponse automatique !</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {templates.map((template) => (
                            <div key={template.id} className="flex flex-col md:flex-row items-start justify-between p-4 md:p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-orange-200 transition gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                            Si message contient
                                        </span>
                                        <span className="font-black text-gray-900 text-lg">"{template.trigger}"</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide mt-1">
                                            Répondre
                                        </span>
                                        <p className="text-gray-600 italic">"{template.response}"</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                                    <button
                                        onClick={() => {
                                            setCurrentTemplate(template);
                                            setIsEditing(true);
                                        }}
                                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(template.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Édition */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4">
                    <div className="bg-white rounded-t-3xl md:rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-200 h-[80vh] md:h-auto overflow-y-auto">
                        <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-6">
                            {currentTemplate.id ? 'Modifier la règle' : 'Nouvelle règle'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Déclencheur (mot-clé)
                                </label>
                                <input
                                    type="text"
                                    value={currentTemplate.trigger}
                                    onChange={(e) => setCurrentTemplate({ ...currentTemplate, trigger: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition font-medium"
                                    placeholder="Ex: prix, disponibilité, livraison..."
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-2">Le bot répondra si le message du client contient ce mot.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Réponse automatique
                                </label>
                                <textarea
                                    value={currentTemplate.response}
                                    onChange={(e) => setCurrentTemplate({ ...currentTemplate, response: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition font-medium"
                                    placeholder="Ex: Le prix est fixe et non négociable. Merci !"
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="active"
                                    checked={currentTemplate.active}
                                    onChange={(e) => setCurrentTemplate({ ...currentTemplate, active: e.target.checked })}
                                    className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500 border-gray-300"
                                />
                                <label htmlFor="active" className="font-medium text-gray-700">Activer cette règle</label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/30"
                                >
                                    Sauvegarder
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
