'use client';

import { useState } from 'react';
import Link from 'next/link';

interface TestResult {
    success: boolean;
    provider?: string;
    content?: string;
    executionTime?: number;
    cost?: number;
    tokensUsed?: number;
    error?: string;
}

export default function AIProvidersTestPage() {
    const [loading, setLoading] = useState(false);
    const [healthStatus, setHealthStatus] = useState<any>(null);
    const [testResults, setTestResults] = useState<Record<string, TestResult>>({});

    const checkHealth = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/ai-providers');
            const data = await res.json();
            setHealthStatus(data);
        } catch (error: any) {
            alert('Erreur: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const testProvider = async (provider: string) => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/ai-providers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    provider,
                    prompt: 'Dis bonjour en français en une phrase courte',
                    systemPrompt: 'Tu es un assistant amical'
                })
            });

            const data = await res.json();

            if (data.success) {
                setTestResults(prev => ({
                    ...prev,
                    [provider]: {
                        success: true,
                        ...data.response
                    }
                }));
            } else {
                setTestResults(prev => ({
                    ...prev,
                    [provider]: {
                        success: false,
                        error: data.error
                    }
                }));
            }
        } catch (error: any) {
            setTestResults(prev => ({
                ...prev,
                [provider]: {
                    success: false,
                    error: error.message
                }
            }));
        } finally {
            setLoading(false);
        }
    };

    const testFallback = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/ai-providers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: 'Résume en 3 mots: Le système fonctionne parfaitement'
                })
            });

            const data = await res.json();

            if (data.success) {
                setTestResults(prev => ({
                    ...prev,
                    fallback: {
                        success: true,
                        ...data.response
                    }
                }));
            }
        } catch (error: any) {
            setTestResults(prev => ({
                ...prev,
                fallback: {
                    success: false,
                    error: error.message
                }
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
                                🧪 Test Multi-Provider IA
                            </h1>
                            <p className="text-gray-600">
                                Testez la disponibilité et les performances de chaque provider
                            </p>
                        </div>
                        <Link
                            href="/admin/automation"
                            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition"
                        >
                            ← Retour
                        </Link>
                    </div>
                </div>

                {/* Health Check */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-black text-gray-900">📊 Statut des Providers</h2>
                        <button
                            onClick={checkHealth}
                            disabled={loading}
                            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition disabled:opacity-50"
                        >
                            {loading ? '⏳ Vérification...' : '🔄 Vérifier'}
                        </button>
                    </div>

                    {healthStatus && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className={`p-4 rounded-xl border-2 ${healthStatus.providers.openai ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-gray-900">OpenAI</span>
                                    <span className="text-2xl">{healthStatus.providers.openai ? '✅' : '❌'}</span>
                                </div>
                            </div>
                            <div className={`p-4 rounded-xl border-2 ${healthStatus.providers.claude ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-gray-900">Claude</span>
                                    <span className="text-2xl">{healthStatus.providers.claude ? '✅' : '❌'}</span>
                                </div>
                            </div>
                            <div className={`p-4 rounded-xl border-2 ${healthStatus.providers.gemini ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-gray-900">Gemini</span>
                                    <span className="text-2xl">{healthStatus.providers.gemini ? '✅' : '❌'}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Individual Tests */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    <h2 className="text-xl font-black text-gray-900 mb-4">🎯 Tests Individuels</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <button
                            onClick={() => testProvider('openai')}
                            disabled={loading}
                            className="px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold transition disabled:opacity-50"
                        >
                            🤖 Tester OpenAI
                        </button>
                        <button
                            onClick={() => testProvider('claude')}
                            disabled={loading}
                            className="px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-bold transition disabled:opacity-50"
                        >
                            🤖 Tester Claude
                        </button>
                        <button
                            onClick={() => testProvider('gemini')}
                            disabled={loading}
                            className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold transition disabled:opacity-50"
                        >
                            🤖 Tester Gemini
                        </button>
                    </div>

                    {/* Results */}
                    <div className="space-y-4">
                        {Object.entries(testResults).map(([provider, result]) => (
                            <div
                                key={provider}
                                className={`p-4 rounded-xl border-2 ${result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <span className="font-bold text-gray-900 capitalize">{provider}</span>
                                    <span className="text-xl">{result.success ? '✅' : '❌'}</span>
                                </div>

                                {result.success ? (
                                    <div className="space-y-2 text-sm">
                                        <p className="text-gray-700">
                                            <strong>Réponse:</strong> "{result.content}"
                                        </p>
                                        <div className="flex flex-wrap gap-3 text-xs">
                                            <span className="px-2 py-1 bg-white rounded-lg">
                                                ⏱️ {result.executionTime}ms
                                            </span>
                                            <span className="px-2 py-1 bg-white rounded-lg">
                                                💰 ${result.cost?.toFixed(4)}
                                            </span>
                                            <span className="px-2 py-1 bg-white rounded-lg">
                                                🎯 {result.tokensUsed} tokens
                                            </span>
                                            <span className="px-2 py-1 bg-white rounded-lg">
                                                🤖 {result.provider}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-red-700 text-sm">
                                        <strong>Erreur:</strong> {result.error}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fallback Test */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-black text-gray-900 mb-4">🔄 Test Fallback Automatique</h2>
                    <p className="text-gray-600 mb-4">
                        Le système essaiera automatiquement OpenAI → Claude → Gemini jusqu'à ce qu'un provider réponde
                    </p>

                    <button
                        onClick={testFallback}
                        disabled={loading}
                        className="px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl font-bold transition disabled:opacity-50 w-full md:w-auto"
                    >
                        {loading ? '⏳ Test en cours...' : '🚀 Tester le Fallback'}
                    </button>

                    {testResults.fallback && (
                        <div className={`mt-4 p-4 rounded-xl border-2 ${testResults.fallback.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                            {testResults.fallback.success ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">✅</span>
                                        <span className="font-bold text-gray-900">
                                            Succès avec {testResults.fallback.provider}
                                        </span>
                                    </div>
                                    <p className="text-gray-700">
                                        <strong>Réponse:</strong> "{testResults.fallback.content}"
                                    </p>
                                    <div className="flex flex-wrap gap-3 text-xs">
                                        <span className="px-2 py-1 bg-white rounded-lg">
                                            ⏱️ {testResults.fallback.executionTime}ms
                                        </span>
                                        <span className="px-2 py-1 bg-white rounded-lg">
                                            💰 ${testResults.fallback.cost?.toFixed(4)}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-red-700">
                                    <strong>Erreur:</strong> {testResults.fallback.error}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
