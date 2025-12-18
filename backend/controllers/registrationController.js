const Registration = require('../models/Registration');
const Event = require('../models/Event');

// @desc    Register for an event (Volunteer)
// @route   POST /api/registrations
// @access  Private (Volunteer only)
exports.createRegistration = async (req, res, next) => {
    try {
        const { eventId, message } = req.body;

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                error: 'Event not found'
            });
        }

        // Check if event is still upcoming
        if (event.status !== 'upcoming') {
            return res.status(400).json({
                success: false,
                error: 'Cannot register for this event'
            });
        }

        // Check if already registered
        const existingRegistration = await Registration.findOne({
            event: eventId,
            volunteer: req.user.id
        });

        if (existingRegistration) {
            return res.status(400).json({
                success: false,
                error: 'You have already registered for this event'
            });
        }

        // Check if spots are available
        const registrationCount = await Registration.countDocuments({
            event: eventId,
            status: { $in: ['pending', 'approved'] }
        });

        if (registrationCount >= event.volunteersNeeded) {
            return res.status(400).json({
                success: false,
                error: 'No spots available for this event'
            });
        }

        const registration = await Registration.create({
            event: eventId,
            volunteer: req.user.id,
            message
        });

        res.status(201).json({
            success: true,
            data: registration
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get all registrations for an event (NGO)
// @route   GET /api/registrations/event/:eventId
// @access  Private (NGO owner only)
exports.getEventRegistrations = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                error: 'Event not found'
            });
        }

        // Check if user is the NGO owner
        if (event.ngo.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to view these registrations'
            });
        }

        const registrations = await Registration.find({ event: req.params.eventId })
            .populate('volunteer', 'name email phone skills availability');

        res.status(200).json({
            success: true,
            count: registrations.length,
            data: registrations
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get my registrations (Volunteer)
// @route   GET /api/registrations/myregistrations
// @access  Private (Volunteer only)
exports.getMyRegistrations = async (req, res, next) => {
    try {
        const registrations = await Registration.find({ volunteer: req.user.id })
            .populate({
                path: 'event',
                select: 'title description date startTime endTime location eventType status',
                populate: {
                    path: 'ngo',
                    select: 'organizationName'
                }
            })
            .sort({ registeredAt: -1 });

        res.status(200).json({
            success: true,
            count: registrations.length,
            data: registrations
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Update registration status (NGO)
// @route   PUT /api/registrations/:id
// @access  Private (NGO owner only)
exports.updateRegistrationStatus = async (req, res, next) => {
    try {
        let registration = await Registration.findById(req.params.id);

        if (!registration) {
            return res.status(404).json({
                success: false,
                error: 'Registration not found'
            });
        }

        // Get the event to check ownership
        const event = await Event.findById(registration.event);

        if (event.ngo.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to update this registration'
            });
        }

        registration = await Registration.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true, runValidators: true }
        ).populate('volunteer', 'name email phone skills');

        res.status(200).json({
            success: true,
            data: registration
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Cancel registration (Volunteer)
// @route   DELETE /api/registrations/:id
// @access  Private (Volunteer only)
exports.cancelRegistration = async (req, res, next) => {
    try {
        const registration = await Registration.findById(req.params.id);

        if (!registration) {
            return res.status(404).json({
                success: false,
                error: 'Registration not found'
            });
        }

        // Check if user is the volunteer who registered
        if (registration.volunteer.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to cancel this registration'
            });
        }

        await registration.deleteOne();

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
