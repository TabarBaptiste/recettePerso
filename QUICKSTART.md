# 🚀 Quick Start Guide

Get up and running with the Recipe Management app in 5 minutes!

## ⚡ Fastest way to start

### Option 1: Using Docker (Coming soon)
*Docker support will be added in a future update*

### Option 2: Local Development

**Prerequisites:**
- Node.js 18+ installed
- PostgreSQL running (or use Neon free tier)

**Step 1: Clone and install**
```bash
git clone https://github.com/TabarBaptiste/recettePerso.git
cd recettePerso
npm run install:all
```

**Step 2: Setup database**

Using Neon (easiest):
1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string

Or use local PostgreSQL:
```bash
createdb recettes
```

**Step 3: Configure backend**
```bash
cd backend
cp .env.example .env
# Edit .env and add your DATABASE_URL
```

**Step 4: Run migrations**
```bash
npm run prisma:generate
npm run prisma:migrate
```

**Step 5: Start development servers**

Terminal 1:
```bash
npm run dev:backend
```

Terminal 2:
```bash
npm run dev:frontend
```

**Step 6: Open your browser**
```
http://localhost:4200
```

## 🔐 Default Access Code

The default access code is: `MY_SECRET_CODE`

To change it, edit `frontend/src/environments/environment.ts`

## ✅ Verify everything works

1. Open http://localhost:4200
2. Click "Se connecter" in the header
3. Enter the access code: `MY_SECRET_CODE`
4. Click "Ajouter" to create your first recipe
5. Fill in the form and submit

## 🎯 What's next?

- Read the [README.md](README.md) for full documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) to deploy your app
- See [CONTRIBUTING.md](CONTRIBUTING.md) to contribute

## 🆘 Common Issues

### Backend won't start
- Check DATABASE_URL is correct
- Make sure PostgreSQL is running
- Run `npm run prisma:generate`

### Frontend build errors
- Delete `node_modules` and run `npm install` again
- Make sure you're using Node.js 18+

### Can't connect to API
- Make sure backend is running on port 3000
- Check `frontend/src/environments/environment.ts` has correct apiUrl

## 📞 Need help?

Open an issue on GitHub with:
- What you tried
- What error you got
- Your environment (OS, Node version)

Happy cooking! 🧑‍🍳
