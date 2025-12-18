import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <span className="navbar-brand-icon">🤝</span>
                    <span>NGO Volunteer Hub</span>
                </Link>

                {/* Mobile Menu Button */}
                <button 
                    className={`mobile-menu-btn ${isMenuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                    aria-expanded={isMenuOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <ul className={`navbar-nav ${isMenuOpen ? 'open' : ''}`}>
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
                                <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ borderColor: 'rgba(255,255,255,0.6)', color: 'white' }}>
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
