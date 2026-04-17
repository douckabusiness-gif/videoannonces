'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import { toast } from 'react-hot-toast';

interface Template {
    id: string;
    trigger: string;
    response: string;
    active: boolean;
}

export default function AutomationTab() {
    const { data: session, update } = useSession();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [aiEnabled, setAiEnabled] = useState(session?.user?.aiReplyEnabled ?? true);
    const [togglingIA, setTogglingIA] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState<Partial<Template>>({
        trigger: '',
        response: '',
        active: true
    });

    const isPremium = session?.user?.premium;

    useEffect(() => {
        if (session?.user?.aiReplyEnabled !== undefined) {
            setAiEnabled(session.user.aiReplyEnabled);
        }
    }, [session?.user?.aiReplyEnabled]);

    const handleToggleIA = async (enabled: boolean) => {
        // Update optimiste
        const previousState = aiEnabled;
        setAiEnabled(enabled);
        setTogglingIA(true);

        const toastId = toast.loading(enabled ? 'Activation de l\'IA...' : 'Désactivation de l\'IA...');

        try {
            const res = await fetch('/api/automation/toggle-ia', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enabled }),
            });

            if (res.ok) {
                const data = await res.json();
                if (update) {
                    await update({
                        user: {
                            aiReplyEnabled: data.aiReplyEnabled
                        }
                    });
                }
                toast.success(enabled ? 'Smart Reply IA activé !' : 'Smart Reply IA désactivé !', { id: toastId });
            } else {
                throw new Error('Erreur API');
            }
        } catch (error) {
            console.error('Erreur toggle IA:', error);
            setAiEnabled(previousState); // Revenir à l'état précédent en cas d'erreur
            toast.error('Impossible de modifier le réglage IA', { id: toastId });
        } finally {
            setTogglingIA(false);
        }
    };

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
                alert('✅ Règle sauvegardée avec succès !');
            }
        } catch (error) {
            console.error('Erreur sauvegarde:', error);
            alert('❌ Erreur lors de la sauvegarde');
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

    // Affichage pour non-Premium
    if (!isPremium && !loading) {
        return (
            <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-center text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                    <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                        <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-black">Fonctionnalité Premium 💎</h2>
                        <p className="text-gray-300 leading-relaxed">
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

                {/* Preview floutée */}
                <div className="opacity-50 blur-sm pointer-events-none select-none">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Vos règles actives</h3>
                            <button className="px-6 py-3 bg-gray-200 text-gray-500 rounded-xl font-bold">
                                + Nouvelle règle
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">SI MESSAGE CONTIENT</span>
                                    <span className="font-black">"prix"</span>
                                </div>
                                <p className="text-gray-600 italic">"Le prix est fixe : 15.000 FCFA"</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Affichage pour Premium
    return (
        <div className="space-y-6">
            {/* Header / Status IA */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                </div>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`${aiEnabled ? 'bg-blue-400/30' : 'bg-gray-400/30'} px-2 py-0.5 rounded text-xs font-bold tracking-widest uppercase`}>
                                {aiEnabled ? 'Mode IA Active' : 'Mode IA Désactivé'}
                            </span>
                            {aiEnabled && <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>}
                        </div>
                        <h3 className="text-2xl font-black">Smart Reply IA</h3>
                        <p className="text-blue-100 text-sm opacity-90">L'IA répondra intelligemment aux clients si aucune règle ne correspond.</p>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <button
                            onClick={() => handleToggleIA(!aiEnabled)}
                            disabled={togglingIA}
                            className={`w-14 h-8 rounded-full transition-all relative shadow-inner ${aiEnabled ? 'bg-green-500' : 'bg-gray-400'}`}
                        >
                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-lg flex items-center justify-center ${aiEnabled ? 'right-1' : 'left-1'}`}>
                                {togglingIA && <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>}
                            </div>
                        </button>
                        <span className="text-[10px] font-bold uppercase tracking-wider">{aiEnabled ? 'Activé' : 'Désactivé'}</span>
                    </div>

                    <div className="hidden lg:block">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                            <p className="text-xs font-bold text-blue-200 mb-1">PROMPT CONTEXTUEL</p>
                            <p className="text-sm italic">"Utilise les détails de l'annonce..."</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Templates Rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { id: 'price', icon: '💰', title: 'Prix & Négociation', trigger: 'prix', response: 'Le prix est fixe et déjà calculé au plus juste. Merci de votre compréhension !' },
                    { id: 'avail', icon: '📦', title: 'Disponibilité', trigger: 'dispo', response: 'Oui, ce produit est toujours disponible ! Quand souhaiteriez-vous passer ?' },
                    { id: 'loc', icon: '📍', title: 'Localisation', trigger: 'lieu', response: 'Je suis situé à [VOTRE VILLE/QUARTIER]. On peut se donner rendez-vous demain.' },
                ].map(temp => (
                    <button
                        key={temp.id}
                        onClick={() => {
                            setCurrentTemplate({ trigger: temp.trigger, response: temp.response });
                            setIsEditing(true);
                        }}
                        className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition text-left group"
                    >
                        <div className="text-2xl mb-2">{temp.icon}</div>
                        <h4 className="font-bold text-gray-900 group-hover:text-blue-600">{temp.title}</h4>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">Auto-complétion du mot-clé "{temp.trigger}"</p>
                    </button>
                ))}
            </div>

            {/* Liste des règles */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">🤖 Vos règles personnalisées</h3>
                        <p className="text-sm text-gray-600 mt-1">{templates.length} règle(s) active(s)</p>
                    </div>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition shadow-lg flex items-center gap-2"
                    >
                        <span>+</span> Nouvelle règle
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-8 text-gray-500 italic">Chargement des règles...</div>
                ) : templates.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <div className="text-5xl mb-4 opacity-30">🤖</div>
                        <p className="text-gray-500 font-medium">Aucune règle configurée pour le moment.</p>
                        <p className="text-sm text-gray-400 mt-2">Utilisez les suggestions ci-dessus pour commencer !</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {templates.map((template) => (
                            <div key={template.id} className="flex items-start justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/10 transition group">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm">
                                            <span className="text-xs font-bold text-gray-400 uppercase mr-2">IF</span>
                                            <span className="font-black text-blue-600 text-lg">"{template.trigger}"</span>
                                        </div>
                                        {!template.active && (
                                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                                                Désactivée
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-start gap-3 mt-4">
                                        <div className="w-1 bg-blue-500 rounded-full h-full"></div>
                                        <div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase block mb-1">REPLY WITH</span>
                                            <p className="text-gray-700 font-medium italic">"{template.response}"</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                                    <button
                                        onClick={() => {
                                            setCurrentTemplate(template);
                                            setIsEditing(true);
                                        }}
                                        className="p-3 bg-white text-gray-600 hover:text-blue-600 rounded-xl shadow-sm border border-gray-100 transition"
                                        title="Modifier"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(template.id)}
                                        className="p-3 bg-white text-gray-600 hover:text-red-600 rounded-xl shadow-sm border border-gray-100 transition"
                                        title="Supprimer"
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
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
                        <h3 className="text-2xl font-black text-gray-900 mb-6">
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
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition"
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
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition"
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
                                    className="w-5 h-5 text-green-500 rounded focus:ring-green-500 border-gray-300"
                                />
                                <label htmlFor="active" className="font-medium text-gray-700">Activer cette règle</label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setCurrentTemplate({ trigger: '', response: '', active: true });
                                    }}
                                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-bold hover:from-green-600 hover:to-teal-600 transition shadow-lg"
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
