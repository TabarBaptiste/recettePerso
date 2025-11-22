# Guide de Déploiement

Ce guide explique comment déployer l'application de gestion de recettes sur des plateformes gratuites.

## 📦 Déploiement complet

### 1. Base de données - Neon (PostgreSQL)

1. Créez un compte sur [Neon](https://neon.tech)
2. Créez un nouveau projet
3. Créez une base de données
4. Copiez la chaîne de connexion (Database URL)

### 2. Backend - Render / Railway

#### Render (Gratuit)

1. Créez un compte sur [Render](https://render.com)
2. Cliquez sur "New" → "Web Service"
3. Connectez votre repository GitHub
4. Configuration:
   - **Name**: `recettes-api` (ou autre)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build && npx prisma generate && npx prisma migrate deploy`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. Variables d'environnement:
   ```
   DATABASE_URL=<votre_url_neon>
   PORT=3000
   NODE_ENV=production
   ```

6. Cliquez sur "Create Web Service"

#### Railway (Alternative)

1. Créez un compte sur [Railway](https://railway.app)
2. Créez un nouveau projet depuis GitHub
3. Sélectionnez le dossier `backend`
4. Ajoutez les variables d'environnement
5. Railway détectera automatiquement Node.js

### 3. Frontend - Netlify

#### Méthode 1: Deploy automatique via Git

1. Créez un compte sur [Netlify](https://netlify.com)
2. Cliquez sur "Add new site" → "Import an existing project"
3. Connectez votre repository GitHub
4. Configuration:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/frontend/browser`
   - **Node version**: 20

5. Variables d'environnement (optionnel):
   - Pas nécessaire pour la production si vous utilisez `environment.prod.ts`

6. Cliquez sur "Deploy site"

#### Méthode 2: Deploy manuel

```bash
cd frontend
npm run build
npx netlify-cli deploy --prod --dir=dist/frontend/browser
```

### 4. Configuration post-déploiement

#### Frontend

Mettez à jour `frontend/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://votre-api.onrender.com/api',  // URL de votre backend
  accessCode: 'VOTRE_CODE_SECRET'  // Changez ce code!
};
```

Puis redéployez:
```bash
npm run build
```

#### Backend - CORS

Assurez-vous que le backend autorise les requêtes depuis votre domaine Netlify.

Dans `backend/src/index.ts`, le `cors()` actuel autorise toutes les origines. Pour plus de sécurité en production:

```typescript
app.use(cors({
  origin: ['https://votre-app.netlify.app']
}));
```

### 5. Vérification

1. Testez l'API backend:
   ```bash
   curl https://votre-api.onrender.com/health
   ```

2. Ouvrez votre application frontend:
   ```
   https://votre-app.netlify.app
   ```

3. Testez le flux complet:
   - Connexion avec le code d'accès
   - Ajout d'une recette
   - Consultation
   - Modification
   - Suppression

## 🔧 Dépannage

### Erreur CORS
- Vérifiez que l'URL du backend est correcte dans `environment.prod.ts`
- Vérifiez la configuration CORS dans le backend

### Erreur de connexion à la base de données
- Vérifiez que `DATABASE_URL` est correctement configuré
- Assurez-vous que les migrations ont été exécutées

### Build échoue sur Netlify
- Vérifiez la version de Node.js (doit être 18+)
- Vérifiez les logs de build pour identifier l'erreur

### API ne répond pas
- Vérifiez les logs sur Render/Railway
- Assurez-vous que le service est démarré
- Testez l'endpoint `/health`

## 🎯 Checklist de déploiement

- [ ] Compte Neon créé et base de données configurée
- [ ] Backend déployé sur Render/Railway
- [ ] Variables d'environnement backend configurées
- [ ] Migrations Prisma exécutées
- [ ] Frontend déployé sur Netlify
- [ ] URL du backend mise à jour dans environment.prod.ts
- [ ] Code d'accès personnalisé
- [ ] Tests de l'application complète
- [ ] Configuration CORS sécurisée (production)

## 💡 Conseils

1. **Sécurité**: Changez le code d'accès par défaut
2. **Performance**: Utilisez le cache CDN de Netlify
3. **Monitoring**: Activez les logs sur Render/Railway
4. **Backup**: Neon offre des sauvegardes automatiques
5. **Domaine**: Ajoutez un domaine personnalisé sur Netlify

## 📊 Coûts

Avec les services gratuits:
- **Neon**: Gratuit (512 MB de stockage, 3 projets)
- **Render**: Gratuit (services dormants après 15 min d'inactivité)
- **Netlify**: Gratuit (100 GB de bande passante/mois)

**Total**: 0 €/mois 🎉
