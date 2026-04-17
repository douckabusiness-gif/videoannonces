'use client';

import { useState, useEffect } from 'react';

export function useGeoRestriction() {
    const [isRestricted, setIsRestricted] = useState(false);

    useEffect(() => {
        const checkGeo = () => {
            const cookies = document.cookie.split('; ');
            const geoCookie = cookies.find(row => row.startsWith('geoRestricted='));
            if (geoCookie) {
                const value = geoCookie.split('=')[1];
                setIsRestricted(value === 'true');
            }
        };

        checkGeo();

        // Listener pour les changements de cookies (optionnel mais propre)
        const interval = setInterval(checkGeo, 5000);
        return () => clearInterval(interval);
    }, []);

    return isRestricted;
}
