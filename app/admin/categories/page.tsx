'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Category {
    id: string;
    name: string;
    nameFr: string;
    nameAr?: string;
    nameEn?: string;
    slug: string;
    icon?: string;
    description?: string;
    order: number;
    isActive: boolean;
    parentId?: string;
    parent?: {
        nameFr: string;
    };
    _count?: {
        listings: number;
    };
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        nameFr: '',
        nameAr: '',
        nameEn: '',
        slug: '',
        icon: '📦',
        description: '',
        order: 0,
        isActive: true,
        parentId: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            const data = await res.json();
            setCategories(data.categories || []);
        } catch (error) {
            console.error('Erreur chargement catégories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = '/api/admin/categories';
            const method = editingCategory ? 'PATCH' : 'POST';
            const body = editingCategory
                ? { id: editingCategory.id, ...formData }
                : formData;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                fetchCategories();
                setShowModal(false);
                resetForm();
            } else {
                const data = await res.json();
                alert(data.error || 'Erreur');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la sauvegarde');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;

        try {
            const res = await fetch(`/api/admin/categories?id=${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                fetchCategories();
            } else {
                const data = await res.json();
                alert(data.error || 'Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la suppression');
        }
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            nameFr: category.nameFr,
            nameAr: category.nameAr || '',
            nameEn: category.nameEn || '',
            slug: category.slug,
            icon: category.icon || '📦',
            description: category.description || '',
            order: category.order,
            isActive: category.isActive,
            parentId: category.parentId || ''
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingCategory(null);
        setFormData({
            name: '',
            nameFr: '',
            nameAr: '',
            nameEn: '',
            slug: '',
            icon: '📦',
            description: '',
            order: 0,
            isActive: true,
            parentId: ''
        });
    };

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Catégories</h1>
                    <p className="text-gray-600 mt-1">Gérez les catégories d'annonces</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nouvelle Catégorie
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Icône
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nom
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Slug
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Annonces
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ordre
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-3xl">{category.icon}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {category.parentId && (
                                                <span className="text-gray-400">↳</span>
                                            )}
                                            <div className="font-medium text-gray-900">{category.nameFr}</div>
                                        </div>
                                        {category.nameAr && (
                                            <div className={`text-sm text-gray-500 font-arabic ${category.parentId ? 'ml-4' : ''}`}>{category.nameAr}</div>
                                        )}
                                        {category.parentId && (
                                            <div className="text-xs text-blue-500 ml-4">
                                                Parent: {categories.find(c => c.id === category.parentId)?.nameFr || 'Inconnu'}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">{category.slug}</code>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-600">
                                            {category._count?.listings || 0} annonces
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-600">{category.order}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${category.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {category.isActive ? 'Actif' : 'Inactif'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => openEditModal(category)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {categories.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Aucune catégorie</p>
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nom (Français) *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.nameFr}
                                        onChange={(e) => {
                                            setFormData({ ...formData, nameFr: e.target.value, name: e.target.value });
                                            if (!editingCategory) {
                                                setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }));
                                            }
                                        }}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nom (Arabe)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.nameAr}
                                        onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-arabic text-right"
                                        dir="rtl"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Slug *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Icône (Emoji)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl"
                                        maxLength={2}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ordre d'affichage
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Statut
                                    </label>
                                    <select
                                        value={formData.isActive ? 'true' : 'false'}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="true">Actif</option>
                                        <option value="false">Inactif</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Catégorie Parente
                                </label>
                                <select
                                    value={formData.parentId}
                                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Aucune (Catégorie principale)</option>
                                    {categories
                                        .filter(c => c.id !== editingCategory?.id && !c.parentId) // Éviter circularité et profondeur n+2 pour simplifier
                                        .map(cat => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.icon} {cat.nameFr}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition"
                                >
                                    {editingCategory ? 'Mettre à jour' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
