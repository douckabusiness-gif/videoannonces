'use client';

interface MessageStatusProps {
    isSent: boolean;
    deliveredAt?: Date | null;
    readAt?: Date | null;
    size?: 'sm' | 'md';
}

export default function MessageStatus({ isSent, deliveredAt, readAt, size = 'md' }: MessageStatusProps) {
    if (!isSent) {
        return null; // Ne rien afficher si le message n'est pas encore envoyé
    }

    const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

    // Message lu (double check bleu)
    if (readAt) {
        return (
            <div className="flex items-center gap-1" title={`Lu le ${new Date(readAt).toLocaleString('fr-FR')}`}>
                <svg className={`${iconSize} text-blue-500`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M0.41,13.41L6,19L7.41,17.58L1.83,12M22.24,5.58L11.66,16.17L7.5,12L6.07,13.41L11.66,19L23.66,7M18,7L16.59,5.58L10.24,11.93L11.66,13.34L18,7Z" />
                </svg>
                <svg className={`${iconSize} text-blue-500 -ml-2`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M0.41,13.41L6,19L7.41,17.58L1.83,12M22.24,5.58L11.66,16.17L7.5,12L6.07,13.41L11.66,19L23.66,7M18,7L16.59,5.58L10.24,11.93L11.66,13.34L18,7Z" />
                </svg>
            </div>
        );
    }

    // Message délivré (double check gris)
    if (deliveredAt) {
        return (
            <div className="flex items-center gap-1" title={`Délivré le ${new Date(deliveredAt).toLocaleString('fr-FR')}`}>
                <svg className={`${iconSize} text-gray-400`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M0.41,13.41L6,19L7.41,17.58L1.83,12M22.24,5.58L11.66,16.17L7.5,12L6.07,13.41L11.66,19L23.66,7M18,7L16.59,5.58L10.24,11.93L11.66,13.34L18,7Z" />
                </svg>
                <svg className={`${iconSize} text-gray-400 -ml-2`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M0.41,13.41L6,19L7.41,17.58L1.83,12M22.24,5.58L11.66,16.17L7.5,12L6.07,13.41L11.66,19L23.66,7M18,7L16.59,5.58L10.24,11.93L11.66,13.34L18,7Z" />
                </svg>
            </div>
        );
    }

    // Message envoyé (simple check gris)
    return (
        <div className="flex items-center" title="Envoyé">
            <svg className={`${iconSize} text-gray-400`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M0.41,13.41L6,19L7.41,17.58L1.83,12M22.24,5.58L11.66,16.17L7.5,12L6.07,13.41L11.66,19L23.66,7M18,7L16.59,5.58L10.24,11.93L11.66,13.34L18,7Z" />
            </svg>
        </div>
    );
}
