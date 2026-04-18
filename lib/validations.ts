import { z } from 'zod';

// Validation schema for creating/updating listings
export const listingSchema = z.object({
    title: z.string().min(5, 'Le titre doit contenir au moins 5 caractères').max(100, 'Le titre ne peut pas dépasser 100 caractères'),
    description: z.string().min(20, 'La description doit contenir au moins 20 caractères').max(3000, 'La description ne peut pas dépasser 3000 caractères'),
    price: z.number().min(0, 'Le prix doit être positif'),
    category: z.string().min(1, 'La catégorie est requise'),
    location: z.string().min(1, 'La ville est requise'),
    quartier: z.string().optional(), // 🟢 Rendu optionnel pour éviter le blocage
    videoUrl: z.string().min(1, 'La vidéo est requise'),
    thumbnailUrl: z.string().min(1, 'La miniature est requise'),
    duration: z.number().optional(),
});

// Validation schema for user registration
export const userRegisterSchema = z.object({
    phone: z.string().min(8, 'Numéro de téléphone invalide'),
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: z.string().email('Adresse email invalide').min(1, 'L\'email est requis'),
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    language: z.string().optional(),
});

// Validation schema for subdomain
export const subdomainSchema = z.object({
    subdomain: z.string()
        .min(3, 'Le sous-domaine doit contenir au moins 3 caractères')
        .max(30, 'Le sous-domaine ne peut pas dépasser 30 caractères')
        .regex(/^[a-z0-9-]+$/, 'Le sous-domaine ne peut contenir que des lettres minuscules, des chiffres et des tirets')
        .regex(/^[a-z]/, 'Le sous-domaine doit commencer par une lettre')
        .regex(/[a-z0-9]$/, 'Le sous-domaine doit se terminer par une lettre ou un chiffre')
});
