import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import EventCard from '../components/EventCard';
import Loading from '../components/Loading';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalEvents: 0,
        upcomingEvents: 0,
        completedEvents: 0
    });

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await eventsAPI.getAll({ status: 'upcoming' });
                const allEvents = res.data.data;
                setEvents(allEvents.slice(0, 6)); // Show only first 6 on home

                // Calculate stats
                setStats({
                    totalEvents: allEvents.length + 50, // Adding some history for display
                    upcomingEvents: allEvents.length,
                    completedEvents: 50
                });
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Make a Difference in Your Community
                    </h1>
                    <p className="hero-subtitle">
                        Connect with local NGOs and volunteer for meaningful causes.
                        From beach cleanups to food drives, find opportunities that match your passion.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/register" className="btn btn-secondary btn-lg">
                            Become a Volunteer
                        </Link>
                        <Link to="/events" className="btn btn-outline btn-lg" style={{ color: 'white', borderColor: 'white' }}>
                            Browse Events
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stats-grid">
                    <div className="stat-item">
                        <div className="stat-value">{stats.totalEvents}+</div>
                        <div className="stat-label">Events Organized</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">500+</div>
                        <div className="stat-label">Active Volunteers</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">25+</div>
                        <div className="stat-label">Partner NGOs</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">10+</div>
                        <div className="stat-label">Cities Covered</div>
                    </div>
                </div>
            </section>

            {/* Featured Events Section */}
            <section className="main-content">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Upcoming Events</h2>
                        <p className="section-subtitle">
                            Join these upcoming volunteer opportunities and make an impact
                        </p>
                    </div>

                    {loading ? (
                        <Loading message="Loading events..." />
                    ) : events.length > 0 ? (
                        <>
                            <div className="events-grid">
                                {events.map(event => (
                                    <EventCard key={event._id} event={event} />
                                ))}
                            </div>
                            <div className="text-center mt-8">
                                <Link to="/events" className="btn btn-primary btn-lg">
                                    View All Events
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">📅</div>
                            <h3 className="empty-state-title">No Upcoming Events</h3>
                            <p>Check back soon for new volunteer opportunities!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* How It Works Section */}
            <section className="main-content" style={{ background: 'white' }}>
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">How It Works</h2>
                        <p className="section-subtitle">
                            Getting started is easy - just follow these simple steps
                        </p>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-item">
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Sign Up</h3>
                            <p className="text-muted">Create your volunteer or NGO account in minutes</p>
                        </div>
                        <div className="stat-item">
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Find Events</h3>
                            <p className="text-muted">Browse events that match your interests and schedule</p>
                        </div>
                        <div className="stat-item">
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Register</h3>
                            <p className="text-muted">Sign up for events with a single click</p>
                        </div>
                        <div className="stat-item">
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌟</div>
                            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Make Impact</h3>
                            <p className="text-muted">Participate and make a difference in your community</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="hero" style={{ padding: '4rem 1.5rem' }}>
                <div className="hero-content">
                    <h2 className="hero-title" style={{ fontSize: '2rem' }}>
                        Ready to Make a Difference?
                    </h2>
                    <p className="hero-subtitle">
                        Join our community of volunteers and NGOs today!
                    </p>
                    <div className="hero-buttons">
                        <Link to="/register" className="btn btn-secondary btn-lg">
                            Get Started
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
