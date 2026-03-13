# 🗺️ Urban Explorer

Une application mobile multiplateforme permettant d'explorer les lieux et événements intéressants à Paris avec une expérience utilisateur fluide et intuitive.

## 📋 Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Scripts disponibles](#scripts-disponibles)
- [Structure du projet](#structure-du-projet)
- [Architecture](#architecture)
- [Utilisation](#utilisation)

## ✨ Fonctionnalités

- **📍 Découverte de lieux** : Parcourez les lieux intéressants à Paris avec des cartes animées
- **🔍 Recherche et filtrage** : Trouvez rapidement des lieux par nom ou adresse
- **🗺️ Carte interactive** : Visualisez les lieux sur une carte géolocalisée de Paris
- **📅 Calendrier d'événements** : Consultez les événements prévus à Paris
- **💾 Visites planifiées** : Sauvegardez vos lieux à visiter
- **👤 Profil utilisateur** : Gestion du profil avec photo personnalisée
- **🎯 Détails des lieux** : Consultez les informations complètes de chaque lieu
- **📱 Multi-plateforme** : Fonctionne sur iOS, Android et Web (via Expo)

## 🛠️ Technologies

### Framework et runtime
- **React Native** - Framework mobile multiplateforme
- **Expo** - Plateforme de développement et déploiement
- **React Navigation** - Système de navigation
- **TypeScript** - Typage statique pour JavaScript

### Dépendances principales
- **react-native-maps** - Affichage de cartes interactives
- **axios** - Client HTTP pour les API
- **react-native-calendars** - Calendrier pour les événements
- **@react-native-async-storage/async-storage** - Stockage persistant
- **expo-location** - Géolocalisation
- **expo-image-picker** - Sélection de photos
- **@expo/vector-icons** - Icônes vectorielles

### Sources de données
- **API OpenData Paris** - Donnances ouvertes sur les lieux et événements à Paris

## 📦 Installation

### Prérequis
- Node.js 16+ et npm/yarn
- Expo CLI : `npm install -g expo-cli`
- iOS (pour déployer sur iOS) : Xcode
- Android (pour déployer sur Android) : Android SDK

### Étapes d'installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd urban-explorer
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Démarrer le serveur Expo**
   ```bash
   npm start
   ```

## ⚙️ Configuration

### Permissions requises

L'application nécessite les permissions suivantes :

**iOS** (`app.json`) :
- `NSCameraUsageDescription` - Pour la photo de profil
- `NSLocationWhenInUseUsageDescription` - Pour la géolocalisation

**Android** (`app.json`) :
- `CAMERA` - Accès à la caméra
- `ACCESS_FINE_LOCATION` - Localisation précise
- `ACCESS_COARSE_LOCATION` - Localisation approximative
- `INTERNET` - Accès à Internet

## 🚀 Scripts disponibles

```bash
# Démarrer l'application en développement
npm start

# Lancer sur Android
npm run android

# Lancer sur iOS (macOS uniquement)
npm run ios

# Lancer sur Web (navigateur)
npm run web
```

## 📁 Structure du projet

```
urban-explorer/
├── src/
│   ├── components/           # Composants React réutilisables
│   │   ├── AnimatedPlaceCard.tsx
│   │   ├── ErrorState.tsx
│   │   ├── HeroHeader.tsx
│   │   ├── LoadingState.tsx
│   │   ├── MemoryCard.tsx
│   │   ├── ProfilePhotoCard.tsx
│   │   └── SearchBar.tsx
│   ├── context/              # Context API pour l'état global
│   │   └── PlacesContext.tsx
│   ├── data/                 # Données statiques
│   │   └── fallbackPlaces.ts
│   ├── navigation/           # Configuration de la navigation
│   │   └── AppNavigator.tsx
│   ├── screens/              # Écrans de l'application
│   │   ├── DiscoveryScreen.tsx
│   │   ├── EventsScreen.tsx
│   │   ├── MapScreen.tsx
│   │   ├── MapScreen.web.tsx
│   │   ├── PlaceDetailScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── services/             # Services et API
│   │   ├── httpClient.ts
│   │   ├── parisApi.ts
│   │   └── storage.ts
│   ├── theme/                # Thème et styles
│   │   └── colors.ts
│   └── types/                # Définitions TypeScript
│       ├── navigation.ts
│       └── place.ts
├── assets/                   # Images et ressources statiques
├── app.json                  # Configuration Expo
├── App.tsx                   # Point d'entrée principal
├── package.json
├── tsconfig.json
└── README.md
```

## 🏗️ Architecture

### Context API (`PlacesContext`)
Gère l'état global de l'application :
- Liste des lieux
- Visites planifiées
- Événements
- État de chargement et erreurs
- Gestion du cache

### Services
- **parisApi.ts** : Requêtes vers l'API OpenData de Paris
- **httpClient.ts** : Configuration du client HTTP (Axios)
- **storage.ts** : Gestion du stockage persistant (AsyncStorage)

### Navigation
Navigation par onglets avec écrans emboîtés :
- **Discovery** : Parcourir et chercher des lieux
- **Events** : Consulter les événements
- **Map** : Vue cartographique
- **Profile** : Gestion du profil utilisateur

### Composants
- **AnimatedPlaceCard** : Affichage animé des lieux
- **SearchBar** : Barre de recherche
- **LoadingState & ErrorState** : États de chargement et erreur
- **HeroHeader** : En-tête principal

## 💡 Utilisation

### Découvrir des lieux
1. Accédez à l'onglet "Discovery"
2. Parcourez les cartes de lieux
3. Utilisez la barre de recherche pour filtrer par nom ou adresse
4. Appuyez sur une carte pour voir les détails

### Consulter la carte
1. Accédez à l'onglet "Map"
2. La carte est centrée sur Paris
3. Consultez les lieux à proximité
4. Tapotez les marqueurs pour voir les détails

### Gérer votre profil
1. Accédez à l'onglet "Profile"
2. Téléchargez une photo de profil depuis votre appareil
3. Consultez vos visites planifiées

### Consulter les événements
1. Accédez à l'onglet "Events"
2. Explorez les événements à venir à Paris
3. Consultez le calendrier pour les dates

## 🔄 Flux de données

```
API OpenData Paris
        ↓
   parisApi.ts
        ↓
   PlacesContext ← AsyncStorage
        ↓
   Components (écrans)
```

## 📱 Plateforme supportées

- ✅ iOS 12+
- ✅ Android 5+
- ✅ Web (navigateurs modernes)

## � API Documentation

### Endpoint utilisé

Urban Explorer utilise l'**API OpenData Paris** pour récupérer les données sur les lieux et événements culturels.

**Base URL :**
```
https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records
```

### Paramètres de requête

| Paramètre | Type | Description |
|-----------|------|-------------|
| `limit` | number | Nombre de résultats par page (par défaut : 50) |
| `offset` | number | Décalage pour la pagination (commence à 0) |
| `order_by` | string | Champ de tri (`date_start` pour les événements) |

### Format des réponses

#### Réponse brute de l'API

```json
{
  "results": [
    {
      "id": "identifiant-unique",
      "title": "Titre de l'événement",
      "lead_text": "Description courte",
      "cover_url": "https://...",
      "address_name": "Nom du lieu",
      "address_street": "Rue",
      "address_zipcode": "75000",
      "address_city": "Paris",
      "date_start": "2026-03-15T14:00:00",
      "date_end": "2026-03-15T18:00:00",
      "date_description": "Dimanche 15 mars",
      "lat_lon": {
        "lat": 48.8566,
        "lon": 2.3522
      },
      "url": "https://...",
      "price_type": "Gratuit",
      "audience": "Tout public",
      "qfap_tags": "Musique"
    }
  ]
}
```

#### Types TypeScript utilisés

**Place (Lieu)**
```typescript
interface Place {
  id: string;              // Identifiant unique
  name: string;            // Nom du lieu
  address: string;         // Adresse complète
  latitude: number;        // Latitude
  longitude: number;       // Longitude
  imageUrl: string;        // URL de l'image
}
```

**EventItem (Événement)**
```typescript
interface EventItem {
  id: string;              // Identifiant unique
  title: string;           // Titre de l'événement
  summary: string;         // Description courte
  venueName: string;       // Nom du lieu
  address: string;         // Adresse complète
  latitude: number;        // Latitude
  longitude: number;       // Longitude
  startDate: string | null; // Date de début (ISO 8601)
  endDate: string | null;   // Date de fin (ISO 8601)
  dateLabel: string;       // Description de la date
  imageUrl: string;        // URL de l'image
  category: string;        // Catégorie (ex: Musique, Théâtre)
  audience: string;        // Public cible
  priceLabel: string;      // Information tarifaire
  detailsUrl: string | null; // URL pour plus de détails
}
```

### Transformations appliquées

1. **Filtrage des données invalides** - Seuls les enregistrements avec latitude/longitude valides sont conservés
2. **Déduplication** - Les lieux en doublon sont supprimés
3. **Normalisation des adresses** - Les adresses sont construites à partir des champs : `address_street + address_zipcode + address_city`
4. **Fallback images** - Si pas d'image, une image placeholder est générée via Picsum.photos

### Gestion des erreurs

- En cas d'erreur API, les **données de fallback** (mockées) sont utilisées comme secours
- Le cache localStorage est utilisé quand disponible
- Les logs d'erreur sont affichés dans la console pour le débogage

### Pagination

L'API utilise la pagination avec :
- **Limit** : 50 résultats par défaut
- **Offset** : Récupération progressive des données
- Support du **infinite scroll** dans l'écran Discovery

### Limites de l'API

- Débit limité (à vérifier dans la documentation officielle)
- Données mises à jour quotidiennement
- Les images proviennent de l'API ou d'une source par défaut
## 🗺️ Roadmap & Fonctionnalités futures

### V1.1 - Court terme (prochains sprints)
- 🔐 Authentification utilisateur avec compte personnel
- ❤️ Système de favoris amélioré avec synchronisation cloud
- 🏆 Badges et achievements pour les explorateurs
- 📸 Partage de souvenirs sur les réseaux sociaux
- 🔔 Notifications push pour les événements à proximité

### V1.2 - Moyen terme
- 🌍 Support de plusieurs villes (Lyon, Marseille, etc.)
- 🌙 Mode sombre complet
- 🗣️ Traduction multilingue (EN, ES, DE)
- ⭐ Système de notes et commentaires pour les lieux
- 📊 Statistiques utilisateur (lieux visités, distance parcourue)

### V2.0 - Long terme
- 🤖 Recommandations personnalisées avec IA
- 👥 Fonction sociale - suivre d'autres utilisateurs
- 🎯 Circuits touristiques pré-définis
- 🗺️ Offline mode complet
- 📱 App Widget pour accès rapide

### Améliorations techniques
- 🚀 Optimisation des performances et réduction du bundle
- 🔄 Synchronisation offline-first avec WatermelonDB
- 🧪 Suite de tests complète (Unit + E2E)
- 📈 Analytics et monitoring
- ♿ Accessibilité améliorée (WCAG 2.1)
## �🐛 Dépannage

### L'application ne se lance pas
```bash
# Nettoyer le cache Expo
expo start -c
```

### Les permissions ne fonctionnent pas
- Vérifier les paramètres de l'application sur l'appareil
- Redémarrer l'application

### La carte n'affiche pas les lieux
- Vérifier la connexion Internet
- Vérifier que l'API OpenData de Paris est accessible
- Consulter les logs dans la console Expo

## 📝 Notes de développement

- L'application utilise TypeScript pour une meilleure qualité de code
- Les données sont cachées avec AsyncStorage pour les performances
- Les données de secours (fallbackPlaces) sont disponibles en cas d'erreur API
- L'application est responsive et fonctionne sur IPhone et Android

## 📄 Licence

Ce projet est privé et développé pour IPSSI.

## � Auteurs

Projet développé en équipe pour IPSSI par :

### **RAGUIN Hugo**
- Initialisation et architecture du projet
- Configuration TypeScript
- Données mockées et intégration API
- Gestion des lieux et événements
- Création des slides de présentation

### **FIORESE Elliot**
- Développement des composants UI
- Gestion du profil utilisateur
- Gestion des souvenirs (memories)

### **TALEB Amine**
- Navigation React Navigation
- Gestion complète de la carte interactive
- Rédaction du README