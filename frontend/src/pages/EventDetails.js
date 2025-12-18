import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsAPI, registrationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import Alert from '../components/Alert';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [registering, setRegistering] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchEvent();
        if (isAuthenticated && user?.role === 'volunteer') {
            checkRegistration();
        }
    }, [id, isAuthenticated, user]);

    const fetchEvent = async () => {
        try {
            const res = await eventsAPI.getOne(id);
            setEvent(res.data.data);
        } catch (err) {
            setError('Failed to load event details');
        } finally {
            setLoading(false);
        }
    };

    const checkRegistration = async () => {
        try {
            const res = await registrationsAPI.getMyRegistrations();
            const registered = res.data.data.some(reg => reg.event?._id === id);
            setIsRegistered(registered);
        } catch (err) {
            console.error('Error checking registration:', err);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setRegistering(true);
        try {
            await registrationsAPI.register({ eventId: id, message });
            setSuccess('Successfully registered for the event!');
            setIsRegistered(true);
            setMessage('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to register');
        } finally {
            setRegistering(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getEventTypeLabel = (type) => {
        const labels = {
            'beach-clean': 'Beach Cleanup',
            'food-drive': 'Food Drive',
            'tree-plantation': 'Tree Plantation',
            'education': 'Education',
            'health-camp': 'Health Camp',
            'animal-welfare': 'Animal Welfare',
            'other': 'Other'
        };
        return labels[type] || type;
    };

    const getRegistrationCount = () => {
        if (event?.registrations) {
            return Array.isArray(event.registrations) ? event.registrations.length : 0;
        }
        return 0;
    };

    const getSpotsLeft = () => {
        return event?.volunteersNeeded - getRegistrationCount();
    };

    if (loading) {
        return <Loading message="Loading event details..." />;
    }

    if (!event) {
        return (
            <div className="main-content">
                <div className="container">
                    <div className="empty-state">
                        <div className="empty-state-icon">❌</div>
                        <h3 className="empty-state-title">Event Not Found</h3>
                        <p>The event you're looking for doesn't exist or has been removed.</p>
                        <button onClick={() => navigate('/events')} className="btn btn-primary mt-4">
                            Browse Events
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="main-content">
            <div className="container">
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-outline mb-6"
                >
                    ← Back
                </button>

                {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
                    {/* Event Details */}
                    <div className="card">
                        <div className="card-body">
                            <div className="flex justify-between items-center mb-4">
                                <span className="event-type-badge" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                                    {getEventTypeLabel(event.eventType)}
                                </span>
                                <span className={`badge badge-${event.status}`}>
                                    {event.status}
                                </span>
                            </div>

                            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
                                {event.title}
                            </h1>

                            <div className="event-meta mb-6" style={{ fontSize: '1rem' }}>
                                <div className="event-meta-item">
                                    <span className="event-meta-icon">📅</span>
                                    <span>{formatDate(event.date)}</span>
                                </div>
                                <div className="event-meta-item">
                                    <span className="event-meta-icon">⏰</span>
                                    <span>{event.startTime} - {event.endTime}</span>
                                </div>
                                <div className="event-meta-item">
                                    <span className="event-meta-icon">📍</span>
                                    <span>{event.location?.address}, {event.location?.city}</span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Description</h3>
                                <p style={{ color: 'var(--gray-600)', lineHeight: 1.8 }}>
                                    {event.description}
                                </p>
                            </div>

                            {event.requirements && (
                                <div className="mb-6">
                                    <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Requirements</h3>
                                    <p style={{ color: 'var(--gray-600)' }}>
                                        {event.requirements}
                                    </p>
                                </div>
                            )}

                            {/* Organizer Info */}
                            {event.ngo && (
                                <div className="card" style={{ background: 'var(--gray-50)' }}>
                                    <div className="card-body">
                                        <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Organized By</h3>
                                        <div className="flex items-center gap-4">
                                            <div style={{
                                                width: '60px',
                                                height: '60px',
                                                background: 'var(--primary-100)',
                                                borderRadius: 'var(--radius-lg)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.5rem'
                                            }}>
                                                🏢
                                            </div>
                                            <div>
                                                <h4 style={{ fontWeight: 600 }}>{event.ngo.organizationName || event.ngo.name}</h4>
                                                {event.ngo.organizationDescription && (
                                                    <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
                                                        {event.ngo.organizationDescription}
                                                    </p>
                                                )}
                                                <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                                                    {event.ngo.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Registration Sidebar */}
                    <div>
                        <div className="card" style={{ position: 'sticky', top: '100px' }}>
                            <div className="card-body">
                                <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Volunteer Spots</h3>

                                <div style={{
                                    background: 'var(--gray-100)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '1.5rem',
                                    textAlign: 'center',
                                    marginBottom: '1.5rem'
                                }}>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary-600)' }}>
                                        {getSpotsLeft()}
                                    </div>
                                    <div style={{ color: 'var(--gray-600)' }}>
                                        spots left out of {event.volunteersNeeded}
                                    </div>
                                </div>

                                <div style={{
                                    width: '100%',
                                    height: '8px',
                                    background: 'var(--gray-200)',
                                    borderRadius: 'var(--radius-full)',
                                    marginBottom: '1.5rem',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${(getRegistrationCount() / event.volunteersNeeded) * 100}%`,
                                        height: '100%',
                                        background: 'linear-gradient(90deg, var(--primary-500), var(--secondary-500))',
                                        borderRadius: 'var(--radius-full)',
                                        transition: 'width 0.3s ease'
                                    }}></div>
                                </div>

                                {event.status !== 'upcoming' ? (
                                    <div className="alert alert-warning">
                                        This event is no longer accepting registrations.
                                    </div>
                                ) : isRegistered ? (
                                    <div className="alert alert-success">
                                        ✓ You are registered for this event!
                                    </div>
                                ) : user?.role === 'ngo' ? (
                                    <div className="alert alert-info">
                                        NGO accounts cannot register as volunteers.
                                    </div>
                                ) : getSpotsLeft() <= 0 ? (
                                    <div className="alert alert-warning">
                                        This event is fully booked.
                                    </div>
                                ) : (
                                    <form onSubmit={handleRegister}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="message">
                                                Message (optional)
                                            </label>
                                            <textarea
                                                id="message"
                                                className="form-control"
                                                placeholder="Tell the organizer why you want to volunteer..."
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                rows="3"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-block btn-lg"
                                            disabled={registering}
                                        >
                                            {registering ? 'Registering...' : 'Sign Up to Volunteer'}
                                        </button>
                                    </form>
                                )}

                                {!isAuthenticated && event.status === 'upcoming' && (
                                    <p className="text-center mt-4 text-muted">
                                        <a href="/login">Sign in</a> to register for this event
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
