'use client';
import { useSession } from 'next-auth/react';

export default function TestAuthPage() {
    const { data: session, status } = useSession();

    return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
            <h1>Diagnostic Session</h1>
            <p>Statut : <strong>{status}</strong></p>
            
            {session ? (
                <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '10px' }}>
                    <p>Nom : {session.user.name}</p>
                    <p>Téléphone : {session.user.phone}</p>
                    <p>Rôle : <span style={{ color: session.user.role === 'ADMIN' ? 'green' : 'red', fontWeight: 'bold' }}>{session.user.role}</span></p>
                    <p>Peut Publier : {session.user.canPublishListings ? 'OUI ✅' : 'NON ❌'}</p>
                    
                    <hr />
                    <h3>Données Brutes :</h3>
                    <pre>{JSON.stringify(session.user, null, 2)}</pre>
                </div>
            ) : (
                <p>Non connecté.</p>
            )}
            
            <div style={{ marginTop: '20px' }}>
                <a href="/login" style={{ marginRight: '10px' }}>Aller à la page de connexion</a>
                <a href="/">Retour à l'accueil</a>
            </div>
        </div>
    );
}
