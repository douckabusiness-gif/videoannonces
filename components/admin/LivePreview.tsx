'use client';

interface LivePreviewProps {
    settings: {
        siteName?: string;
        siteSlogan?: string;
        logo?: string;
        heroTitle?: string;
        heroSubtitle?: string;
        socialFacebook?: string;
        socialTwitter?: string;
        socialInstagram?: string;
        socialLinkedIn?: string;
        socialYouTube?: string;
        socialTikTok?: string;
    };
}

export default function LivePreview({ settings }: LivePreviewProps) {
    const hasSocial = settings.socialFacebook || settings.socialTwitter || settings.socialInstagram ||
        settings.socialLinkedIn || settings.socialYouTube || settings.socialTikTok;

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>👁️</span>
                Aperçu en direct
            </h3>

            <div className="space-y-4">
                {/* Header Preview */}
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-2">
                        {settings.logo ? (
                            <img src={settings.logo} className="h-8 object-contain" alt="Logo" />
                        ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-green-500 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                </svg>
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm truncate">{settings.siteName || 'Nom du site'}</p>
                            {settings.siteSlogan && (
                                <p className="text-xs text-gray-600 truncate">{settings.siteSlogan}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Hero Preview */}
                {(settings.heroTitle || settings.heroSubtitle) && (
                    <div className="border-2 border-gray-200 rounded-lg p-4 bg-gradient-to-br from-orange-50 to-orange-100">
                        {settings.heroTitle && (
                            <h2 className="font-bold text-sm mb-1">{settings.heroTitle}</h2>
                        )}
                        {settings.heroSubtitle && (
                            <p className="text-xs text-gray-700 line-clamp-2">{settings.heroSubtitle}</p>
                        )}
                    </div>
                )}

                {/* Social Links */}
                {hasSocial && (
                    <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                        <p className="text-xs font-bold text-gray-700 mb-2">Réseaux sociaux</p>
                        <div className="flex gap-2 flex-wrap">
                            {settings.socialFacebook && (
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </div>
                            )}
                            {settings.socialTwitter && (
                                <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                    </svg>
                                </div>
                            )}
                            {settings.socialInstagram && (
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </div>
                            )}
                            {settings.socialLinkedIn && (
                                <div className="w-8 h-8 bg-blue-700 rounded-full" />
                            )}
                            {settings.socialYouTube && (
                                <div className="w-8 h-8 bg-red-600 rounded-full" />
                            )}
                            {settings.socialTikTok && (
                                <div className="w-8 h-8 bg-black rounded-full" />
                            )}
                        </div>
                    </div>
                )}

                <button
                    onClick={() => window.open('/', '_blank')}
                    className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all text-sm font-bold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Ouvrir le site
                </button>
            </div>
        </div>
    );
}
