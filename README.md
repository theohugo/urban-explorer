# 🗺️ Urban Explorer

Une application mobile multiplateforme permettant d'explorer les lieux et événements intéressants à Paris avec une expérience utilisateur fluide et intuitive.

## ✨ Fonctionnalités

- **📍 Découverte de lieux** : Parcourez les lieux intéressants à Paris avec des évènements animés
- **🔍 Recherche et filtrage** : Trouvez rapidement des lieux par nom ou adresse
- **🗺️ Carte interactive** : Visualisez les lieux sur une carte géolocalisée de Paris
- **📅 Calendrier d'événements** : Consultez les événements prévus à Paris
- **💾 Visites planifiées** : Sauvegardez vos lieux à visiter ✨ **Intégrés automatiquement à votre calendrier téléphone** + **Sélection d'heure incluse**
- **👤 Profil utilisateur** : Gestion du profil avec photo personnalisée
- **🎯 Détails des lieux** : Consultez les informations complètes de chaque lieu
- **⏰ Sélecteur d'heure** : Choisissez l'heure de votre visite lors de la réservation

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
- **expo-calendar** - Intégration avec le calendrier du téléphone
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
   git clone https://github.com/theohugo/urban-explorer
   cd urban-explorer
   ```

2. **Installer les dépendances**
   ```bash
   npm install
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
1. Accédez à l'onglet "Decouverte"
2. Parcourez les évènements
3. Utilisez la barre de recherche pour filtrer par nom ou adresse
4. Appuyez sur un évènements pour voir ses détails

### Consulter la carte
1. Accédez à l'onglet "Carte"
2. La carte est centrée sur Paris par défaut
3. Consultez les lieux à proximité
4. Tapotez les marqueurs pour voir les détails

### Gérer votre profil
1. Accédez à l'onglet "Mon Profil"
2. Téléchargez une photo de profil depuis votre appareil ou prenez une photo
3. Consultez vos visites planifiées

### Consulter les événements
1. Accédez à l'onglet "Evenements"
2. Explorez les événements à venir à Paris
3. Consultez le calendrier pour les dates

## 🔄 Flux de données

```
API OpenData Paris
        ↓
   httpClient (Axios)
        ↓
   Interceptors (Gestion erreurs)
        ↓
   parisApi.ts (Transformation données)
        ↓
   PlacesContext ← AsyncStorage
        ↓
   Components (écrans)
```

### Interceptors HTTP

Le client HTTP utilise des **interceptors pour la gestion des erreurs** :
  - Gestion des erreurs réseau
  - Gestion des timeouts (12s)
  - Gestion des erreurs API
  - Retour d'une classe ApiError personnalisée


**Erreurs gérées :**
- ✅ Erreurs réseau (connexion perdue)
- ✅ Timeouts (12 secondes)
- ✅ Erreurs HTTP (4xx, 5xx)
- ✅ Messages d'erreur formatés en français

## � API Documentation

### Endpoint utilisé

Urban Explorer utilise l'**API OpenData Paris** pour récupérer les données sur les lieux et événements culturels.

**Base URL :**
```
https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records
```

### Transformations appliquées

1. **Filtrage des données invalides** - Seuls les enregistrements avec latitude/longitude valides sont conservés
2. **Déduplication** - Les lieux en doublon sont supprimés
3. **Normalisation des adresses** - Les adresses sont construites à partir des champs : `address_street + address_zipcode + address_city`
4. **Extraction des horaires** ✨ - Les heures sont extraites de `date_start` et `date_end` au format `HH:MM`
5. **Fallback images** - Si pas d'image, une image placeholder est générée via Picsum.photos

### Gestion des erreurs

- En cas d'erreur API, les **données de fallback** (mockées) sont utilisées comme secours
- Le cache localStorage est utilisé quand disponible
- Les logs d'erreur sont affichés dans la console pour le débogage

### Pagination

L'API utilise la pagination avec :
- **Limit** : 50 résultats par défaut
- **Offset** : Récupération progressive des données
- Support du **infinite scroll** dans l'écran Discovery

### Permissions requises

**iOS** (`app.json`) :
- `NSCalendarsUsageDescription` - Accès au calendrier

**Android** (`app.json`) :
- `READ_CALENDAR` - Lecture du calendrier
- `WRITE_CALENDAR` - Écriture d'événements

### Flux d'ajout d'événement

1. **Utilisateur choisit une date** → Écran PlaceDetailScreen
2. **TimePickerModal s'ouvre** → Sélection de l'heure (0-23h, minutes par pas de 15)
3. **Utilisateur confirme l'heure** → Appel de `planVisit(date, time)`
4. **Sauvegarde locale** → AsyncStorage + PlacesContext
5. **Ajout au calendrier** → calendarService.addVisitToCalendar(date, **time**)
6. **Permission demandée** → Si première fois
7. **Événement créé** → Calendrier système avec l'heure exacte de réservation

### Détails de l'événement créé

- **Titre** : 📍 [Nom du lieu]
- **Lieu** : [Adresse complète du lieu]
- **Date/Heure** : La date ET heure choisies par l'utilisateur
- **Durée** : 2 heures par défaut
- **Fuseau horaire** : Europe/Paris
- **Notes** : "Visite planifiée de [Nom] à [Heure]"

### Gestion des erreurs

- Permission refusée → L'événement n'est pas créé, mais la visite reste planifiée
- Pas de calendrier disponible → Fallback gracieux
- Les erreurs sont loggées en console pour le débogage

## �📝 Notes de développement

- L'application utilise TypeScript pour une meilleure qualité de code
- Les données sont cachées avec AsyncStorage pour les performances
- Les données de secours (fallbackPlaces) sont disponibles en cas d'erreur API
- L'application est responsive et fonctionne sur IPhone et Android

## 📄 Licence

Ce projet est privé et développé pour IPSSI.

## � Auteurs

Projet développé en équipe par :

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
- Réservation des événement et ajout dans le calendrier
- Rédaction du README