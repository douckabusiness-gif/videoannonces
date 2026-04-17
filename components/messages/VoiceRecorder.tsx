'use client';

import { useState, useRef, useEffect } from 'react';

interface VoiceRecorderProps {
    onRecordingComplete: (audioBlob: Blob, duration: number) => void;
    onCancel?: () => void;
}

export default function VoiceRecorder({ onRecordingComplete, onCancel }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioLevel, setAudioLevel] = useState(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const analyzerRef = useRef<AnalyserNode | null>(null);
    const animationRef = useRef<number | null>(null);

    // Démarrer l'enregistrement
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Créer l'analyseur audio pour la visualisation
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const analyzer = audioContext.createAnalyser();
            analyzer.fftSize = 256;
            source.connect(analyzer);
            analyzerRef.current = analyzer;

            // Démarrer la visualisation
            visualizeAudio();

            // Configurer le MediaRecorder
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                onRecordingComplete(audioBlob, recordingTime);

                // Nettoyer
                stream.getTracks().forEach(track => track.stop());
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                }
            };

            mediaRecorder.start();
            setIsRecording(true);

            // Démarrer le timer
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => {
                    if (prev >= 120) { // 2 minutes max
                        stopRecording();
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1000);

        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Impossible d\'accéder au microphone. Vérifiez les permissions.');
        }
    };

    // Visualiser l'audio
    const visualizeAudio = () => {
        if (!analyzerRef.current) return;

        const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);

        const animate = () => {
            if (!analyzerRef.current) return;

            analyzerRef.current.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
            setAudioLevel(average / 255); // Normaliser entre 0 et 1

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();
    };

    // Arrêter l'enregistrement
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    };

    // Annuler l'enregistrement
    const cancelRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            audioChunksRef.current = [];
        }

        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        setIsRecording(false);
        setRecordingTime(0);

        if (onCancel) {
            onCancel();
        }
    };

    // Formater le temps
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Nettoyer au démontage
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-4">
            {/* Titre */}
            <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900">
                    {isRecording ? 'Enregistrement en cours...' : 'Message vocal'}
                </h3>
            </div>

            {/* Visualisation audio */}
            <div className="flex items-center justify-center gap-1 h-20">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className="w-1 bg-gradient-to-t from-red-500 to-orange-500 rounded-full transition-all duration-100"
                        style={{
                            height: isRecording
                                ? `${20 + (audioLevel * 60 * Math.random())}%`
                                : '20%'
                        }}
                    />
                ))}
            </div>

            {/* Timer */}
            <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 font-mono">
                    {formatTime(recordingTime)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    Durée maximale : 2:00
                </p>
            </div>

            {/* Boutons de contrôle */}
            <div className="flex items-center justify-center gap-4">
                {!isRecording ? (
                    <button
                        onClick={startRecording}
                        className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                    >
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                        </svg>
                    </button>
                ) : (
                    <>
                        <button
                            onClick={cancelRecording}
                            className="w-14 h-14 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <button
                            onClick={stopRecording}
                            className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                        >
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                            </svg>
                        </button>
                    </>
                )}
            </div>

            {/* Instructions */}
            {!isRecording && (
                <p className="text-center text-sm text-gray-500">
                    Appuyez sur le microphone pour commencer
                </p>
            )}
        </div>
    );
}
