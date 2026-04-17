'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    stock: number;
    shop: {
        id: string;
        name: string;
        subdomain?: string;
        verified: boolean;
    };
}

export default function PremiumShopProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPremiumProducts();
    }, []);

    const fetchPremiumProducts = async () => {
        try {
            const response = await fetch('/api/products/premium?limit=6');
            const data = await response.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error('Erreur chargement produits premium:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="py-12 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                                <div className="aspect-square bg-gray-200"></div>
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <section className="py-12 bg-gradient-to-br from-rose-50 via-fuchsia-50 to-pink-50 relative overflow-hidden">
            {/* Motifs décoratifs */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 border-4 border-rose-500 rounded-full"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 border-4 border-fuchsia-500 rounded-lg rotate-45"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* En-tête de section */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-2xl">💎</span>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-gray-900">
                                Produits Premium
                            </h2>
                            <p className="text-gray-600">Des boutiques vérifiées</p>
                        </div>
                    </div>
                    <Link
                        href="/products/premium"
                        className="px-6 py-3 bg-gradient-to-r from-rose-500 to-fuchsia-600 text-white rounded-xl hover:from-rose-600 hover:to-fuchsia-700 transition shadow-lg hover:shadow-xl hover:scale-105 transform duration-200 font-semibold"
                    >
                        Voir tout
                    </Link>
                </div>

                {/* Grille de produits - 6 colonnes */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            href={`/products/${product.id}`}
                            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-rose-500"
                        >
                            {/* Badge Premium */}
                            <div className="absolute top-3 right-3 z-20">
                                <div className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-rose-500 to-fuchsia-600 text-white rounded-lg text-xs font-bold shadow-lg">
                                    <span>💎</span>
                                </div>
                            </div>

                            {/* Image du produit */}
                            <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                {product.images && product.images.length > 0 ? (
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-6xl">📦</span>
                                    </div>
                                )}

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                {/* Badge stock faible */}
                                {product.stock < 5 && product.stock > 0 && (
                                    <div className="absolute bottom-3 left-3">
                                        <div className="px-2.5 py-1 bg-orange-500 text-white rounded-lg text-xs font-bold shadow-lg">
                                            Plus que {product.stock}
                                        </div>
                                    </div>
                                )}

                                {/* Badge rupture de stock */}
                                {product.stock === 0 && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <div className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold">
                                            Rupture de stock
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Contenu */}
                            <div className="p-4">
                                {/* Nom du produit */}
                                <h3 className="font-bold text-base text-gray-900 mb-2 line-clamp-2 group-hover:text-rose-600 transition-colors leading-tight">
                                    {product.name}
                                </h3>

                                {/* Boutique */}
                                <div className="flex items-center gap-1.5 mb-3">
                                    <span className="text-xs text-gray-500">par</span>
                                    <span className="text-xs font-semibold text-gray-700">{product.shop.name}</span>
                                    {product.shop.verified && (
                                        <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>

                                {/* Prix */}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 font-medium">Prix</span>
                                        <span className="text-lg font-black text-rose-600">
                                            {product.price.toLocaleString()} F
                                        </span>
                                    </div>

                                    {/* Bouton d'action */}
                                    <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-fuchsia-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Effet de brillance */}
                            <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-rose-500/50 transition-all pointer-events-none"></div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
