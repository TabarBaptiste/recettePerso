# Guide de Contribution

Merci de votre intérêt pour contribuer à l'application de gestion de recettes! 🎉

## 🛠️ Configuration de développement

### Prérequis

- Node.js 18+ et npm
- PostgreSQL (local ou Neon)
- Git

### Installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/TabarBaptiste/recettePerso.git
   cd recettePerso
   ```

2. **Installer toutes les dépendances**
   ```bash
   npm run install:all
   ```

3. **Configurer la base de données**
   
   Créez `backend/.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/recettes?schema=public"
   PORT=3000
   ```

4. **Générer Prisma et créer les tables**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

### Démarrer en mode développement

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

L'application sera accessible sur:
- Frontend: http://localhost:4200
- Backend: http://localhost:3000

## 📝 Standards de code

### TypeScript

- Utiliser TypeScript strict mode
- Typer toutes les variables et fonctions
- Éviter `any` sauf si absolument nécessaire

### Angular

- Utiliser des standalone components
- Suivre la structure de dossiers existante
- Services dans `src/app/services/`
- Components dans `src/app/components/`
- Models dans `src/app/models/`

### Backend

- Routes dans `backend/src/routes/`
- Suivre le pattern Express standard
- Gérer les erreurs proprement
- Retourner des codes HTTP appropriés

### Styling

- Utiliser Tailwind CSS classes
- Respecter la palette de couleurs:
  - `green-deep`: #127369
  - `green-dark`: #10403B
  - `gray-green`: #8AA6A3
  - `gray-dark`: #4C5958
- Mobile-first responsive design

## 🔄 Workflow Git

1. **Créer une branche**
   ```bash
   git checkout -b feature/nom-de-la-fonctionnalite
   ```

2. **Faire vos modifications**
   ```bash
   git add .
   git commit -m "Description claire du changement"
   ```

3. **Pousser et créer une PR**
   ```bash
   git push origin feature/nom-de-la-fonctionnalite
   ```

### Messages de commit

Utilisez des messages clairs et descriptifs:

✅ Bon:
- `Add search functionality to recipe list`
- `Fix: Recipe form validation error`
- `Update: Improve mobile responsiveness`

❌ Mauvais:
- `fix bug`
- `update`
- `changes`

## 🧪 Tests

Avant de soumettre une PR:

1. **Tester le backend**
   ```bash
   cd backend
   npm run build
   ```

2. **Tester le frontend**
   ```bash
   cd frontend
   npm run build
   ```

3. **Tester manuellement**
   - Créer une recette
   - Modifier une recette
   - Supprimer une recette
   - Rechercher une recette
   - Tester sur mobile (responsive)

## 📦 Ajout de nouvelles fonctionnalités

### Nouvelle fonctionnalité frontend

1. Créer le composant dans `frontend/src/app/components/`
2. Créer le service si nécessaire dans `frontend/src/app/services/`
3. Ajouter la route dans `app.routes.ts` si applicable
4. Mettre à jour la documentation

### Nouvelle fonctionnalité backend

1. Créer la route dans `backend/src/routes/`
2. Mettre à jour le schéma Prisma si nécessaire
3. Créer une migration
4. Mettre à jour la documentation de l'API

## 🐛 Signaler un bug

Créez une issue GitHub avec:

- Description claire du problème
- Étapes pour reproduire
- Comportement attendu vs actuel
- Captures d'écran si applicable
- Informations système (OS, navigateur, version Node)

## 💡 Proposer une amélioration

Créez une issue GitHub avec:

- Description de l'amélioration
- Pourquoi c'est utile
- Comment vous l'implémenteriez (optionnel)

## 🎯 Idées de contributions

- [ ] Ajouter des catégories de recettes
- [ ] Ajouter une note/évaluation aux recettes
- [ ] Améliorer la recherche (filtres avancés)
- [ ] Ajouter l'upload d'images
- [ ] Ajouter un mode sombre
- [ ] Ajouter des tests unitaires
- [ ] Améliorer l'accessibilité (ARIA labels)
- [ ] Ajouter une fonctionnalité d'export PDF
- [ ] Ajouter une fonctionnalité d'impression
- [ ] Internationalisation (i18n)

## 📚 Ressources

- [Angular Documentation](https://angular.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Documentation](https://expressjs.com)

## 🤝 Code de conduite

- Soyez respectueux et constructif
- Acceptez les critiques avec ouverture
- Concentrez-vous sur ce qui est le mieux pour le projet

Merci de contribuer! 🙏
