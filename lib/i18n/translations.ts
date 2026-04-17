export const translations = {
    fr: {
        // Navigation
        home: 'Accueil',
        messages: 'Messages',
        create: 'Créer',
        profile: 'Profil',
        search: 'Rechercher',
        categories: 'Catégories',

        // Actions
        login: 'Connexion',
        register: 'Inscription',
        logout: 'Déconnexion',
        send: 'Envoyer',
        cancel: 'Annuler',
        save: 'Enregistrer',
        delete: 'Supprimer',
        edit: 'Modifier',

        // Listing
        price: 'Prix',
        location: 'Localisation',
        description: 'Description',
        category: 'Catégorie',
        seller: 'Vendeur',
        contact: 'Contacter',

        // Messaging
        voiceMessage: 'Message vocal',
        recording: 'Enregistrement...',
        typing: 'En train d\'écrire...',

        // Categories
        electronics: 'Électronique',
        fashion: 'Mode',
        vehicles: 'Véhicules',
        'real-estate': 'Immobilier',
        services: 'Services',
        home: 'Maison',
        sports: 'Sports',
        other: 'Autre',
    },

    ar: {
        // Navigation
        home: 'الرئيسية',
        messages: 'الرسائل',
        create: 'إنشاء',
        profile: 'الملف الشخصي',
        search: 'بحث',
        categories: 'الفئات',

        // Actions
        login: 'تسجيل الدخول',
        register: 'التسجيل',
        logout: 'تسجيل الخروج',
        send: 'إرسال',
        cancel: 'إلغاء',
        save: 'حفظ',
        delete: 'حذف',
        edit: 'تعديل',

        // Listing
        price: 'السعر',
        location: 'الموقع',
        description: 'الوصف',
        category: 'الفئة',
        seller: 'البائع',
        contact: 'اتصل',

        // Messaging
        voiceMessage: 'رسالة صوتية',
        recording: 'جاري التسجيل...',
        typing: 'يكتب...',

        // Categories
        electronics: 'إلكترونيات',
        fashion: 'أزياء',
        vehicles: 'مركبات',
        'real-estate': 'عقارات',
        services: 'خدمات',
        home: 'منزل',
        sports: 'رياضة',
        other: 'أخرى',
    },

    en: {
        // Navigation
        home: 'Home',
        messages: 'Messages',
        create: 'Create',
        profile: 'Profile',
        search: 'Search',
        categories: 'Categories',

        // Actions
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
        send: 'Send',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',

        // Listing
        price: 'Price',
        location: 'Location',
        description: 'Description',
        category: 'Category',
        seller: 'Seller',
        contact: 'Contact',

        // Messaging
        voiceMessage: 'Voice message',
        recording: 'Recording...',
        typing: 'Typing...',

        // Categories
        electronics: 'Electronics',
        fashion: 'Fashion',
        vehicles: 'Vehicles',
        'real-estate': 'Real Estate',
        services: 'Services',
        home: 'Home',
        sports: 'Sports',
        other: 'Other',
    },
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.fr;
