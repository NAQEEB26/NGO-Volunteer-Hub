# NGO Volunteer Hub

A full-stack MERN (MongoDB, Express, React, Node.js) web application that connects NGOs with volunteers. NGOs can post events (Beach cleanup, Food drive, Tree plantation, etc.) and volunteers can sign up to participate in these events.

## 📋 Project Overview

**Project Topic:** NGO Volunteer Hub (Category E: Social & Community)

This platform enables:
- **NGOs** to create and manage volunteer events
- **Volunteers** to browse and register for events
- Both parties to track event participation and status

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Vanilla CSS** - Styling

## 📁 Project Structure

```
NGO-volunteer/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Authentication logic
│   │   ├── eventController.js  # Event CRUD operations
│   │   └── registrationController.js # Registration logic
│   ├── middleware/
│   │   ├── auth.js            # JWT verification & role authorization
│   │   └── error.js           # Global error handler
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Event.js           # Event schema
│   │   └── Registration.js    # Registration schema
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   ├── eventRoutes.js     # Event endpoints
│   │   └── registrationRoutes.js # Registration endpoints
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── server.js              # Main server file
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── Alert.js
        │   ├── EventCard.js
        │   ├── Loading.js
        │   ├── Navbar.js
        │   └── ProtectedRoute.js
        ├── context/
        │   └── AuthContext.js  # Authentication state
        ├── pages/
        │   ├── Home.js
        │   ├── Login.js
        │   ├── Register.js
        │   ├── Events.js
        │   ├── EventDetails.js
        │   ├── NGODashboard.js
        │   └── VolunteerDashboard.js
        ├── services/
        │   └── api.js          # Axios configuration
        ├── App.js
        ├── index.js
        └── index.css
```

## 🗃️ Database Schema

### Collections (3 Collections with Relationships)

1. **Users Collection**
   - Fields: name, email, password (hashed), role, phone, organizationName, skills, availability
   - Role: 'volunteer' or 'ngo'

2. **Events Collection**
   - Fields: title, description, eventType, location, date, time, volunteersNeeded, status
   - Relationship: `ngo` references User (NGO that created the event)

3. **Registrations Collection**
   - Fields: event, volunteer, status, message, registeredAt
   - Relationships: 
     - `event` references Event
     - `volunteer` references User

## 🔐 Authentication & Security

- **JWT-based authentication** with token expiry
- **Password hashing** using bcryptjs (salt rounds: 10)
- **Protected routes** - Dashboard pages require login
- **Role-based authorization** - NGO and Volunteer specific features

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (already created with defaults)
# Update MONGODB_URI if using different database

# Start development server
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### Environment Variables (backend/.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ngo_volunteer_hub
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
```

## 🚀 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/updatedetails | Update user profile |
| PUT | /api/auth/updatepassword | Update password |

### Events
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/events | Public | Get all events |
| GET | /api/events/:id | Public | Get single event |
| POST | /api/events | NGO | Create event |
| PUT | /api/events/:id | NGO | Update event |
| DELETE | /api/events/:id | NGO | Delete event |
| GET | /api/events/ngo/myevents | NGO | Get NGO's events |

### Registrations
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/registrations | Volunteer | Register for event |
| GET | /api/registrations/myregistrations | Volunteer | Get my registrations |
| GET | /api/registrations/event/:id | NGO | Get event registrations |
| PUT | /api/registrations/:id | NGO | Update registration status |
| DELETE | /api/registrations/:id | Volunteer | Cancel registration |

## 🎯 Features Implemented

### Core Requirements ✅
- [x] Authentication: Login/Signup with JWT
- [x] Password Hashing with bcryptjs
- [x] 3 MongoDB Collections with relationships
- [x] Full CRUD functionality
- [x] React Functional Components with Hooks
- [x] Protected Routes

### Additional Features
- [x] Role-based dashboards (NGO vs Volunteer)
- [x] Event filtering by status, type, city
- [x] Registration approval workflow
- [x] Responsive design
- [x] Modern UI with CSS animations

## 📸 Screenshots

*(Add screenshots of your running application here)*

1. Home Page
2. Registration Page (Role Selection)
3. Events Listing
4. Event Details
5. NGO Dashboard
6. Volunteer Dashboard

## 👥 Team Members

- [Your Name] - [Your Roll Number]
- [Partner Name] - [Partner Roll Number]

## 📝 License

This project was created for academic purposes as part of MERN Stack course assignment.
