# Frontend - Recipe Management App

Application Angular moderne pour la gestion de recettes avec Tailwind CSS.

## Installation

```bash
npm install
```

## Configuration

Modifiez `src/environments/environment.ts` pour configurer:
- L'URL de l'API backend
- Le code d'accès pour les modifications

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  accessCode: 'MY_SECRET_CODE'
};
```

## Scripts disponibles

- `npm start` - Démarrer en mode développement (port 4200)
- `npm run build` - Build pour production
- `npm test` - Lancer les tests
- `npm run watch` - Build en mode watch

## Composants principaux

- **RecipeListComponent** - Liste et recherche de recettes
- **RecipeDetailComponent** - Affichage détaillé d'une recette
- **RecipeFormComponent** - Formulaire d'ajout/modification
- **AccessCodeModalComponent** - Modal de connexion
- **HeaderComponent** - En-tête avec navigation

## Services

- **RecipeService** - Communication avec l'API backend
- **AccessCodeService** - Gestion du code d'accès

## Technologies

- Angular 20+
- Tailwind CSS v4
- TypeScript
- RxJS
- Angular Router
- HttpClient
