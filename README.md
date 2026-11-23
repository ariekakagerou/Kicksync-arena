# ⚽ KickSync Arena & Youth Tiger Soccer School

Full-stack solution for football academy management, player assessment, training schedules, coaching rosters, and interactive dashboard analytics.

---

## 📁 Repository Structure

```
.
├── KickSync-Arena/                       # Frontend application (HTML5, TailwindCSS, Vanilla JS)
│   ├── assets/                          # Images, brand assets, icons
│   ├── css/                             # Stylesheets
│   ├── js/                              # Modular views, components, state management
│   ├── index.html                       # Frontend entry point
│   └── start-backend.bat                # Shortcut to launch backend
│
└── Youth-Tiger-Soccer-School-back-end-/ # Backend REST API (Node.js, Express, MySQL)
    ├── aspect/                          # Evaluation aspect modules
    ├── aspect_sub/                      # Sub-aspect modules
    ├── assessment/                      # Assessment & scoring routes/controllers
    ├── coach/                           # Coach management
    ├── config/                          # Database connection & memory fallback
    ├── departement/                     # Department routes/controllers
    ├── information/                     # Announcement & news board
    ├── management/                      # Admin & user management
    ├── point_rate/                      # Rating scales & configuration
    ├── schedule/                        # Training & match schedule
    ├── student/                         # Student & player management
    ├── uploads/                         # Dynamic upload directory
    ├── .env.example                     # Environment template
    ├── server.js                        # Express server entry point
    ├── swagger.js                       # Swagger UI documentation config
    └── student.sql                      # Database schema and sample data
```

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd "Youth-Tiger-Soccer-School-back-end-"
npm install
cp .env.example .env
# Edit .env according to your MySQL database credentials
npm start
```

- API Base URL: `http://localhost:3000`
- Swagger Documentation: `http://localhost:3000/api-docs`
- Healthcheck Endpoint: `http://localhost:3000/api/health`

### 2. Frontend Setup

Open `KickSync-Arena/index.html` in your browser or run a local static server:

```bash
cd KickSync-Arena
# With VS Code Live Server or python http.server:
python -m http.server 8080
```
Open `http://localhost:8080` in your web browser.

### 3. Deploy Frontend to Vercel

1. Import this repository in [Vercel](https://vercel.com/).
2. In the **Root Directory** field, click **Edit** and set it to:
   ```text
   KickSync-Arena
   ```
3. Leave **Build Command** and **Output Directory** empty (static project).
4. Click **Deploy**.
5. Once your backend is hosted online (e.g., on Railway/Render), set the backend URL in the browser console:
   ```javascript
   API.setBaseUrl('https://your-backend-domain.com/api');
   ```
   Or set `window.KICKSYNC_API_URL` prior to loading `api.js`.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, Modern CSS (TailwindCSS / Custom CSS), JavaScript ES6+ (SPA Architecture)
- **Backend:** Node.js, Express.js, MySQL (with in-memory fallback), Swagger / OpenAPI
- **Deployment:** Railway / Heroku ready (`Procfile` included)
