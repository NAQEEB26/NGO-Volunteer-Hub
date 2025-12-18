import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event, showActions, onRegister, isRegistered }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
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
        if (event.registrations) {
            return Array.isArray(event.registrations) ? event.registrations.length : 0;
        }
        return 0;
    };

    return (
        <div className="card event-card">
            <div className="card-body">
                <div className="event-card-header">
                    <div>
                        <h3 className="event-title">{event.title}</h3>
                        <span className="event-type-badge">
                            {getEventTypeLabel(event.eventType)}
                        </span>
                    </div>
                    <span className={`badge badge-${event.status}`}>
                        {event.status}
                    </span>
                </div>

                <p className="event-description">{event.description}</p>

                <div className="event-meta">
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
                        <span>{event.location?.city}</span>
                    </div>
                    <div className="event-meta-item">
                        <span className="event-meta-icon">👥</span>
                        <span>{getRegistrationCount()} / {event.volunteersNeeded} volunteers</span>
                    </div>
                </div>

                {event.ngo && (
                    <div className="event-meta mt-4">
                        <div className="event-meta-item">
                            <span className="event-meta-icon">🏢</span>
                            <span>{event.ngo.organizationName || event.ngo.name}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="card-footer flex justify-between items-center">
                <Link to={`/events/${event._id}`} className="btn btn-outline btn-sm">
                    View Details
                </Link>

                {showActions && event.status === 'upcoming' && (
                    isRegistered ? (
                        <span className="badge badge-approved">Registered</span>
                    ) : (
                        <button
                            onClick={() => onRegister(event._id)}
                            className="btn btn-primary btn-sm"
                        >
                            Sign Up
                        </button>
                    )
                )}
            </div>
        </div>
    );
};

export default EventCard;
