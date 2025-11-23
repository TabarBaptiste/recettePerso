# 🧑‍🍳 Application de Gestion de Recettes Maison

Une application web moderne et mobile-first pour gérer vos recettes maison : ajout, modification, suppression et consultation de recettes. Protection simple par code d'accès côté frontend.

## 🎨 Fonctionnalités

- ✅ Liste des recettes avec recherche par titre ou ingrédient
- ✅ Affichage détaillé d'une recette (ingrédients, étapes, image, durée)
- ✅ Ajout et modification de recettes
- ✅ **Upload d'images** - Téléchargez vos propres images pour les recettes (JPG, PNG, GIF, WebP, 5MB max)
- ✅ Suppression de recettes
- ✅ Protection par code d'accès (frontend uniquement)
- ✅ Design responsive mobile-first
- ✅ Interface moderne avec Tailwind CSS

## 🏗️ Architecture

### Frontend - Angular 20+
- **Framework**: Angular 20+ (standalone components)
- **Styling**: Tailwind CSS v4
- **HTTP Client**: HttpClient natif Angular
- **Routing**: Angular Router

### Backend - Node.js + Express + Prisma
- **Framework**: Express.js
- **ORM**: Prisma
- **Base de données**: PostgreSQL (Neon)
- **API**: REST API

## 📁 Structure du projet

```
recettePerso/
├── backend/
│   ├── src/
│   │   ├── index.ts           # Point d'entrée du serveur
│   │   └── routes/
│   │       └── recipes.ts     # Routes API des recettes
│   ├── prisma/
│   │   └── schema.prisma      # Schéma de la base de données
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/    # Composants Angular
│   │   │   ├── services/      # Services Angular
│   │   │   ├── models/        # Modèles de données
│   │   │   └── environments/  # Configuration
│   │   ├── styles.css         # Styles globaux avec Tailwind
│   │   └── index.html
│   ├── package.json
│   └── postcss.config.js
└── README.md
```

## 🚀 Installation et démarrage

### Prérequis

- Node.js 18+ et npm
- PostgreSQL (ou compte Neon gratuit)

### Backend

1. **Installer les dépendances**
   ```bash
   cd backend
   npm install
   ```

2. **Configurer la base de données**
   
   Créez un fichier `.env` basé sur `.env.example`:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
   PORT=3000
   ```

3. **Générer le client Prisma et créer les tables**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. **Démarrer le serveur**
   ```bash
   # Mode développement avec auto-reload
   npm run dev
   
   # Mode production
   npm run build
   npm start
   ```

Le serveur sera accessible sur `http://localhost:3000`

### Frontend

1. **Installer les dépendances**
   ```bash
   cd frontend
   npm install
   ```

2. **Configurer l'environnement**
   
   Modifiez `src/environments/environment.ts` si nécessaire:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:3000/api',
     accessCode: 'MY_SECRET_CODE'  // Changez ce code!
   };
   ```

3. **Démarrer l'application**
   ```bash
   # Mode développement
   npm start
   
   # Build pour production
   npm run build
   ```

L'application sera accessible sur `http://localhost:4200`

## 🔒 Code d'accès

Le code d'accès est défini dans `frontend/src/environments/environment.ts`. 

**Par défaut**: `MY_SECRET_CODE`

Pour vous connecter:
1. Cliquez sur "Se connecter" dans le header
2. Entrez le code d'accès
3. Les boutons d'ajout, modification et suppression seront débloqués

**Note de sécurité**: Cette protection est uniquement côté frontend et ne doit PAS être utilisée pour des données sensibles. C'est une simple protection contre les modifications accidentelles.

## 🎨 Palette de couleurs

```css
Vert profond:      #127369 (green-deep)
Vert foncé:        #10403B (green-dark)
Gris-vert clair:   #8AA6A3 (gray-green)
Gris foncé:        #4C5958 (gray-dark)
```

## 📡 API Endpoints

### Recettes

- `GET /api/recipes` - Liste toutes les recettes
- `GET /api/recipes/:id` - Récupère une recette spécifique
- `POST /api/recipes` - Crée une nouvelle recette
- `PUT /api/recipes/:id` - Met à jour une recette
- `DELETE /api/recipes/:id` - Supprime une recette

### Health Check

- `GET /health` - Vérifie que l'API est en ligne

## 🚀 Déploiement

### Frontend (Netlify)

1. Build l'application: `npm run build`
2. Le dossier à déployer est `dist/frontend`
3. Variables d'environnement à configurer:
   - Utiliser `environment.prod.ts` pour la production

### Backend (Render/Railway/Vercel)

1. Connectez votre repository GitHub
2. Configurez les variables d'environnement:
   - `DATABASE_URL`: URL de connexion Neon PostgreSQL
   - `PORT`: 3000 (ou le port fourni par le service)
3. Build command: `npm run build`
4. Start command: `npm start`

### Base de données (Neon)

1. Créez un compte sur [Neon](https://neon.tech)
2. Créez une nouvelle base de données
3. Copiez la chaîne de connexion dans votre `.env`
4. Exécutez les migrations: `npm run prisma:deploy`

## 🛠️ Technologies utilisées

### Frontend
- Angular 20+
- Tailwind CSS v4
- TypeScript
- RxJS

### Backend
- Node.js
- Express.js
- Prisma ORM
- TypeScript
- PostgreSQL

## 📝 Modèle de données

```typescript
interface Recipe {
  id: number;
  title: string;
  ingredients: string;
  steps: string;
  imageUrl?: string;  // URL externe ou chemin local (ex: /uploads/images/123456.jpg)
  duration?: number;  // en minutes
  createdAt: Date;
  updatedAt: Date;
}
```

## 📸 Gestion des images

L'application permet désormais de télécharger des images personnalisées pour chaque recette :

- **Formats supportés** : JPG, JPEG, PNG, GIF, WebP
- **Taille maximale** : 5 MB
- **Stockage** : Les images sont stockées localement dans `backend/uploads/images/`
- **Suppression automatique** : Les images sont automatiquement supprimées lors de la suppression ou du remplacement de la recette
- **Compatibilité** : Le système supporte toujours les URLs d'images externes

## 🤝 Contribution

Ce projet est une application personnelle de gestion de recettes. N'hésitez pas à le forker et à l'adapter à vos besoins!

## 📄 Licence

ISC

## 👨‍💻 Auteur

Créé avec ❤️ pour gérer vos recettes maison
