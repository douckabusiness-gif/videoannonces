'use client';

import { useState } from 'react';

interface DragDropUploadProps {
    onUpload: (file: File) => Promise<void>;
    currentImage?: string;
    label: string;
    accept?: string;
    maxSize?: number; // in MB
    onRemove?: () => void;
}

export default function DragDropUpload({
    onUpload,
    currentImage,
    label,
    accept = "image/*",
    maxSize = 5,
    onRemove
}: DragDropUploadProps) {
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        setError(null);

        const file = e.dataTransfer.files[0];
        if (!file) return;

        if (file.size > maxSize * 1024 * 1024) {
            setError(`Fichier trop volumineux (max ${maxSize}MB)`);
            return;
        }

        setUploading(true);
        try {
            await onUpload(file);
        } catch (err) {
            setError("Erreur lors du téléchargement");
        } finally {
            setUploading(false);
        }
    };

    const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);

        if (file.size > maxSize * 1024 * 1024) {
            setError(`Fichier trop volumineux (max ${maxSize}MB)`);
            return;
        }

        setUploading(true);
        try {
            await onUpload(file);
        } catch (err) {
            setError("Erreur lors du téléchargement");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700">{label}</label>

            {currentImage && (
                <div className="relative inline-block">
                    <img
                        src={currentImage}
                        className="h-20 object-contain rounded-lg border-2 border-gray-200 bg-gray-50 px-2 py-2"
                        alt="Current"
                    />
                    {onRemove && (
                        <button
                            type="button"
                            onClick={onRemove}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                        >
                            ×
                        </button>
                    )}
                </div>
            )}

            <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all relative ${dragging
                        ? 'border-orange-500 bg-orange-50'
                        : error
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 bg-gray-50 hover:border-orange-400'
                    }`}
            >
                {uploading ? (
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm font-medium text-gray-700">Téléchargement...</p>
                    </div>
                ) : (
                    <>
                        <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm font-medium text-gray-700">Glissez une image ici</p>
                        <p className="text-xs text-gray-500 mt-1">ou cliquez pour parcourir (max {maxSize}MB)</p>
                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept={accept}
                            onChange={handleFileInput}
                            disabled={uploading}
                        />
                    </>
                )}
            </div>

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
