# DevResource — Developer Skill & Resource Allocation Portal

> **Premium Corporate SaaS Web Application for Software Engineering Resource Management & Skill Matching**

DevResource is a Software Engineering resource allocation system built on the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**. It helps project managers solve the core operational question:

> **"Which developer is best suited for a particular project task based on their technical skills and current availability?"**

---

## 📸 Key Features

1. **Executive Corporate SaaS Interface**:
   - Clean, bright **Light Theme (Default)** with soft grays, crisp white cards, and indigo accents.
   - Professional **Dark Theme** using dark blue-gray surfaces (not pitch black).
   - Global `ThemeContext` with instant toggle and `localStorage` persistence.
   - Custom typography (Inter font), 10–14px border radii, subtle elevation shadows, and animated toasts.

2. **Deterministic Skill Matching Engine**:
   - Calculates exact suitability percentage:
     $$\text{Match Percentage} = \frac{\text{Matched Required Skills}}{\text{Total Required Skills}} \times 100$$
   - Ranks developers by match percentage, availability capacity, and experience.
   - Shows clear skill breakdown (matched with green `✓`, missing with red `✕`).
   - One-click resource assignment with confirmation modal.

3. **Complete Software Engineering Workload Lifecycle**:
   - **Developers**: Profile directory, experience, availability (`Available`, `Partially Allocated`, `Fully Allocated`), multi-skill proficiencies (`Beginner`, `Intermediate`, `Advanced`, `Expert`).
   - **Skills**: Global technology library and real-time usage statistics.
   - **Projects**: Portfolio tracker with automatic task progress bars.
   - **Tasks**: Work item deliverables, deadlines, priorities, and required skill tags.
   - **Resource Allocation Matrix**: Centralized view of all active engineering assignments.

4. **Role-Based Workspaces**:
   - **Admin / Resource Manager**: Full CRUD control, matching engine, and allocation matrix.
   - **Software Developer**: Personalized workspace with assigned tasks, project associations, and live task status updater (`To Do` → `In Progress` → `Completed`).

---

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite), JavaScript, React Router DOM, Axios, Bootstrap 5, Bootstrap Icons, Vanilla CSS Variables.
- **Backend**: Node.js, Express.js, JWT (JSON Web Tokens), Bcrypt.js, CORS, Dotenv.
- **Database**: MongoDB with Mongoose ODM (strict schema validation).

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI)

### 2. Backend Setup
```bash
cd backend
npm install
npm run seed     # Seeds realistic demo data (or let server auto-seed on initial launch)
npm start        # Starts Express server on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Starts Vite dev server on http://localhost:3000
```

Open your browser at **`http://localhost:3000`**.

---

## 🔑 Pre-Seeded Demo Credentials

| Role | Name | Email | Password | Key Skills / Capabilities |
|---|---|---|---|---|
| **Admin** | Alex Carter | `admin@example.com` | `admin123` | Resource Manager / Full Management Access |
| **Developer** | Rahul Sharma | `rahul@example.com` | `dev123` | React, JavaScript, Node.js, MongoDB (Senior Full Stack) |
| **Developer** | Amit Patil | `amit@example.com` | `dev123` | Java, Spring Boot, MySQL (Backend Developer) |
| **Developer** | Priya Verma | `priya@example.com` | `dev123` | Python, MySQL, REST APIs (Python / Data) |
| **Developer** | Neha Singh | `neha@example.com` | `dev123` | HTML & CSS, JavaScript, React (Frontend Developer) |

*(Quick-fill demo buttons are also provided directly on the Login page for one-click authentication during evaluations!)*

---

## 🎯 Step-by-Step Viva Demonstration Flow

1. **Admin Login**: Sign in using `admin@example.com` / `admin123`.
2. **Dashboard Overview**: View 4 stat cards, availability breakdown progress bars, recent projects, and recent tasks.
3. **Developers Directory**: Open `Developers` → view Rahul Sharma's skills and availability.
4. **Task & Skill Matching Demonstration**:
   - Go to `Tasks` → locate unassigned task **"Create Product Dashboard"** (Requires: `React`, `JavaScript`, `MongoDB`).
   - Click **"Match"** / **"Find Suitable Developer"**.
   - System calculates:
     - **Rahul Sharma**: **100% (Excellent Match)** — Has all 3 required skills.
     - **Neha Singh**: **67% (Good Match)** — Has React & JavaScript, missing MongoDB.
     - **Amit Patil**: **0% (Low Match)** — Missing all 3 required skills.
5. **Assign Developer**: Click **"Assign Developer"** next to Rahul Sharma → Confirm assignment.
6. **Resource Allocation**: Open `Resource Allocation` → verify the newly allocated task and updated availability metrics.
7. **Developer Workspace**:
   - Log out and log in as **Rahul Sharma** (`rahul@example.com` / `dev123`).
   - See assigned task **"Create Product Dashboard"** in personal workspace.
   - Change task status: `To Do` → `In Progress` → `Completed`.
8. **Admin Verification**:
   - Log back into Admin account → verify that task is marked `Completed` and project progress bar is automatically updated!

---

## 📂 Project Architecture

```
SEQA TAE 1/
├── backend/
│   ├── config/db.js
│   ├── models/User.js, Skill.js, Project.js, Task.js
│   ├── controllers/authController.js, developerController.js, skillController.js, ...
│   ├── routes/authRoutes.js, developerRoutes.js, matchingRoutes.js, ...
│   ├── middleware/auth.js, errorHandler.js
│   ├── utils/seedData.js
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── context/AuthContext.jsx, ThemeContext.jsx
│   │   ├── services/api.js, developerService.js, taskService.js, ...
│   │   ├── components/common/Navbar.jsx, Sidebar.jsx, Modal.jsx, Badge.jsx, Avatar.jsx
│   │   ├── components/matching/MatchModal.jsx
│   │   ├── pages/Login.jsx, Dashboard.jsx, DeveloperDashboard.jsx, Developers.jsx, Tasks.jsx, ...
│   │   ├── styles/index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
├── docs/ (01-Problem-Statement.md through 10-Future-Scope.md)
├── TESTING.md
└── README.md
```
