# 🤝 NGO Volunteer Hub

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-4.18.2-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-8.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
</p>

A full-stack **MERN** (MongoDB, Express, React, Node.js) web application that connects NGOs with volunteers. NGOs can post events (Beach cleanup, Food drive, Tree plantation, etc.) and volunteers can sign up to participate in these events.

## 📋 Project Overview

**Project Topic:** NGO Volunteer Hub (Category E: Social & Community)

**Course:** Advanced Web Development (AWD)

This platform enables:
- 🏢 **NGOs** to create and manage volunteer events
- 🙋 **Volunteers** to browse and register for events
- 📊 Both parties to track event participation and status

---

## ✨ Features

### Core Features
- ✅ JWT-based Authentication (Login/Signup)
- ✅ Password Hashing with bcryptjs
- ✅ 3 MongoDB Collections with relationships
- ✅ Full CRUD functionality for events
- ✅ React Functional Components with Hooks
- ✅ Protected Routes with role-based access

### Additional Features
- ✅ Role-based dashboards (NGO vs Volunteer)
- ✅ Event filtering by status, type, and city
- ✅ Registration approval workflow
- ✅ Modern, responsive UI design
- ✅ Mobile-friendly hamburger navigation
- ✅ CSS animations and transitions
- ✅ Professional gradient design

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, React Router v6, Axios, Vanilla CSS |
| **Backend** | Node.js, Express.js, JWT, bcryptjs |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 📁 Project Structure

```
NGO-Volunteer-Hub/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Authentication logic
│   │   ├── eventController.js  # Event CRUD operations
│   │   └── registrationController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   └── error.js           # Global error handler
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Event.js           # Event schema
│   │   └── Registration.js    # Registration schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   └── registrationRoutes.js
│   ├── .env.example           # Environment template
│   ├── Procfile               # Render deployment
│   ├── package.json
│   ├── seed.js                # Database seeder
│   └── server.js              # Main server file
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Alert.js
    │   │   ├── EventCard.js
    │   │   ├── Footer.js
    │   │   ├── Loading.js
    │   │   ├── Navbar.js
    │   │   └── ProtectedRoute.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Events.js
    │   │   ├── EventDetails.js
    │   │   ├── NGODashboard.js
    │   │   └── VolunteerDashboard.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── .env.example
    ├── vercel.json            # Vercel deployment
    └── package.json
```

---

## 🗃️ Database Schema

### Collections (3 Collections with Relationships)

| Collection | Key Fields | Relationships |
|------------|------------|---------------|
| **Users** | name, email, password, role, phone | - |
| **Events** | title, description, date, location, status | `ngo` → User |
| **Registrations** | status, message, registeredAt | `event` → Event, `volunteer` → User |

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- npm or yarn
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/NGO-Volunteer-Hub.git
cd NGO-Volunteer-Hub
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Seed the database (optional)
npm run seed

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm start
```

### Environment Variables

**Backend (.env)**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ngo_volunteer_hub
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🚀 Deployment Guide

### Deploy Backend to Render (Free)

1. Go to [render.com](https://render.com) and sign up
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `ngo-volunteer-hub-api`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add Environment Variables in Render dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRE`
   - `FRONTEND_URL` (your Vercel URL)
   - `NODE_ENV=production`
6. Click **Create Web Service**

### Deploy Frontend to Vercel (Free)

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
5. Add Environment Variables:
   - `REACT_APP_API_URL=https://your-render-app.onrender.com/api`
6. Click **Deploy**

---

## 🔑 Demo Accounts

After running the seed script:

| Role | Email | Password |
|------|-------|----------|
| NGO | ngo1@example.com | password123 |
| Volunteer | volunteer1@example.com | password123 |

---

## 🚀 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Events
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/events` | Public | Get all events |
| GET | `/api/events/:id` | Public | Get single event |
| POST | `/api/events` | NGO | Create event |
| PUT | `/api/events/:id` | NGO | Update event |
| DELETE | `/api/events/:id` | NGO | Delete event |

### Registrations
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/registrations` | Volunteer | Register for event |
| GET | `/api/registrations/myregistrations` | Volunteer | Get my registrations |
| PUT | `/api/registrations/:id` | NGO | Update status |
| DELETE | `/api/registrations/:id` | Volunteer | Cancel registration |

---

## 📸 Screenshots

| Home Page | Events Listing |
|-----------|----------------|
| ![Home](screenshots/home.png) | ![Events](screenshots/events.png) |

| NGO Dashboard | Volunteer Dashboard |
|---------------|---------------------|
| ![NGO](screenshots/ngo-dashboard.png) | ![Volunteer](screenshots/volunteer-dashboard.png) |

---

## 👥 Team Members

- **[Your Name]** - [Roll Number]
- **[Partner Name]** - [Roll Number]

---

## 📝 License

This project was created for academic purposes as part of the **Advanced Web Development (AWD)** course assignment.

---

<p align="center">Made with ❤️ for AWD Course</p>
