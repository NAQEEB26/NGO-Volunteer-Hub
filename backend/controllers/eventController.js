const Event = require('../models/Event');
const Registration = require('../models/Registration');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res, next) => {
    try {
        // Build query with filters
        let query = {};

        // Filter by status
        if (req.query.status) {
            query.status = req.query.status;
        }

        // Filter by event type
        if (req.query.eventType) {
            query.eventType = req.query.eventType;
        }

        // Filter by city
        if (req.query.city) {
            query['location.city'] = { $regex: req.query.city, $options: 'i' };
        }

        const events = await Event.find(query)
            .populate('ngo', 'name organizationName email')
            .populate('registrations')
            .sort({ date: 1 });

        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('ngo', 'name organizationName organizationDescription email phone')
            .populate('registrations');

        if (!event) {
            return res.status(404).json({
                success: false,
                error: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (NGO only)
exports.createEvent = async (req, res, next) => {
    try {
        // Add NGO to req.body
        req.body.ngo = req.user.id;

        const event = await Event.create(req.body);

        res.status(201).json({
            success: true,
            data: event
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (NGO owner only)
exports.updateEvent = async (req, res, next) => {
    try {
        let event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                error: 'Event not found'
            });
        }

        // Make sure user is event owner
        if (event.ngo.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to update this event'
            });
        }

        event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (NGO owner only)
exports.deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                error: 'Event not found'
            });
        }

        // Make sure user is event owner
        if (event.ngo.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to delete this event'
            });
        }

        // Delete all registrations for this event
        await Registration.deleteMany({ event: req.params.id });

        await event.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get events created by logged in NGO
// @route   GET /api/events/myevents
// @access  Private (NGO only)
exports.getMyEvents = async (req, res, next) => {
    try {
        const events = await Event.find({ ngo: req.user.id })
            .populate('registrations')
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};
