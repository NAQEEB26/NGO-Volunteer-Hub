import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <span className="navbar-brand-icon">🤝</span>
                    <span>NGO Volunteer Hub</span>
                </Link>

                <ul className="navbar-nav">
                    <li>
                        <Link to="/events" className="nav-link">
                            Browse Events
                        </Link>
                    </li>

                    {isAuthenticated ? (
                        <>
                            <li>
                                <Link
                                    to={user?.role === 'ngo' ? '/ngo/dashboard' : '/volunteer/dashboard'}
                                    className="nav-link"
                                >
                                    Dashboard
                                </Link>
                            </li>

                            <li className="user-menu">
                                <div className="user-info">
                                    <span className="user-name">{user?.name}</span>
                                    <span className="user-role">{user?.role}</span>
                                </div>
                                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/login" className="nav-link">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="btn btn-secondary btn-sm">
                                    Sign Up
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
