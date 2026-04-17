'use client';

import { useState, useRef } from 'react';

interface FileUploadProps {
    onUploadComplete: (url: string) => void;
    accept?: string;
    maxSize?: number;
    currentFile?: string;
}

export default function FileUpload({
    onUploadComplete,
    accept = 'video/mp4,video/webm,image/jpeg,image/png,image/webp',
    maxSize = 50 * 1024 * 1024, // 50MB
    currentFile
}: FileUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [preview, setPreview] = useState<string | null>(currentFile || null);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        setError(null);

        // Vérifier la taille
        if (file.size > maxSize) {
            setError(`Fichier trop volumineux. Maximum ${maxSize / 1024 / 1024}MB`);
            return;
        }

        // Créer une prévisualisation
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload
        setUploading(true);
        setProgress(0);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const xhr = new XMLHttpRequest();

            // Progression
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    setProgress(percentComplete);
                }
            });

            // Promesse pour gérer la réponse
            const uploadPromise = new Promise<string>((resolve, reject) => {
                xhr.addEventListener('load', () => {
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response.url);
                    } else {
                        reject(new Error('Erreur upload'));
                    }
                });
                xhr.addEventListener('error', () => reject(new Error('Erreur réseau')));
            });

            xhr.open('POST', '/api/upload');
            xhr.send(formData);

            const url = await uploadPromise;
            onUploadComplete(url);
            setProgress(100);
        } catch (err: any) {
            setError(err.message || 'Erreur lors de l\'upload');
            setPreview(null);
        } finally {
            setUploading(false);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const isVideo = preview?.includes('video') || preview?.endsWith('.mp4') || preview?.endsWith('.webm');

    return (
        <div className="space-y-4">
            {/* Zone de drop */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${dragActive
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-white/20 hover:border-purple-400 bg-white/5'
                    }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    onChange={handleChange}
                    className="hidden"
                />

                {uploading ? (
                    <div className="space-y-4">
                        <div className="text-white font-bold">Upload en cours... {Math.round(progress)}%</div>
                        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-purple-600 to-pink-600 h-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                ) : preview ? (
                    <div className="space-y-4">
                        {isVideo ? (
                            <video
                                src={preview}
                                className="max-h-64 mx-auto rounded-lg"
                                controls
                            />
                        ) : (
                            <img
                                src={preview}
                                alt="Preview"
                                className="max-h-64 mx-auto rounded-lg"
                            />
                        )}
                        <button
                            type="button"
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500"
                        >
                            Changer le fichier
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="text-6xl">📁</div>
                        <div className="text-white font-bold">
                            Glissez-déposez votre fichier ici
                        </div>
                        <div className="text-purple-300 text-sm">
                            ou cliquez pour sélectionner
                        </div>
                        <div className="text-purple-400 text-xs">
                            Vidéo (MP4, WebM) ou Image (JPG, PNG, WebP) - Max 50MB
                        </div>
                    </div>
                )}
            </div>

            {/* Erreur */}
            {error && (
                <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
                    ❌ {error}
                </div>
            )}
        </div>
    );
}
