# 🎬 TakiCiné — Application Angular

Application de gestion et découverte de films développée avec Angular 18.

## 🚀 Lancer le projet

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
ng serve

# 3. Ouvrir dans le navigateur
http://localhost:4200
```

## ✨ Fonctionnalités

### Page Accueil
- **Hero cinématographique** avec image de fond et statistiques en temps réel
- **Barre de recherche** avec résultats en direct (film, réalisateur, genre)
- **Carrousel "Films Tendance"** des films les mieux notés
- **Section "Coups de Cœur"** (note ≥ 4.5)
- **15 catégories de genres** : Comédie, Action, Romance, Fantastique, Thriller, Science-fiction, Drame, Jeunesse, Aventure, Documentaire, TV, Historique, Animation, Western, Art
- **Bouton "Charger plus"** par catégorie
- **Footer** avec cinémas partenaires (Paris, Lyon, Marseille, Nice) et réseaux sociaux

### Gestion des Films (CRUD complet)
- Tableau avec tous les films (recherche, filtre)
- **Formulaire Reactive Angular** avec validations :
  - Titre : obligatoirement en MAJUSCULES
  - Réalisateur : format Prénom Nom (regex)
  - Date : doit être antérieure à aujourd'hui
  - Synopsis : minimum 30 caractères
- **Nouveaux champs** : Genre (15 options), Durée (minutes), Classification (+6, +10, +12, +16, +18, Tout public)
- Notifications toast pour ajout / modification / suppression

### Page Détail d'un Film
- Image en hero avec fond flouté
- Informations complètes du film
- **Outils IA (Claude API)** :
  - 🎬 Analyse approfondie du film
  - ✍️ Critique professionnelle IA
  - 💡 Recommandations de films similaires
- **Système d'avis complet** : ajouter, modifier, supprimer son avis
- Notation par étoiles interactives
- Films similaires du même genre

### Panel Admin
- 4 cards de statistiques (films, utilisateurs, avis, note moyenne)
- 3 graphiques Chart.js (notes par film, répartition genres, avis par film)
- Tableau des derniers films ajoutés

### Inscription / Connexion
- Formulaires Reactive Forms avec validation complète
- Bascule inscription ↔ connexion

### Mon Espace
- Avatar avec initiales
- Onglets : Mes infos / Points fidélité
- Modification du profil
- Système de niveaux (Bronze, Silver, Gold, Diamond)

## 🛠️ Technologies

- **Angular 18** (Standalone Components, Signals)
- **Reactive Forms** avec validators personnalisés
- **Chart.js 4** pour les graphiques
- **Claude AI API** pour les outils IA
- **SCSS** avec variables CSS et animations

## 📁 Structure du projet

```
src/
├── app/
│   ├── components/
│   │   ├── navbar/
│   │   └── toast/
│   ├── pages/
│   │   ├── home/
│   │   ├── movies/
│   │   ├── film-detail/
│   │   ├── admin/
│   │   ├── inscription/
│   │   └── profil/
│   ├── services/
│   │   ├── film.service.ts
│   │   ├── auth.service.ts
│   │   └── toast.service.ts
│   └── models/
│       └── film.model.ts
└── styles.scss
```
