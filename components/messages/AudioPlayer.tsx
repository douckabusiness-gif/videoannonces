'use client';

import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
    audioUrl: string;
    duration?: number; // Durée en secondes
    senderName?: string;
}

export default function AudioPlayer({ audioUrl, duration, senderName }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [audioDuration, setAudioDuration] = useState(duration || 0);

    const audioRef = useRef<HTMLAudioElement>(null);

    // Charger les métadonnées audio
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleLoadedMetadata = () => {
            setAudioDuration(audio.duration);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    // Play/Pause
    const togglePlayPause = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Seek
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!audioRef.current) return;

        const newTime = parseFloat(e.target.value);
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    // Formater le temps
    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculer le pourcentage de progression
    const progress = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

    return (
        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3 max-w-sm">
            {/* Audio element caché */}
            <audio ref={audioRef} src={audioUrl} preload="metadata" />

            {/* Bouton Play/Pause */}
            <button
                onClick={togglePlayPause}
                className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
            >
                {isPlaying ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                )}
            </button>

            {/* Barre de progression et temps */}
            <div className="flex-1 space-y-1">
                {/* Nom de l'expéditeur (optionnel) */}
                {senderName && (
                    <p className="text-xs font-medium text-gray-700">{senderName}</p>
                )}

                {/* Barre de progression */}
                <div className="relative">
                    <input
                        type="range"
                        min="0"
                        max={audioDuration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        style={{
                            background: `linear-gradient(to right, #f97316 0%, #f97316 ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`
                        }}
                    />
                </div>

                {/* Temps */}
                <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(audioDuration)}</span>
                </div>
            </div>

            {/* Icône microphone */}
            <div className="flex-shrink-0 text-orange-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
            </div>
        </div>
    );
}
