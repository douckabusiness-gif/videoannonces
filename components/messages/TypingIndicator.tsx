'use client';

interface TypingIndicatorProps {
    userName?: string;
    multipleUsers?: boolean;
}

export default function TypingIndicator({ userName, multipleUsers = false }: TypingIndicatorProps) {
    return (
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl max-w-xs">
            {/* Avatar */}
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {userName ? userName[0].toUpperCase() : '?'}
            </div>

            {/* Texte et animation */}
            <div className="flex-1">
                <p className="text-xs text-gray-600 mb-1">
                    {multipleUsers
                        ? 'Plusieurs personnes écrivent...'
                        : `${userName || 'Quelqu\'un'} est en train d'écrire...`
                    }
                </p>

                {/* Animation de points */}
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    );
}
