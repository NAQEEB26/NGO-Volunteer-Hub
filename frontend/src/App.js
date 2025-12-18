import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import NGODashboard from './pages/NGODashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';

// Styles
import './index.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app-container">
                    <Navbar />
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/events/:id" element={<EventDetails />} />

                        {/* Protected Routes - NGO Only */}
                        <Route
                            path="/ngo/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['ngo']}>
                                    <NGODashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Protected Routes - Volunteer Only */}
                        <Route
                            path="/volunteer/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['volunteer']}>
                                    <VolunteerDashboard />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
