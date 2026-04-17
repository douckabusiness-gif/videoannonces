// Exemple d'intégration des badges dans une carte d'annonce

import BadgeDisplay from '@/components/badges/BadgeDisplay';

// Dans votre composant de carte d'annonce, ajoutez ceci :

// 1. Fetch les badges de l'utilisateur
const [userBadges, setUserBadges] = useState([]);

useEffect(() => {
    if (listing.user.id) {
        fetch(`/api/users/${listing.user.id}/badges`)
            .then(res => res.json())
            .then(data => setUserBadges(data));
    }
}, [listing.user.id]);

// 2. Affichez les badges dans la section utilisateur
<div className="flex items-center gap-2 pt-3 border-t border-gray-100">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
        {listing.user.name[0]}
    </div>
    <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900 truncate">
                {listing.user.name}
            </p>
            <BadgeDisplay badges={userBadges} size="small" maxDisplay={3} />
        </div>
        <p className="text-xs text-gray-500">
            ⭐ {listing.user.rating.toFixed(1)}
        </p>
    </div>
</div>

// 3. Pour afficher tous les badges sur une page de profil
import BadgeList from '@/components/badges/BadgeList';

<BadgeList userId={user.id} />
