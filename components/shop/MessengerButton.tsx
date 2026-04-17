'use client';

import { FC } from 'react';

interface MessengerButtonProps {
    facebookPageId: string;
    shopName: string;
}

const MessengerButton: FC<MessengerButtonProps> = ({ facebookPageId, shopName }) => {
    const handleClick = () => {
        // Ouvrir Messenger vers la page Facebook
        window.open(`https://m.me/${facebookPageId}`, '_blank');
    };

    return (
        <button
            onClick={handleClick}
            className="fixed bottom-6 left-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group"
            aria-label="Contacter sur Messenger"
        >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.5 2 2 6.14 2 11.25c0 2.92 1.45 5.51 3.71 7.23V22l3.4-1.87c.91.25 1.87.38 2.89.38 5.5 0 10-4.14 10-9.25S17.5 2 12 2zm1 12.38l-2.56-2.72-5 2.72 5.5-5.84 2.62 2.72 4.94-2.72-5.5 5.84z" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                Chat
            </span>
        </button>
    );
};

export default MessengerButton;
