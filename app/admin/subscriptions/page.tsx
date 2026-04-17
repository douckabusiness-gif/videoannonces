'use client';

import { useState, useEffect } from 'react';

interface PendingSubscription {
    id: string;
    reference: string;
    amount: number;
    paymentMethod: string;
    status: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
    metadata: {
        type: string;
        planId: string;
        phoneNumber: string;
    };
}

export default function AdminSubscriptionsPage() {
    const [pendingRequests, setPendingRequests] = useState<PendingSubscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(() => {
        fetchPendingSubscriptions();
    }, []);

    const fetchPendingSubscriptions = async () => {
        try {
            const res = await fetch('/api/admin/subscriptions/pending');
            if (res.ok) {
                const data = await res.json();
                setPendingRequests(data.payments || []);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (paymentId: string, userId: string) => {
        if (!confirm('Voulez-vous vraiment approuver cette demande d\'abonnement ?')) return;

        setProcessing(paymentId);
        try {
            const res = await fetch('/api/admin/subscriptions/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId, userId })
            });

            if (res.ok) {
                alert('Abonnement activé avec succès !');
                fetchPendingSubscriptions();
            } else {
                const data = await res.json();
                alert(data.error || 'Erreur lors de l\'activation');
            }
        } catch (error) {
            console.error(error);
            alert('Erreur de connexion');
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async (paymentId: string) => {
        if (!confirm('Voulez-vous vraiment refuser cette demande ?')) return;

        setProcessing(paymentId);
        try {
            const res = await fetch('/api/admin/subscriptions/reject', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId })
            });

            if (res.ok) {
                alert('Demande refusée');
                fetchPendingSubscriptions();
            } else {
                const data = await res.json();
                alert(data.error || 'Erreur');
            }
        } catch (error) {
            console.error(error);
            alert('Erreur de connexion');
        } finally {
            setProcessing(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl">
            <div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">Demandes d'Abonnement</h1>
                <p className="text-gray-600">Gérez les demandes d'abonnement Premium en attente</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-200">
                    <p className="text-sm font-bold text-yellow-600 uppercase tracking-wider">En Attente</p>
                    <p className="text-4xl font-black text-yellow-700 mt-2">
                        {pendingRequests.length}
                    </p>
                </div>
            </div>

            {/* Liste des demandes */}
            {pendingRequests.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune demande en attente</h3>
                    <p className="text-gray-600">Les nouvelles demandes d'abonnement apparaîtront ici</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Vendeur</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Téléphone</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Montant</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Méthode</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {pendingRequests.map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-bold text-gray-900">{request.user.name}</p>
                                                <p className="text-sm text-gray-500">{request.user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-mono text-sm text-gray-700">{request.metadata.phoneNumber}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-lg text-orange-600">
                                                {request.amount.toLocaleString()} FCFA
                                            </p>
                                            <p className="text-xs text-gray-500">Ref: {request.reference}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                                                {request.paymentMethod.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(request.createdAt).toLocaleDateString('fr-FR', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleApprove(request.id, request.user.id)}
                                                    disabled={processing === request.id}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                >
                                                    {processing === request.id ? '⏳' : '✅ Valider'}
                                                </button>
                                                <button
                                                    onClick={() => handleReject(request.id)}
                                                    disabled={processing === request.id}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                >
                                                    {processing === request.id ? '⏳' : '❌ Refuser'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
