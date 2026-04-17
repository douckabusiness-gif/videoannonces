'use client';

export default function ShopAnimations() {
    return (
        <style jsx global>{`
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
            }
            @keyframes pulse-glow {
                0%, 100% { box-shadow: 0 0 20px rgba(251, 146, 60, 0.5); }
                50% { box-shadow: 0 0 40px rgba(251, 146, 60, 0.8); }
            }
            @keyframes shimmer {
                0% { background-position: -1000px 0; }
                100% { background-position: 1000px 0; }
            }
            .animate-fade-in-up {
                animation: fadeInUp 0.6s ease-out forwards;
            }
            .animate-float {
                animation: float 3s ease-in-out infinite;
            }
            .animate-pulse-glow {
                animation: pulse-glow 2s ease-in-out infinite;
            }
            .shimmer {
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                background-size: 200% 100%;
                animation: shimmer 2s infinite;
            }
            .glass-card {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
        `}</style>
    );
}
