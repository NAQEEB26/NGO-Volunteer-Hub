import React, { useState, useEffect } from 'react';
import { eventsAPI, registrationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import Alert from '../components/Alert';

const NGODashboard = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [editingEvent, setEditingEvent] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        eventType: 'food-drive',
        address: '',
        city: '',
        date: '',
        startTime: '',
        endTime: '',
        volunteersNeeded: '',
        requirements: ''
    });

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const fetchMyEvents = async () => {
        try {
            const res = await eventsAPI.getMyEvents();
            setEvents(res.data.data);
        } catch (err) {
            setError('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            eventType: 'food-drive',
            address: '',
            city: '',
            date: '',
            startTime: '',
            endTime: '',
            volunteersNeeded: '',
            requirements: ''
        });
        setEditingEvent(null);
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const eventData = {
                title: formData.title,
                description: formData.description,
                eventType: formData.eventType,
                location: {
                    address: formData.address,
                    city: formData.city
                },
                date: formData.date,
                startTime: formData.startTime,
                endTime: formData.endTime,
                volunteersNeeded: parseInt(formData.volunteersNeeded),
                requirements: formData.requirements
            };

            if (editingEvent) {
                await eventsAPI.update(editingEvent._id, eventData);
                setSuccess('Event updated successfully!');
            } else {
                await eventsAPI.create(eventData);
                setSuccess('Event created successfully!');
            }

            setShowCreateModal(false);
            resetForm();
            fetchMyEvents();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save event');
        }
    };

    const handleEditEvent = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            eventType: event.eventType,
            address: event.location?.address || '',
            city: event.location?.city || '',
            date: event.date.split('T')[0],
            startTime: event.startTime,
            endTime: event.endTime,
            volunteersNeeded: event.volunteersNeeded.toString(),
            requirements: event.requirements || ''
        });
        setShowCreateModal(true);
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;

        try {
            await eventsAPI.delete(eventId);
            setSuccess('Event deleted successfully!');
            fetchMyEvents();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete event');
        }
    };

    const handleViewRegistrations = async (event) => {
        setSelectedEvent(event);
        try {
            const res = await registrationsAPI.getEventRegistrations(event._id);
            setRegistrations(res.data.data);
            setShowRegistrationsModal(true);
        } catch (err) {
            setError('Failed to load registrations');
        }
    };

    const handleUpdateRegistrationStatus = async (registrationId, status) => {
        try {
            await registrationsAPI.updateStatus(registrationId, status);
            // Refresh registrations
            const res = await registrationsAPI.getEventRegistrations(selectedEvent._id);
            setRegistrations(res.data.data);
            setSuccess(`Registration ${status} successfully!`);
        } catch (err) {
            setError('Failed to update registration status');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStats = () => {
        const upcoming = events.filter(e => e.status === 'upcoming').length;
        const totalRegistrations = events.reduce((acc, e) => {
            return acc + (Array.isArray(e.registrations) ? e.registrations.length : 0);
        }, 0);
        const completed = events.filter(e => e.status === 'completed').length;

        return { upcoming, totalRegistrations, completed, total: events.length };
    };

    const stats = getStats();

    if (loading) {
        return <Loading message="Loading dashboard..." />;
    }

    return (
        <div className="main-content">
            <div className="container dashboard">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">NGO Dashboard</h1>
                        <p className="text-muted">Welcome back, {user?.organizationName || user?.name}!</p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            resetForm();
                            setShowCreateModal(true);
                        }}
                    >
                        + Create Event
                    </button>
                </div>

                {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

                {/* Stats Cards */}
                <div className="dashboard-stats">
                    <div className="dashboard-stat-card">
                        <div className="dashboard-stat-icon primary">📅</div>
                        <div className="dashboard-stat-info">
                            <h3>{stats.total}</h3>
                            <p>Total Events</p>
                        </div>
                    </div>
                    <div className="dashboard-stat-card">
                        <div className="dashboard-stat-icon secondary">🎯</div>
                        <div className="dashboard-stat-info">
                            <h3>{stats.upcoming}</h3>
                            <p>Upcoming Events</p>
                        </div>
                    </div>
                    <div className="dashboard-stat-card">
                        <div className="dashboard-stat-icon accent">👥</div>
                        <div className="dashboard-stat-info">
                            <h3>{stats.totalRegistrations}</h3>
                            <p>Total Registrations</p>
                        </div>
                    </div>
                </div>

                {/* Events Table */}
                <h2 style={{ marginBottom: '1rem', fontWeight: 600 }}>Your Events</h2>
                {events.length > 0 ? (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Event</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Registrations</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map(event => (
                                    <tr key={event._id}>
                                        <td>
                                            <div>
                                                <strong>{event.title}</strong>
                                                <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                                                    {event.location?.city}
                                                </div>
                                            </div>
                                        </td>
                                        <td>{formatDate(event.date)}</td>
                                        <td>
                                            <span className={`badge badge-${event.status}`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td>
                                            {Array.isArray(event.registrations) ? event.registrations.length : 0} / {event.volunteersNeeded}
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    className="btn btn-outline btn-sm"
                                                    onClick={() => handleViewRegistrations(event)}
                                                >
                                                    View
                                                </button>
                                                <button
                                                    className="btn btn-outline btn-sm"
                                                    onClick={() => handleEditEvent(event)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDeleteEvent(event._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">📅</div>
                        <h3 className="empty-state-title">No Events Yet</h3>
                        <p>Create your first event to start recruiting volunteers!</p>
                        <button
                            className="btn btn-primary mt-4"
                            onClick={() => setShowCreateModal(true)}
                        >
                            Create Event
                        </button>
                    </div>
                )}

                {/* Create/Edit Event Modal */}
                {showCreateModal && (
                    <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                        <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
                            <div className="modal-header">
                                <h2 className="modal-title">
                                    {editingEvent ? 'Edit Event' : 'Create New Event'}
                                </h2>
                                <button className="modal-close" onClick={() => setShowCreateModal(false)}>×</button>
                            </div>
                            <form onSubmit={handleCreateEvent}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="title">Event Title</label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            className="form-control"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="description">Description</label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            className="form-control"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows="4"
                                            required
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="eventType">Event Type</label>
                                            <select
                                                id="eventType"
                                                name="eventType"
                                                className="form-control form-select"
                                                value={formData.eventType}
                                                onChange={handleInputChange}
                                            >
                                                <option value="beach-clean">Beach Cleanup</option>
                                                <option value="food-drive">Food Drive</option>
                                                <option value="tree-plantation">Tree Plantation</option>
                                                <option value="education">Education</option>
                                                <option value="health-camp">Health Camp</option>
                                                <option value="animal-welfare">Animal Welfare</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label" htmlFor="volunteersNeeded">Volunteers Needed</label>
                                            <input
                                                type="number"
                                                id="volunteersNeeded"
                                                name="volunteersNeeded"
                                                className="form-control"
                                                value={formData.volunteersNeeded}
                                                onChange={handleInputChange}
                                                min="1"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="address">Address</label>
                                            <input
                                                type="text"
                                                id="address"
                                                name="address"
                                                className="form-control"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label" htmlFor="city">City</label>
                                            <input
                                                type="text"
                                                id="city"
                                                name="city"
                                                className="form-control"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="date">Date</label>
                                            <input
                                                type="date"
                                                id="date"
                                                name="date"
                                                className="form-control"
                                                value={formData.date}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label" htmlFor="startTime">Start Time</label>
                                            <input
                                                type="time"
                                                id="startTime"
                                                name="startTime"
                                                className="form-control"
                                                value={formData.startTime}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label" htmlFor="endTime">End Time</label>
                                            <input
                                                type="time"
                                                id="endTime"
                                                name="endTime"
                                                className="form-control"
                                                value={formData.endTime}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="requirements">Requirements (optional)</label>
                                        <textarea
                                            id="requirements"
                                            name="requirements"
                                            className="form-control"
                                            value={formData.requirements}
                                            onChange={handleInputChange}
                                            rows="2"
                                            placeholder="Any special requirements for volunteers..."
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline" onClick={() => setShowCreateModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingEvent ? 'Update Event' : 'Create Event'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Registrations Modal */}
                {showRegistrationsModal && (
                    <div className="modal-overlay" onClick={() => setShowRegistrationsModal(false)}>
                        <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                            <div className="modal-header">
                                <h2 className="modal-title">
                                    Registrations for "{selectedEvent?.title}"
                                </h2>
                                <button className="modal-close" onClick={() => setShowRegistrationsModal(false)}>×</button>
                            </div>
                            <div className="modal-body">
                                {registrations.length > 0 ? (
                                    <div className="table-container">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Volunteer</th>
                                                    <th>Email</th>
                                                    <th>Phone</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {registrations.map(reg => (
                                                    <tr key={reg._id}>
                                                        <td>
                                                            <strong>{reg.volunteer?.name}</strong>
                                                            {reg.volunteer?.skills?.length > 0 && (
                                                                <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                                                                    Skills: {reg.volunteer.skills.join(', ')}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>{reg.volunteer?.email}</td>
                                                        <td>{reg.volunteer?.phone || '-'}</td>
                                                        <td>
                                                            <span className={`badge badge-${reg.status}`}>
                                                                {reg.status}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {reg.status === 'pending' && (
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        className="btn btn-secondary btn-sm"
                                                                        onClick={() => handleUpdateRegistrationStatus(reg._id, 'approved')}
                                                                    >
                                                                        Approve
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-danger btn-sm"
                                                                        onClick={() => handleUpdateRegistrationStatus(reg._id, 'rejected')}
                                                                    >
                                                                        Reject
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="empty-state">
                                        <div className="empty-state-icon">👥</div>
                                        <h3 className="empty-state-title">No Registrations Yet</h3>
                                        <p>Share your event to get volunteers!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NGODashboard;
