'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/I18nContext';
import { toast } from 'react-hot-toast';

const fonts = [
    { id: 'inter', name: 'Inter', style: 'font-sans' },
    { id: 'roboto', name: 'Roboto', style: 'font-roboto' },
    { id: 'opensans', name: 'Open Sans', style: 'font-opensans' },
    { id: 'lato', name: 'Lato', style: 'font-lato' },
    { id: 'montserrat', name: 'Montserrat', style: 'font-montserrat' },
];

export default function FontsPage() {
    const { t } = useTranslation();
    const [currentFont, setCurrentFont] = useState('inter');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchFontSettings();
    }, []);

    const fetchFontSettings = async () => {
        try {
            const res = await fetch('/api/dashboard/premium/fonts');
            if (res.ok) {
                const data = await res.json();
                setCurrentFont(data.fontFamily);
            }
        } catch (error) {
            console.error('Error loading font settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (fontId: string) => {
        setSaving(true);
        setCurrentFont(fontId); // Optimistic update
        try {
            const res = await fetch('/api/dashboard/premium/fonts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fontFamily: fontId })
            });

            if (res.ok) {
                toast.success('Police mise à jour avec succès');
            } else {
                toast.error('Erreur lors de la mise à jour');
            }
        } catch (error) {
            console.error('Error saving font:', error);
            toast.error('Erreur serveur');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center animate-pulse">Chargement...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 mb-2">Police Personnalisée</h1>
                <p className="text-gray-500">Choisissez une police d'écriture qui correspond à l'identité de votre marque.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fonts.map((font) => (
                    <div
                        key={font.id}
                        onClick={() => handleSave(font.id)}
                        className={`
                            cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group
                            ${currentFont === font.id
                                ? 'border-purple-600 bg-purple-50 ring-4 ring-purple-100'
                                : 'border-gray-200 hover:border-purple-300 hover:shadow-lg bg-white'
                            }
                        `}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-lg text-gray-900">{font.name}</h3>
                            {currentFont === font.id && (
                                <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                                    Active
                                </span>
                            )}
                        </div>

                        <div className="space-y-2 text-gray-600">
                            <p className="text-2xl font-black">Aa Bb Cc</p>
                            <p className="text-sm">Le renard brun rapide saute par-dessus le chien paresseux.</p>
                            <p className="text-sm">1234567890</p>
                        </div>

                        {/* Preview Indicator */}
                        <div className={`
                            absolute inset-0 bg-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center
                            ${currentFont === font.id ? 'hidden' : ''}
                        `}>
                            <span className="bg-white px-4 py-2 rounded-full shadow-lg text-purple-600 font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                Choisir cette police
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
