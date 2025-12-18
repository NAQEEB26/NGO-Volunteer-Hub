const express = require('express');
const {
    createRegistration,
    getEventRegistrations,
    getMyRegistrations,
    updateRegistrationStatus,
    cancelRegistration
} = require('../controllers/registrationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Volunteer routes
router.post('/', protect, authorize('volunteer'), createRegistration);
router.get('/myregistrations', protect, authorize('volunteer'), getMyRegistrations);
router.delete('/:id', protect, authorize('volunteer'), cancelRegistration);

// NGO routes
router.get('/event/:eventId', protect, authorize('ngo'), getEventRegistrations);
router.put('/:id', protect, authorize('ngo'), updateRegistrationStatus);

module.exports = router;
