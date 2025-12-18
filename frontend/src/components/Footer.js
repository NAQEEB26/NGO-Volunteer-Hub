import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div>
                    <div className="footer-brand">
                        <span>🤝</span>
                        <span>NGO Volunteer Hub</span>
                    </div>
                    <p className="footer-description">
                        Connecting NGOs with passionate volunteers to create 
                        meaningful change in communities across Pakistan.
                    </p>
                </div>

                <div>
                    <h4 className="footer-title">Quick Links</h4>
                    <div className="footer-links">
                        <Link to="/">Home</Link>
                        <Link to="/events">Browse Events</Link>
                        <Link to="/register">Become a Volunteer</Link>
                        <Link to="/login">Login</Link>
                    </div>
                </div>

                <div>
                    <h4 className="footer-title">Event Types</h4>
                    <div className="footer-links">
                        <Link to="/events?eventType=beach-clean">Beach Cleanup</Link>
                        <Link to="/events?eventType=food-drive">Food Drive</Link>
                        <Link to="/events?eventType=tree-plantation">Tree Plantation</Link>
                        <Link to="/events?eventType=education">Education</Link>
                    </div>
                </div>

                <div>
                    <h4 className="footer-title">Contact</h4>
                    <div className="footer-links">
                        <span>📍 Karachi, Pakistan</span>
                        <span>📧 info@ngovolunteerhub.pk</span>
                        <span>📞 +92 300 1234567</span>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© {currentYear} NGO Volunteer Hub. All rights reserved. | AWD Course Project</p>
            </div>
        </footer>
    );
};

export default Footer;
