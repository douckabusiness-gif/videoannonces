'use client';

import { useState } from 'react';
import VoiceRecorder from '@/components/messages/VoiceRecorder';
import AudioPlayer from '@/components/messages/AudioPlayer';

interface VoiceMessage {
    id: string;
    url: string;
    duration: number;
    timestamp: Date;
}

export default function VoiceMessageDemoPage() {
    const [showRecorder, setShowRecorder] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [voiceMessages, setVoiceMessages] = useState<VoiceMessage[]>([]);

    // Gérer la fin de l'enregistrement
    const handleRecordingComplete = async (audioBlob: Blob, duration: number) => {
        try {
            setUploading(true);

            // Upload du fichier audio
            const formData = new FormData();
            formData.append('audio', audioBlob, `voice-${Date.now()}.webm`);

            const response = await fetch('/api/upload/voice-message', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();

                // Ajouter le message vocal à la liste
                setVoiceMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    url: data.url,
                    duration,
                    timestamp: new Date()
                }]);

                setShowRecorder(false);
            } else {
                const error = await response.json();
                alert(`Erreur : ${error.error}`);
            }
        } catch (error) {
            console.error('Error uploading voice message:', error);
            alert('Erreur lors de l\'upload du message vocal');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* En-tête */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-gray-900 mb-2">
                        🎤 Messages Vocaux
                    </h1>
                    <p className="text-gray-600">
                        Testez l'enregistrement et la lecture de messages vocaux
                    </p>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <p className="text-sm font-bold text-gray-500 uppercase">Messages envoyés</p>
                        <p className="text-3xl font-black text-orange-600 mt-2">{voiceMessages.length}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <p className="text-sm font-bold text-gray-500 uppercase">Durée totale</p>
                        <p className="text-3xl font-black text-orange-600 mt-2">
                            {Math.floor(voiceMessages.reduce((acc, msg) => acc + msg.duration, 0) / 60)}m
                        </p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <p className="text-sm font-bold text-gray-500 uppercase">Statut</p>
                        <p className="text-3xl font-black text-green-600 mt-2">Actif</p>
                    </div>
                </div>

                {/* Zone d'enregistrement */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
                    <h2 className="text-2xl font-black text-gray-900 mb-6">Nouvel Enregistrement</h2>

                    {!showRecorder && !uploading ? (
                        <button
                            onClick={() => setShowRecorder(true)}
                            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg transition-all font-bold text-lg flex items-center justify-center gap-3"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                            </svg>
                            Enregistrer un message vocal
                        </button>
                    ) : uploading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-orange-500"></div>
                            <p className="text-gray-600 mt-4 font-medium">Upload en cours...</p>
                        </div>
                    ) : (
                        <VoiceRecorder
                            onRecordingComplete={handleRecordingComplete}
                            onCancel={() => setShowRecorder(false)}
                        />
                    )}
                </div>

                {/* Liste des messages vocaux */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <h2 className="text-2xl font-black text-gray-900 mb-6">
                        Messages Enregistrés ({voiceMessages.length})
                    </h2>

                    {voiceMessages.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                            </svg>
                            <p className="text-lg font-medium">Aucun message vocal</p>
                            <p className="text-sm mt-2">Enregistrez votre premier message ci-dessus</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {voiceMessages.map((message) => (
                                <div key={message.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                                        Tu
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <p className="font-bold text-gray-900">Vous</p>
                                            <p className="text-xs text-gray-500">
                                                {message.timestamp.toLocaleTimeString('fr-FR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <AudioPlayer
                                            audioUrl={message.url}
                                            duration={message.duration}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Instructions */}
                <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-blue-900 mb-3">💡 Comment utiliser</h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                        <li className="flex items-start gap-2">
                            <span className="font-bold">1.</span>
                            <span>Cliquez sur "Enregistrer un message vocal"</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold">2.</span>
                            <span>Appuyez sur le bouton microphone rouge pour commencer</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold">3.</span>
                            <span>Parlez clairement (max 2 minutes)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold">4.</span>
                            <span>Cliquez sur le bouton vert pour valider</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold">5.</span>
                            <span>Le message sera automatiquement uploadé et ajouté à la liste</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
