# AI-Based Employee Performance Analytics & Recommendation System 🚀

A modern, full-stack MERN application that analyzes employee performance data and provides AI-powered recommendations (promotions, training, rankings) using the OpenRouter API.

## 🌟 Features

- **Secure Authentication:** JWT-based login and registration with encrypted passwords (bcrypt).
- **Employee Management:** HR/Admin users can add, view, search, and filter employee records dynamically.
- **AI Recommendations:** Integrates with the `google/gemma-4-31b-it` model via OpenRouter to automatically analyze employee performance, generate constructive feedback, suggest training skills, and rank top performers.
- **Premium UI/UX:** Built with a custom Glassmorphism design system, smooth micro-animations, and a responsive, light-themed modern aesthetic.
- **Robust Error Handling:** Features safe AI JSON response parsing and comprehensive validation across the frontend and backend.

## 🛠️ Tech Stack

- **Frontend:** React (Vite), React Router, Vanilla CSS, Lucide React (Icons)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB & Mongoose
- **AI Integration:** OpenRouter API
- **Deployment:** Render (Static Site for Frontend, Web Service for Backend)

---

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js installed
- MongoDB URI (e.g., MongoDB Atlas)
- OpenRouter API Key

### 1. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Visit `http://localhost:5173` in your browser.

---

## 🌐 Deployment (Render)

This project is optimized for deployment on [Render](https://render.com/).

### Backend (Web Service)
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- *Ensure to add all Backend Environment Variables in the Render dashboard.*

### Frontend (Static Site)
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Environment Variables:** Add `VITE_API_URL=https://your-backend-url.onrender.com/api`
- **Redirects/Rewrites:** Add a rewrite rule for React Router (`Source: /*`, `Destination: /index.html`).

---

## 📡 Core API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST   | `/api/auth/register` | Register a new HR/Admin | No |
| POST   | `/api/auth/login` | Login and receive JWT | No |
| POST   | `/api/employees` | Add a new employee | Yes |
| GET    | `/api/employees` | Get all employees | Yes |
| GET    | `/api/employees/search` | Filter employees | Yes |
| POST   | `/api/ai/recommend` | Generate AI insights | Yes |

> **Note:** Include the JWT token in the `Authorization` header as a `Bearer` token for all protected routes.

---

## 🎓 Academic Submission Note
Developed for the B.Tech 4th Semester ESE Examination (AI Driven Full Stack Development). Contains strict compliance with provided constraints, robust AI prompt integration, and responsive web aesthetics.
