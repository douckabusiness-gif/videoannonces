'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/I18nContext';
import { useRouter } from 'next/navigation';

export default function ReviewsPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await fetch('/api/reviews');
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (error) {
            console.error('Error loading reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFeatured = async (id: string, currentStatus: boolean) => {
        // Optimistic update
        setReviews(reviews.map(r =>
            r.id === id ? { ...r, featured: !currentStatus } : r
        ));

        try {
            const res = await fetch('/api/reviews', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, featured: !currentStatus })
            });

            if (!res.ok) {
                // Revert on error
                setReviews(reviews.map(r =>
                    r.id === id ? { ...r, featured: currentStatus } : r
                ));
                alert('Erreur lors de la mise à jour');
            }
        } catch (error) {
            console.error('Error updating review:', error);
            // Revert on error
            setReviews(reviews.map(r =>
                r.id === id ? { ...r, featured: currentStatus } : r
            ));
        }
    };

    if (loading) {
        return <div className="p-8 text-center animate-pulse">Chargement des avis...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">{t('dashboard.menu.reviews')}</h1>
                    <p className="text-gray-500 mt-2">Gérez les avis de vos clients et mettez en avant les meilleurs.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {reviews.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                        <p className="text-gray-500 text-lg">Aucun avis pour le moment.</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between transition hover:shadow-md">
                            <div className="flex gap-4 items-start">
                                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                    {review.reviewer.avatar ? (
                                        <img src={review.reviewer.avatar} alt={review.reviewer.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">
                                            {review.reviewer.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-gray-900">{review.reviewer.name}</h3>
                                        <span className="text-xs text-gray-400">• {new Date(review.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex text-yellow-400 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        ))}
                                    </div>
                                    <p className="text-gray-600">{review.comment}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => toggleFeatured(review.id, review.featured)}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all
                                    ${review.featured
                                        ? 'bg-yellow-100 text-yellow-700 border border-yellow-200 hover:bg-yellow-200'
                                        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                                    }
                                `}
                            >
                                <svg className={`w-5 h-5 ${review.featured ? 'fill-current' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                                </svg>
                                {review.featured ? 'Mis en avant' : 'Mettre en avant'}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
