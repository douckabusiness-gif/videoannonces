'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface MenuItem {
    name: string;
    href: string;
    icon: React.ReactNode;
    badge?: string;
    className?: string;
}

interface CollapsibleMenuSectionProps {
    title: string;
    icon: string;
    items: MenuItem[];
    defaultOpen?: boolean;
}

export default function CollapsibleMenuSection({
    title,
    icon,
    items,
    defaultOpen = false
}: CollapsibleMenuSectionProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(defaultOpen);

    // Vérifier si une des routes de cette section est active
    const hasActiveItem = items.some(item => pathname === item.href);

    return (
        <div className="mb-2">
            {/* Header de la section */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all group"
            >
                <div className="flex items-center gap-2">
                    <span className="text-lg">{icon}</span>
                    <span className="font-semibold text-sm uppercase tracking-wider">
                        {title}
                    </span>
                    {hasActiveItem && (
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                </div>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Items de la section */}
            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[1000px] opacity-100 mt-1' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="space-y-1 pl-2">
                    {items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${isActive
                                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                                        : 'text-gray-400 hover:bg-gray-800/70 hover:text-white'
                                    } ${item.className || ''}`}
                            >
                                <span className="flex-shrink-0">{item.icon}</span>
                                <span className="font-medium text-sm flex-1">{item.name}</span>
                                {item.badge && (
                                    <span className="px-2 py-0.5 text-xs font-bold bg-green-500 text-white rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
