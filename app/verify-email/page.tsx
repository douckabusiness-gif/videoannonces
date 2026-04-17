'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Countdown pour renvoyer le code
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleChange = (index: number, value: string) => {
        // Accepter seulement les chiffres
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value.slice(-1); // Prendre seulement le dernier caractère
        setCode(newCode);
        setError('');

        // Auto-focus au champ suivant
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit si tous les champs sont remplis
        if (newCode.every(digit => digit !== '')) {
            handleVerify(newCode.join(''));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        // Retour arrière : aller au champ précédent
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newCode = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
        setCode(newCode);

        // Auto-submit si 6 chiffres
        if (pastedData.length === 6) {
            handleVerify(pastedData);
        }
    };

    const handleVerify = async (codeString?: string) => {
        const verificationCode = codeString || code.join('');

        if (verificationCode.length !== 6) {
            setError('Code incomplet');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    code: verificationCode
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Code invalide');
                setCode(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
                return;
            }

            // Succès ! Rediriger vers le dashboard
            router.push('/login?verified=true');

        } catch (err) {
            setError('Erreur de connexion. Réessayez.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;

        setResendLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/resend-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Erreur lors du renvoi');
                return;
            }

            setResendCooldown(60); // 60 secondes de cooldown
            setCode(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();

        } catch (err) {
            setError('Erreur de connexion.');
        } finally {
            setResendLoading(false);
        }
    };

    const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3');

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600">
                        VideoAnnonces-CI
                    </h1>
                    <p className="text-gray-600 mt-2">Vérification de votre email</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full mx-auto flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Vérifiez votre email</h2>
                        <p className="text-gray-600 mt-2 text-sm">
                            Code envoyé à <span className="font-semibold">{maskedEmail}</span>
                        </p>
                    </div>

                    {/* Code Inputs */}
                    <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={el => inputRefs.current[index] = el}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={e => handleChange(index, e.target.value)}
                                onKeyDown={e => handleKeyDown(index, e)}
                                className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 transition ${error
                                    ? 'border-red-500 bg-red-50'
                                    : digit
                                        ? 'border-orange-500 bg-orange-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                    } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                autoFocus={index === 0}
                                disabled={loading}
                            />
                        ))}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Verify Button */}
                    <button
                        onClick={() => handleVerify()}
                        disabled={loading || code.some(d => !d)}
                        className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-pink-600 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                    >
                        {loading ? 'Vérification...' : 'Vérifier le code'}
                    </button>

                    {/* Resend */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Code non reçu ?{' '}
                            {resendCooldown > 0 ? (
                                <span className="text-gray-400">Renvoyer dans {resendCooldown}s</span>
                            ) : (
                                <button
                                    onClick={handleResend}
                                    disabled={resendLoading}
                                    className="text-orange-600 hover:text-orange-700 font-semibold transition"
                                >
                                    {resendLoading ? 'Envoi...' : 'Renvoyer le code'}
                                </button>
                            )}
                        </p>
                    </div>

                    {/* Help Text */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                        <p className="font-semibold mb-1">💡 Conseils :</p>
                        <ul className="space-y-1 text-xs">
                            <li>• Vérifiez vos spams/courrier indésirable</li>
                            <li>• Le code expire après 15 minutes</li>
                            <li>• Ne partagez jamais votre code</li>
                        </ul>
                    </div>
                </div>

                {/* Back to Login */}
                <div className="text-center mt-6">
                    <Link
                        href="/login"
                        className="text-gray-600 hover:text-gray-900 text-sm transition"
                    >
                        ← Retour à la connexion
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
