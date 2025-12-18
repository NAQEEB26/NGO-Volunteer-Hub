import React, { useState, useEffect } from 'react';
import { eventsAPI, registrationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import Loading from '../components/Loading';
import Alert from '../components/Alert';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [myRegistrations, setMyRegistrations] = useState([]);
    const [filters, setFilters] = useState({
        status: '',
        eventType: '',
        city: ''
    });

    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        fetchEvents();
        if (isAuthenticated && user?.role === 'volunteer') {
            fetchMyRegistrations();
        }
    }, [isAuthenticated, user]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const activeFilters = {};
            Object.keys(filters).forEach(key => {
                if (filters[key]) activeFilters[key] = filters[key];
            });

            const res = await eventsAPI.getAll(activeFilters);
            setEvents(res.data.data);
        } catch (err) {
            setError('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const fetchMyRegistrations = async () => {
        try {
            const res = await registrationsAPI.getMyRegistrations();
            setMyRegistrations(res.data.data.map(reg => reg.event?._id));
        } catch (err) {
            console.error('Error fetching registrations:', err);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const applyFilters = (e) => {
        e.preventDefault();
        fetchEvents();
    };

    const handleRegister = async (eventId) => {
        if (!isAuthenticated) {
            setError('Please login to register for events');
            return;
        }

        try {
            await registrationsAPI.register({ eventId });
            setSuccess('Successfully registered for the event!');
            setMyRegistrations([...myRegistrations, eventId]);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to register');
        }
    };

    const isRegistered = (eventId) => {
        return myRegistrations.includes(eventId);
    };

    return (
        <div className="main-content">
            <div className="container">
                <div className="section-header">
                    <h1 className="section-title">Volunteer Events</h1>
                    <p className="section-subtitle">
                        Find and join volunteer opportunities in your area
                    </p>
                </div>

                {/* Filters */}
                <div className="card mb-6">
                    <div className="card-body">
                        <form onSubmit={applyFilters}>
                            <div className="form-row">
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" htmlFor="status">Status</label>
                                    <select
                                        id="status"
                                        name="status"
                                        className="form-control form-select"
                                        value={filters.status}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="upcoming">Upcoming</option>
                                        <option value="ongoing">Ongoing</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>

                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" htmlFor="eventType">Event Type</label>
                                    <select
                                        id="eventType"
                                        name="eventType"
                                        className="form-control form-select"
                                        value={filters.eventType}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">All Types</option>
                                        <option value="beach-clean">Beach Cleanup</option>
                                        <option value="food-drive">Food Drive</option>
                                        <option value="tree-plantation">Tree Plantation</option>
                                        <option value="education">Education</option>
                                        <option value="health-camp">Health Camp</option>
                                        <option value="animal-welfare">Animal Welfare</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" htmlFor="city">City</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        className="form-control"
                                        placeholder="Search by city..."
                                        value={filters.city}
                                        onChange={handleFilterChange}
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: 0, display: 'flex', alignItems: 'flex-end' }}>
                                    <button type="submit" className="btn btn-primary">
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

                {loading ? (
                    <Loading message="Loading events..." />
                ) : events.length > 0 ? (
                    <div className="events-grid">
                        {events.map(event => (
                            <EventCard
                                key={event._id}
                                event={event}
                                showActions={isAuthenticated && user?.role === 'volunteer'}
                                onRegister={handleRegister}
                                isRegistered={isRegistered(event._id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">📅</div>
                        <h3 className="empty-state-title">No Events Found</h3>
                        <p>Try adjusting your filters or check back later for new events.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
