'use client';

import { useState, useEffect } from 'react';

interface Payment {
    id: string;
    amount: number;
    currency: string;
    status: string;
    paymentMethod: string;
    transactionId: string | null;
    proofUrl: string | null;
    reference: string;
    createdAt: string;
    metadata: any;
    user: {
        id: string;
        name: string | null;
        email: string | null;
        phone: string | null;
    };
}

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await fetch('/api/admin/payments');
            if (res.ok) {
                const data = await res.json();
                setPayments(data.payments);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: 'completed' | 'failed') => {
        if (!confirm(`Êtes-vous sûr de vouloir marquer ce paiement comme ${newStatus === 'completed' ? 'PAYÉ' : 'ÉCHOUÉ'} ?`)) return;

        setProcessingId(id);
        try {
            const res = await fetch(`/api/admin/payments/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                fetchPayments();
            } else {
                alert('Erreur lors de la mise à jour');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Erreur de connexion');
        } finally {
            setProcessingId(null);
        }
    };

    const filteredPayments = payments.filter(p => {
        if (filter === 'all') return true;
        return p.status === filter;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">Payé</span>;
            case 'pending':
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">En attente</span>;
            case 'failed':
                return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">Échoué</span>;
            default:
                return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold">{status}</span>;
        }
    };

    const getTypeLabel = (metadata: any) => {
        if (!metadata) return 'Inconnu';
        if (metadata.type === 'boost') return <span className="text-orange-600 font-bold">⚡ Boost</span>;
        if (metadata.type === 'subscription') return <span className="text-purple-600 font-bold">💎 Abonnement</span>;
        return metadata.type;
    };

    if (loading) return <div className="p-8 text-center">Chargement...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Paiements</h1>
                    <p className="text-gray-600 mt-1">Gérez les demandes de paiement et validations</p>
                </div>
                <div className="flex gap-2">
                    {['all', 'pending', 'completed', 'failed'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm capitalize ${filter === f ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {f === 'all' ? 'Tous' : f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4 font-bold text-gray-500 text-xs uppercase">Date</th>
                            <th className="px-6 py-4 font-bold text-gray-500 text-xs uppercase">Client</th>
                            <th className="px-6 py-4 font-bold text-gray-500 text-xs uppercase">Service</th>
                            <th className="px-6 py-4 font-bold text-gray-500 text-xs uppercase">Montant</th>
                            <th className="px-6 py-4 font-bold text-gray-500 text-xs uppercase">Preuve</th>
                            <th className="px-6 py-4 font-bold text-gray-500 text-xs uppercase">Statut</th>
                            <th className="px-6 py-4 font-bold text-gray-500 text-xs uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredPayments.map((payment) => (
                            <tr key={payment.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(payment.createdAt).toLocaleDateString('fr-FR', {
                                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                    })}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-900">{payment.user?.name || 'Inconnu'}</div>
                                    <div className="text-xs text-gray-500">{payment.user?.email}</div>
                                    <div className="text-xs text-blue-600 font-mono mt-1">
                                        {payment.metadata?.phoneNumber || payment.user?.phone || '-'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {getTypeLabel(payment.metadata)}
                                    <div className="text-xs text-gray-400 mt-1 font-mono truncate w-24" title={payment.reference}>
                                        {payment.reference}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-900">
                                    {payment.amount.toLocaleString()} {payment.currency}
                                    <div className="text-xs text-blue-600 font-mono mt-1 capitalize">
                                        {payment.paymentMethod?.replace('_', ' ')}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {payment.transactionId && (
                                        <div className="text-xs font-mono font-bold bg-gray-100 p-1 rounded inline-block mb-1">
                                            ID: {payment.transactionId}
                                        </div>
                                    )}

                                    {payment.proofUrl ? (
                                        <a href={payment.proofUrl} target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-600 hover:text-blue-800 underline flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            Voir Preuve
                                        </a>
                                    ) : (
                                        <span className="text-xs text-gray-400 italic">Aucune preuve</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(payment.status)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {payment.status === 'pending' && (
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleUpdateStatus(payment.id, 'completed')}
                                                disabled={processingId === payment.id}
                                                className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-xs font-bold transition disabled:opacity-50"
                                            >
                                                Valider
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(payment.id, 'failed')}
                                                disabled={processingId === payment.id}
                                                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-xs font-bold transition disabled:opacity-50"
                                            >
                                                Refuser
                                            </button>
                                        </div>
                                    )}
                                    {payment.status === 'completed' && (
                                        <span className="text-xs text-green-600 font-medium">Validé</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredPayments.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        Aucun paiement trouvé
                    </div>
                )}
            </div>
        </div>
    );
}
