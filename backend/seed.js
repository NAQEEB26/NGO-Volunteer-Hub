const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Import models
const User = require('./models/User');
const Event = require('./models/Event');
const Registration = require('./models/Registration');

// Connect to database
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return true;
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        return false;
    }
};

// Sample data
const sampleNGOs = [
    {
        name: 'Green Earth Foundation',
        email: 'ngo1@example.com',
        password: 'password123',
        role: 'ngo',
        phone: '+92-300-1234567',
        organizationName: 'Green Earth Foundation',
        organizationDescription: 'Dedicated to environmental conservation and sustainability initiatives across Pakistan.'
    },
    {
        name: 'Hope for All Pakistan',
        email: 'ngo2@example.com',
        password: 'password123',
        role: 'ngo',
        phone: '+92-321-9876543',
        organizationName: 'Hope for All Pakistan',
        organizationDescription: 'Providing food, education, and healthcare to underprivileged communities.'
    }
];

const sampleVolunteers = [
    {
        name: 'Ahmed Khan',
        email: 'volunteer1@example.com',
        password: 'password123',
        role: 'volunteer',
        phone: '+92-333-1111111',
        skills: ['Teaching', 'First Aid', 'Photography'],
        availability: 'weekends'
    },
    {
        name: 'Sara Ali',
        email: 'volunteer2@example.com',
        password: 'password123',
        role: 'volunteer',
        phone: '+92-344-2222222',
        skills: ['Cooking', 'Event Management', 'Social Media'],
        availability: 'flexible'
    }
];

const createSampleEvents = (ngoId) => [
    {
        title: 'Beach Cleanup Drive - Clifton',
        description: 'Join us for a beach cleanup drive at Clifton Beach. We will collect trash, plastic waste, and help restore the natural beauty of our coastline. All cleaning materials will be provided. Bring your enthusiasm and a reusable water bottle!',
        eventType: 'beach-clean',
        location: {
            address: 'Clifton Beach, Near Do Darya',
            city: 'Karachi'
        },
        date: new Date('2025-01-15'),
        startTime: '07:00',
        endTime: '11:00',
        volunteersNeeded: 50,
        requirements: 'Wear comfortable clothes and shoes that can get wet. Sunscreen recommended.',
        status: 'upcoming',
        ngo: ngoId
    },
    {
        title: 'Food Distribution - Ramadan Drive',
        description: 'Help us distribute iftar meals and ration packages to families in need. We will be preparing and distributing food packets to over 500 families in the local area.',
        eventType: 'food-drive',
        location: {
            address: 'Saddar Town Community Center',
            city: 'Karachi'
        },
        date: new Date('2025-01-20'),
        startTime: '15:00',
        endTime: '19:00',
        volunteersNeeded: 30,
        requirements: 'Basic physical fitness for loading and carrying food packages.',
        status: 'upcoming',
        ngo: ngoId
    },
    {
        title: 'Tree Plantation Campaign',
        description: 'Be part of our annual tree plantation drive! We aim to plant 1000 trees in the city to combat climate change and improve air quality. Training will be provided on proper planting techniques.',
        eventType: 'tree-plantation',
        location: {
            address: 'Model Colony Park',
            city: 'Lahore'
        },
        date: new Date('2025-02-01'),
        startTime: '08:00',
        endTime: '12:00',
        volunteersNeeded: 100,
        requirements: 'Bring gardening gloves if you have them. Water will be provided.',
        status: 'upcoming',
        ngo: ngoId
    },
    {
        title: 'Free Health Camp',
        description: 'Volunteer at our free health camp providing basic medical checkups, blood pressure monitoring, and health awareness sessions to the community.',
        eventType: 'health-camp',
        location: {
            address: 'Government School Ground, Gulberg',
            city: 'Lahore'
        },
        date: new Date('2025-02-10'),
        startTime: '09:00',
        endTime: '16:00',
        volunteersNeeded: 25,
        requirements: 'Medical students and healthcare professionals preferred but not required.',
        status: 'upcoming',
        ngo: ngoId
    },
    {
        title: 'Education Workshop for Street Children',
        description: 'Help teach basic literacy and numeracy skills to street children. We provide all materials - you just need to bring patience and enthusiasm!',
        eventType: 'education',
        location: {
            address: 'Community Hall, F-7',
            city: 'Islamabad'
        },
        date: new Date('2025-01-25'),
        startTime: '10:00',
        endTime: '14:00',
        volunteersNeeded: 15,
        requirements: 'Basic teaching ability. Training provided.',
        status: 'upcoming',
        ngo: ngoId
    }
];

// Seed database
const seedDB = async () => {
    const connected = await connectDB();

    if (!connected) {
        console.log('Failed to connect to database. Please check your MONGODB_URI in .env file.');
        process.exit(1);
    }

    try {
        // Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Event.deleteMany({});
        await Registration.deleteMany({});

        // Create NGOs
        console.log('Creating NGO accounts...');
        const createdNGOs = [];
        for (const ngo of sampleNGOs) {
            const user = await User.create(ngo);
            createdNGOs.push(user);
            console.log(`  Created NGO: ${ngo.organizationName}`);
        }

        // Create Volunteers
        console.log('Creating Volunteer accounts...');
        const createdVolunteers = [];
        for (const volunteer of sampleVolunteers) {
            const user = await User.create(volunteer);
            createdVolunteers.push(user);
            console.log(`  Created Volunteer: ${volunteer.name}`);
        }

        // Create Events for first NGO
        console.log('Creating sample events...');
        const events = createSampleEvents(createdNGOs[0]._id);
        const createdEvents = [];
        for (const event of events) {
            const createdEvent = await Event.create(event);
            createdEvents.push(createdEvent);
            console.log(`  Created Event: ${event.title}`);
        }

        // Create some registrations
        console.log('Creating sample registrations...');
        const registration1 = await Registration.create({
            event: createdEvents[0]._id,
            volunteer: createdVolunteers[0]._id,
            status: 'approved',
            message: 'I am very excited to participate in this beach cleanup!'
        });
        console.log(`  Created Registration: ${createdVolunteers[0].name} -> ${createdEvents[0].title}`);

        const registration2 = await Registration.create({
            event: createdEvents[1]._id,
            volunteer: createdVolunteers[1]._id,
            status: 'pending',
            message: 'Looking forward to helping with food distribution.'
        });
        console.log(`  Created Registration: ${createdVolunteers[1].name} -> ${createdEvents[1].title}`);

        console.log('\n✅ Database seeded successfully!');
        console.log('\n--- Test Accounts ---');
        console.log('NGO Login:');
        console.log('  Email: ngo1@example.com');
        console.log('  Password: password123');
        console.log('\nVolunteer Login:');
        console.log('  Email: volunteer1@example.com');
        console.log('  Password: password123');
        console.log('\n--- Summary ---');
        console.log(`  NGOs created: ${createdNGOs.length}`);
        console.log(`  Volunteers created: ${createdVolunteers.length}`);
        console.log(`  Events created: ${createdEvents.length}`);
        console.log(`  Registrations created: 2`);

    } catch (error) {
        console.error('Error seeding database:', error);
    }

    process.exit();
};

// Run seeder
seedDB();
