'use client';

import { useEffect, useRef } from 'react';

interface ListingVideoPlayerProps {
    src: string;
    poster: string;
    autoPlay?: boolean;
    muted?: boolean;
}

export default function ListingVideoPlayer({ src, poster, autoPlay = true, muted = false }: ListingVideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Cleanup function ran when component unmounts
        return () => {
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.src = ""; // Force unload
                videoRef.current.load();
            }
        };
    }, []);

    return (
        <video
            ref={videoRef}
            src={src}
            poster={poster}
            controls
            autoPlay={autoPlay}
            muted={muted}
            playsInline
            loop
            className="w-full aspect-video object-contain"
        >
            Votre navigateur ne supporte pas la vidéo.
        </video>
    );
}
