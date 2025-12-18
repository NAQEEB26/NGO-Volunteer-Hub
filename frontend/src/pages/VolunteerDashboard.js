import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registrationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import Alert from '../components/Alert';

const VolunteerDashboard = () => {
    const { user } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchMyRegistrations();
    }, []);

    const fetchMyRegistrations = async () => {
        try {
            const res = await registrationsAPI.getMyRegistrations();
            setRegistrations(res.data.data);
        } catch (err) {
            setError('Failed to load registrations');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelRegistration = async (registrationId) => {
        if (!window.confirm('Are you sure you want to cancel this registration?')) return;

        try {
            await registrationsAPI.cancel(registrationId);
            setSuccess('Registration cancelled successfully');
            fetchMyRegistrations();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to cancel registration');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStats = () => {
        const pending = registrations.filter(r => r.status === 'pending').length;
        const approved = registrations.filter(r => r.status === 'approved').length;
        const attended = registrations.filter(r => r.status === 'attended').length;

        return { pending, approved, attended, total: registrations.length };
    };

    const stats = getStats();

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'badge-pending';
            case 'approved': return 'badge-approved';
            case 'rejected': return 'badge-rejected';
            case 'attended': return 'badge-approved';
            default: return '';
        }
    };

    if (loading) {
        return <Loading message="Loading dashboard..." />;
    }

    return (
        <div className="main-content">
            <div className="container dashboard">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Volunteer Dashboard</h1>
                        <p className="text-muted">Welcome back, {user?.name}!</p>
                    </div>
                    <Link to="/events" className="btn btn-primary">
                        Find Events
                    </Link>
                </div>

                {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

                {/* Stats Cards */}
                <div className="dashboard-stats">
                    <div className="dashboard-stat-card">
                        <div className="dashboard-stat-icon primary">📋</div>
                        <div className="dashboard-stat-info">
                            <h3>{stats.total}</h3>
                            <p>Total Registrations</p>
                        </div>
                    </div>
                    <div className="dashboard-stat-card">
                        <div className="dashboard-stat-icon accent">⏳</div>
                        <div className="dashboard-stat-info">
                            <h3>{stats.pending}</h3>
                            <p>Pending Approval</p>
                        </div>
                    </div>
                    <div className="dashboard-stat-card">
                        <div className="dashboard-stat-icon secondary">✅</div>
                        <div className="dashboard-stat-info">
                            <h3>{stats.approved}</h3>
                            <p>Approved</p>
                        </div>
                    </div>
                </div>

                {/* Profile Summary */}
                <div className="card mb-8">
                    <div className="card-header">
                        <h3 style={{ fontWeight: 600, margin: 0 }}>Your Profile</h3>
                    </div>
                    <div className="card-body">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            <div>
                                <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Name</p>
                                <p style={{ fontWeight: 500 }}>{user?.name}</p>
                            </div>
                            <div>
                                <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Email</p>
                                <p style={{ fontWeight: 500 }}>{user?.email}</p>
                            </div>
                            <div>
                                <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Phone</p>
                                <p style={{ fontWeight: 500 }}>{user?.phone || 'Not provided'}</p>
                            </div>
                            <div>
                                <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Availability</p>
                                <p style={{ fontWeight: 500, textTransform: 'capitalize' }}>{user?.availability || 'Flexible'}</p>
                            </div>
                            {user?.skills?.length > 0 && (
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Skills</p>
                                    <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                                        {user.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="badge"
                                                style={{ background: 'var(--primary-100)', color: 'var(--primary-700)' }}
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Registrations */}
                <h2 style={{ marginBottom: '1rem', fontWeight: 600 }}>Your Registrations</h2>
                {registrations.length > 0 ? (
                    <div className="events-grid">
                        {registrations.map(registration => (
                            <div key={registration._id} className="card">
                                <div className="card-body">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className={`badge ${getStatusColor(registration.status)}`}>
                                            {registration.status}
                                        </span>
                                        {registration.event?.status && (
                                            <span className={`badge badge-${registration.event.status}`} style={{ fontSize: '0.7rem' }}>
                                                Event: {registration.event.status}
                                            </span>
                                        )}
                                    </div>

                                    <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                                        {registration.event?.title || 'Event Unavailable'}
                                    </h3>

                                    {registration.event?.ngo && (
                                        <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                                            by {registration.event.ngo.organizationName}
                                        </p>
                                    )}

                                    {registration.event && (
                                        <div className="event-meta">
                                            <div className="event-meta-item">
                                                <span className="event-meta-icon">📅</span>
                                                <span>{formatDate(registration.event.date)}</span>
                                            </div>
                                            <div className="event-meta-item">
                                                <span className="event-meta-icon">⏰</span>
                                                <span>{registration.event.startTime} - {registration.event.endTime}</span>
                                            </div>
                                            <div className="event-meta-item">
                                                <span className="event-meta-icon">📍</span>
                                                <span>{registration.event.location?.city}</span>
                                            </div>
                                        </div>
                                    )}

                                    <p className="text-muted mt-4" style={{ fontSize: '0.8rem' }}>
                                        Registered on {formatDate(registration.registeredAt)}
                                    </p>
                                </div>
                                <div className="card-footer flex justify-between">
                                    {registration.event && (
                                        <Link to={`/events/${registration.event._id}`} className="btn btn-outline btn-sm">
                                            View Event
                                        </Link>
                                    )}
                                    {registration.status === 'pending' && registration.event?.status === 'upcoming' && (
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleCancelRegistration(registration._id)}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">📋</div>
                        <h3 className="empty-state-title">No Registrations Yet</h3>
                        <p>Start volunteering by signing up for events!</p>
                        <Link to="/events" className="btn btn-primary mt-4">
                            Browse Events
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VolunteerDashboard;
