'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export function useSocket() {
    return useContext(SocketContext);
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { data: session } = useSession();

    useEffect(() => {
        if (!session?.user) return;

        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';
        const newSocket = io(socketUrl, {
            transports: ['websocket', 'polling'],
        });

        newSocket.on('connect', () => {
            console.log('Socket connecté');
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket déconnecté');
            setIsConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Erreur connexion socket:', error);
            setIsConnected(false);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [session]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
}
