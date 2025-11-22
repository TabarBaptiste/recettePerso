# Backend - Recipe Management API

API REST pour la gestion de recettes avec Express.js, Prisma et PostgreSQL.

## Installation

```bash
npm install
```

## Configuration

Créez un fichier `.env` avec:

```env
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
PORT=3000
```

## Scripts disponibles

- `npm run dev` - Démarrer en mode développement avec auto-reload
- `npm run build` - Compiler TypeScript vers JavaScript
- `npm start` - Démarrer le serveur en mode production
- `npm run prisma:generate` - Générer le client Prisma
- `npm run prisma:migrate` - Créer et appliquer les migrations
- `npm run prisma:deploy` - Déployer les migrations en production

## Endpoints API

### Recettes

- `GET /api/recipes` - Liste toutes les recettes
- `GET /api/recipes/:id` - Récupère une recette spécifique
- `POST /api/recipes` - Crée une nouvelle recette
- `PUT /api/recipes/:id` - Met à jour une recette
- `DELETE /api/recipes/:id` - Supprime une recette

### Health Check

- `GET /health` - Vérifie que l'API est en ligne

## Technologies

- Express.js
- Prisma ORM
- PostgreSQL
- TypeScript
- CORS
