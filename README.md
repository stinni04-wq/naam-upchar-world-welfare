# 🌳 Naam Upchar — World Welfare Desire Tree

A MERN stack web app for tracking Naam Jap (chanting rounds) for world welfare.

---

## 📱 Features

- **Registration** — Name, City, State, Country, Mobile
- **Auto-login** — JWT stored in localStorage; users stay logged in across sessions
- **Daily chanting tracker** — Log your rounds each day
- **Personal stats** — Total rounds by you, today's rounds
- **Global stats** — Total rounds by all devotees today, all-time world welfare total
- **Mobile-first** — Responsive saffron/devotional UI

---

## 🗂️ Project Structure

```
naam-upchar/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema (name, city, state, country, mobile, totalRounds)
│   │   └── ChantingLog.js   # Daily chanting log (user, date, rounds)
│   ├── routes/
│   │   ├── auth.js          # POST /register, POST /login, GET /me
│   │   ├── chanting.js      # GET /today, POST /update, GET /history
│   │   └── stats.js         # GET /global
│   ├── middleware/
│   │   └── auth.js          # JWT protect middleware
│   ├── server.js            # Express app entry point
│   ├── .env.example         # Environment variable template
│   └── package.json
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── pandit.jpg       # ← PLACE IMAGE 5 (pandit photo) HERE
│   │   └── logo.png         # ← PLACE IMAGE 4 (logo/mala) HERE
│   ├── src/
│   │   ├── api/index.js     # Axios API client with JWT interceptors
│   │   ├── context/AuthContext.js  # Global auth state
│   │   ├── pages/
│   │   │   ├── LandingPage.js + .css   # Home / Register / Login
│   │   │   └── Dashboard.js + .css     # Post-login dashboard
│   │   ├── components/
│   │   │   └── LoadingScreen.js
│   │   ├── App.js           # Root component — routes based on auth state
│   │   ├── App.css          # Global styles (CSS variables, shared components)
│   │   └── index.js         # ReactDOM entry
│   └── package.json
├── render.yaml              # Render.com deployment config
├── Procfile                 # Heroku/Railway deployment
└── README.md
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js v18+
- A MongoDB Atlas account (free tier works great)

### 2. Clone & Install

```bash
git clone <your-repo-url>
cd naam-upchar

# Install all dependencies
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/naam-upchar?retryWrites=true&w=majority
JWT_SECRET=any_long_random_string_here_change_this
NODE_ENV=development
```

### 4. Add Images

Place your images in the `frontend/public/` directory:
- `frontend/public/pandit.jpg` — The pandit/spiritual guide photo (Image 5)
- `frontend/public/logo.png` — The mala/logo image (Image 4)

### 5. Run

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
# Runs on http://localhost:3000
```

---

## ☁️ Deploy to Render.com (Recommended — Free)

### Step 1: MongoDB Atlas
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Create free cluster
2. Create a database user (username + password)
3. Allow access from anywhere: Network Access → `0.0.0.0/0`
4. Get connection string: Clusters → Connect → Drivers → copy URI

### Step 2: Add images to `frontend/public/`
```
frontend/public/pandit.jpg   (rename your pandit photo)
frontend/public/logo.png     (rename your logo/mala image)
```

### Step 3: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - Naam Upchar app"
git remote add origin https://github.com/<your-username>/naam-upchar.git
git push -u origin main
```

### Step 4: Deploy on Render
1. Go to [render.com](https://render.com) → Sign up free
2. New → Web Service → Connect your GitHub repo
3. Settings:
   - **Build Command:** `cd frontend && npm install && npm run build && cd ../backend && npm install`
   - **Start Command:** `cd backend && node server.js`
   - **Root Directory:** *(leave blank)*
4. Environment Variables (add these):
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = your Atlas connection string
   - `JWT_SECRET` = any secret string (e.g. `naam_upchar_world_welfare_2024_secret`)
   - `PORT` = `10000`
5. Click **Create Web Service**

Your app will be live at `https://naam-upchar.onrender.com` (or similar) in ~5 minutes!

---

## ☁️ Alternative: Deploy to Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway add
railway up
```
Set the same 4 environment variables in Railway dashboard.

---

## 🗄️ MongoDB Schema

### Users Collection
```json
{
  "_id": "ObjectId",
  "name": "Ramesh Sharma",
  "city": "Ayodhya",
  "state": "Uttar Pradesh",
  "country": "India",
  "mobile": "+919876543210",
  "totalRoundsByMe": 1250,
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

### ChantingLogs Collection
```json
{
  "_id": "ObjectId",
  "user": "ObjectId (ref: User)",
  "date": "2024-06-15",
  "rounds": 16,
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```
*Unique compound index on `(user, date)` — one log per user per day.*

---

## 🔐 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login by mobile |
| GET | `/api/auth/me` | ✅ | Get current user (auto-login) |
| GET | `/api/chanting/today` | ✅ | Today's rounds for current user |
| POST | `/api/chanting/update` | ✅ | Set today's rounds `{ rounds: 16 }` |
| GET | `/api/chanting/history` | ✅ | Last 30 days history |
| GET | `/api/stats/global` | ✅ | Global totals (all devotees) |

---

## 🎨 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, CSS (no UI library) |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (365-day tokens, mobile-based login) |
| Fonts | Cinzel Decorative, Tiro Devanagari Sanskrit, Lato |
| Deploy | Render.com / Railway / Heroku |

---

## 🙏 Jai Shri Ram
