const express = require('express');
const {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    getMyEvents
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEvent);

// Protected routes (NGO only)
router.post('/', protect, authorize('ngo'), createEvent);
router.put('/:id', protect, authorize('ngo'), updateEvent);
router.delete('/:id', protect, authorize('ngo'), deleteEvent);
router.get('/ngo/myevents', protect, authorize('ngo'), getMyEvents);

module.exports = router;
