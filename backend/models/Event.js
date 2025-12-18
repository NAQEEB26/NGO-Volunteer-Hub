const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    eventType: {
        type: String,
        required: [true, 'Please specify event type'],
        enum: ['beach-clean', 'food-drive', 'tree-plantation', 'education', 'health-camp', 'animal-welfare', 'other']
    },
    location: {
        address: {
            type: String,
            required: [true, 'Please add an address']
        },
        city: {
            type: String,
            required: [true, 'Please add a city']
        }
    },
    date: {
        type: Date,
        required: [true, 'Please add event date']
    },
    startTime: {
        type: String,
        required: [true, 'Please add start time']
    },
    endTime: {
        type: String,
        required: [true, 'Please add end time']
    },
    volunteersNeeded: {
        type: Number,
        required: [true, 'Please specify number of volunteers needed'],
        min: [1, 'At least 1 volunteer is required']
    },
    requirements: {
        type: String,
        maxlength: [500, 'Requirements cannot be more than 500 characters']
    },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    // Relationship: Event belongs to an NGO (User with role 'ngo')
    ngo: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for getting registrations count
EventSchema.virtual('registrations', {
    ref: 'Registration',
    localField: '_id',
    foreignField: 'event',
    justOne: false
});

module.exports = mongoose.model('Event', EventSchema);
