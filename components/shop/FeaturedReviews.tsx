'use client';

import { useState, useEffect } from 'react';

interface Review {
    id: string;
    reviewer: {
        name: string;
        avatar: string | null;
    };
    rating: number;
    comment: string | null;
    createdAt: Date;
}

export default function FeaturedReviews({ reviews }: { reviews: Review[] }) {
    if (!reviews || reviews.length === 0) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 py-16 animate-fade-in-up">
            <h2 className="text-4xl font-black text-gray-900 mb-10 flex items-center gap-3 text-center justify-center">
                <span className="text-5xl animate-bounce" style={{ animationDelay: '0.3s' }}>💬</span>
                Ce que disent nos clients
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {reviews.map((review, index) => (
                    <div
                        key={review.id}
                        className="glass-card p-8 rounded-3xl relative hover:scale-105 transition-transform duration-300 border border-white/40 shadow-xl"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {/* Blob Background */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-purple-500/20 rounded-bl-full -z-10"></div>

                        {/* Quote Icon */}
                        <div className="absolute -top-4 -left-4 text-6xl text-orange-200 font-serif opacity-50">"</div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-purple-600 p-[2px]">
                                <div className="w-full h-full rounded-full bg-white overflow-hidden">
                                    {review.reviewer.avatar ? (
                                        <img src={review.reviewer.avatar} alt={review.reviewer.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 font-bold text-xl">
                                            {review.reviewer.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">{review.reviewer.name}</h3>
                                <div className="flex text-yellow-500 text-sm">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-700 italic leading-relaxed relative z-10">
                            {review.comment || "Aucun commentaire écrit."}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
