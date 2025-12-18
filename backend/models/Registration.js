const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
    // Relationship: Registration belongs to an Event
    event: {
        type: mongoose.Schema.ObjectId,
        ref: 'Event',
        required: true
    },
    // Relationship: Registration belongs to a Volunteer (User with role 'volunteer')
    volunteer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'attended', 'no-show'],
        default: 'pending'
    },
    message: {
        type: String,
        maxlength: [500, 'Message cannot be more than 500 characters']
    },
    registeredAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent duplicate registrations (one user can register for an event only once)
RegistrationSchema.index({ event: 1, volunteer: 1 }, { unique: true });

// Update the updatedAt field before saving
RegistrationSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Registration', RegistrationSchema);
