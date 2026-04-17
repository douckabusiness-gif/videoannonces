'use client';

import { useState, useEffect } from 'react';

export default function AdminModerationPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ pending: 0, reviewed: 0, resolved: 0, dismissed: 0 });

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await fetch('/api/admin/moderation');
            if (res.ok) {
                const data = await res.json();
                setReports(data.reports);
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateReport = async (reportId: string, status: string, resolution: string) => {
        try {
            const res = await fetch('/api/admin/moderation', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reportId, status, resolution })
            });

            if (res.ok) {
                fetchReports();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (loading) return <div className="p-8 text-center">Chargement...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-black text-gray-900">Modération de Contenu</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
                    <p className="text-sm font-bold text-yellow-600 uppercase">En Attente</p>
                    <p className="text-3xl font-black text-yellow-700 mt-2">{stats.pending}</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <p className="text-sm font-bold text-blue-600 uppercase">Examinés</p>
                    <p className="text-3xl font-black text-blue-700 mt-2">{stats.reviewed}</p>
                </div>
                <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                    <p className="text-sm font-bold text-green-600 uppercase">Résolus</p>
                    <p className="text-3xl font-black text-green-700 mt-2">{stats.resolved}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <p className="text-sm font-bold text-gray-600 uppercase">Rejetés</p>
                    <p className="text-3xl font-black text-gray-700 mt-2">{stats.dismissed}</p>
                </div>
            </div>

            <div className="space-y-4">
                {reports.map((report) => (
                    <div key={report.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-gray-900">Signalement #{report.id.slice(0, 8)}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Type: {report.reportedType} • Raison: {report.reason}
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    report.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                                        report.status === 'resolved' ? 'bg-green-100 text-green-700' :
                                            'bg-gray-100 text-gray-700'
                                }`}>
                                {report.status.toUpperCase()}
                            </span>
                        </div>

                        {report.description && (
                            <p className="text-gray-700 mb-4">{report.description}</p>
                        )}

                        {report.status === 'pending' && (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        const resolution = prompt('Résolution:');
                                        if (resolution) handleUpdateReport(report.id, 'resolved', resolution);
                                    }}
                                    className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-bold"
                                >
                                    Résoudre
                                </button>
                                <button
                                    onClick={() => handleUpdateReport(report.id, 'dismissed', 'Signalement non fondé')}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition font-bold"
                                >
                                    Rejeter
                                </button>
                            </div>
                        )}

                        {report.resolution && (
                            <div className="mt-4 bg-green-50 border border-green-100 rounded-xl p-4">
                                <p className="text-sm font-bold text-green-700">Résolution:</p>
                                <p className="text-sm text-green-600 mt-1">{report.resolution}</p>
                            </div>
                        )}
                    </div>
                ))}

                {reports.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <p className="text-gray-500">Aucun signalement pour le moment</p>
                    </div>
                )}
            </div>
        </div>
    );
}
