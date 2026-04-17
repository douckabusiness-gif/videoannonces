import { z } from 'zod';

export const listingSchema = z.object({
    title: z.string()
        .min(5, 'Le titre doit contenir au moins 5 caractères')
        .max(100, 'Le titre ne peut pas dépasser 100 caractères'),

    description: z.string()
        .min(20, 'La description doit contenir au moins 20 caractères')
        .max(1000, 'La description ne peut pas dépasser 1000 caractères'),

    price: z.number()
        .positive('Le prix doit être positif')
        .max(1000000000, 'Prix trop élevé'),

    category: z.enum([
        'electronics',
        'fashion',
        'vehicles',
        'real-estate',
        'services',
        'home',
        'sports',
        'other'
    ]),

    videoUrl: z.string().min(1, 'URL vidéo requise'),

    thumbnailUrl: z.string().min(1, 'URL miniature requise'),

    duration: z.number().nonnegative().max(60, 'Durée maximale: 60 secondes').optional(),

    location: z.string().min(3, 'Localisation requise'),

    latitude: z.number().optional(),
    longitude: z.number().optional(),
});

export type ListingInput = z.infer<typeof listingSchema>;

export const messageSchema = z.object({
    conversationId: z.string(),
    content: z.string().min(1).max(5000),
    type: z.enum(['text', 'image', 'video', 'voice', 'location']).default('text'),
    mediaUrl: z.string().url().optional(),
    duration: z.number().optional(),
});

export type MessageInput = z.infer<typeof messageSchema>;

export const userRegisterSchema = z.object({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    phone: z.string().regex(/^[0-9]{10}$/, 'Numéro de téléphone invalide (10 chiffres)'),
    email: z.string().email('Email invalide').optional(),
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    language: z.enum(['fr', 'ar', 'en']).default('fr'),
});

export type UserRegisterInput = z.infer<typeof userRegisterSchema>;

export const subdomainSchema = z.object({
    subdomain: z.string()
        .min(3, 'Minimum 3 caractères')
        .max(20, 'Maximum 20 caractères')
        .regex(/^[a-z0-9-]+$/, 'Seulement lettres minuscules, chiffres et tirets')
        .refine(
            (val) => !['www', 'api', 'admin', 'app', 'mail', 'support', 'help', 'blog', 'shop'].includes(val),
            'Ce sous-domaine est réservé'
        ),
});

export type SubdomainInput = z.infer<typeof subdomainSchema>;
