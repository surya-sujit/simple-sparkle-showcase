
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Admin = require('./models/Admin');
const Moderator = require('./models/Moderator');
const Worker = require('./models/Worker');
const Hotel = require('./models/Hotel');
const Room = require('./models/Room');
const Booking = require('./models/Booking');

// Load env vars
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Sample users
const users = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'password123',
    country: 'United States',
    city: 'New York',
    phone: '+1234567890',
  },
  {
    username: 'moderator',
    email: 'mod@example.com',
    password: 'password123',
    country: 'United Kingdom',
    city: 'London',
    phone: '+9876543210',
  },
  {
    username: 'worker',
    email: 'worker@example.com',
    password: 'password123',
    country: 'Canada',
    city: 'Toronto',
    phone: '+1122334455',
  },
  {
    username: 'user',
    email: 'user@example.com',
    password: 'password123',
    country: 'Canada',
    city: 'Toronto',
    phone: '+1122334455',
  },
  {
    username: 'moderator2',
    email: 'mod2@example.com',
    password: 'password123',
    country: 'France',
    city: 'Paris',
    phone: '+3344556677',
  },
];

// Sample hotels
const hotels = [
  {
    name: 'Grand Plaza Hotel',
    type: 'Hotel',
    city: 'New York',
    address: '123 Broadway Ave',
    distance: '500m from city center',
    photos: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3',
    ],
    title: 'Experience luxury in the heart of Manhattan',
    desc: 'The Grand Plaza Hotel offers luxurious accommodations with stunning views of the New York skyline. Located in the heart of Manhattan, guests are just steps away from famous attractions, shopping, and dining.',
    rating: 4.8,
    cheapestPrice: 299,
    featured: true,
  },
  {
    name: 'Seaside Resort & Spa',
    type: 'Resort',
    city: 'Miami',
    address: '789 Ocean Drive',
    distance: '50m from beach',
    photos: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3',
    ],
    title: 'Beachfront paradise with world-class amenities',
    desc: 'Escape to our beachfront resort featuring pristine beaches, multiple pools, and a full-service spa. Enjoy spacious rooms with private balconies overlooking the ocean.',
    rating: 4.6,
    cheapestPrice: 399,
    featured: true,
  },
  {
    name: 'Urban Loft Apartments',
    type: 'Apartment',
    city: 'San Francisco',
    address: '456 Market St',
    distance: '1.2km from city center',
    photos: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1630699144867-37acec97df5a?ixlib=rb-4.0.3',
    ],
    title: 'Modern loft living in downtown San Francisco',
    desc: 'These stylish loft apartments offer modern amenities and convenience in the heart of San Francisco. Each unit features a fully equipped kitchen, high ceilings, and contemporary furnishings.',
    rating: 4.3,
    cheapestPrice: 249,
    featured: false,
  },
  {
    name: 'Mountain View Cabins',
    type: 'Cabin',
    city: 'Aspen',
    address: '101 Pine Road',
    distance: '3km from city center',
    photos: [
      'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3',
    ],
    title: 'Cozy cabins with breathtaking mountain views',
    desc: 'Our rustic cabins offer a perfect mountain retreat with stunning views, wood-burning fireplaces, and access to hiking trails. Ideal for nature lovers and outdoor enthusiasts.',
    rating: 4.7,
    cheapestPrice: 329,
    featured: true,
  },
];

// Sample room templates
const createRooms = (hotelId) => [
  {
    title: 'Deluxe King Room',
    hotelId,
    price: 299,
    maxPeople: 2,
    desc: 'Spacious room with a king-sized bed, luxury linens, and a marble bathroom with a deep soaking tub.',
    roomNumbers: [
      { number: 101, unavailableDates: [] },
      { number: 102, unavailableDates: [] },
      { number: 103, unavailableDates: [] },
    ],
  },
  {
    title: 'Double Queen Suite',
    hotelId,
    price: 349,
    maxPeople: 4,
    desc: 'Perfect for families, this suite features two queen beds, a separate living area, and views of the city.',
    roomNumbers: [
      { number: 201, unavailableDates: [] },
      { number: 202, unavailableDates: [] },
    ],
  },
  {
    title: 'Executive Suite',
    hotelId,
    price: 499,
    maxPeople: 2,
    desc: 'Our most luxurious accommodation with a king bed, separate living room, kitchenette, and premium amenities.',
    roomNumbers: [
      { number: 301, unavailableDates: [] },
    ],
  },
];

// Sample worker templates
const createWorkers = (userId, hotelId) => [
  {
    name: 'John Cleaner',
    userId,
    hotelId,
    role: 'Housekeeper',
    email: 'cleaner@example.com',
    phone: '+1122334455',
    isActive: true,
  },
  {
    name: 'Sarah Receptionist',
    userId,
    hotelId,
    role: 'Receptionist',
    email: 'receptionist@example.com',
    phone: '+2233445566',
    isActive: true,
  },
];

// Seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Admin.deleteMany();
    await Moderator.deleteMany();
    await Worker.deleteMany();
    await Hotel.deleteMany();
    await Room.deleteMany();
    await Booking.deleteMany();

    console.log('Database cleared');

    // Create users
    const createdUsers = [];
    for (const user of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      
      const newUser = await User.create({
        ...user,
        password: hashedPassword,
      });
      
      createdUsers.push(newUser);
    }
    
    console.log('Demo users created');

    // Create admin (first user)
    const admin = await Admin.create({
      userId: createdUsers[0]._id,
      superAdmin: true,
      permissions: {
        manageUsers: true,
        manageHotels: true,
        manageModerators: true,
        viewReports: true
      }
    });
    
    console.log('Admin created');

    // Create hotels
    const createdHotels = [];
    for (const hotel of hotels) {
      const newHotel = await Hotel.create(hotel);
      createdHotels.push(newHotel);
    }
    
    console.log('Hotels created');
    
    // Create moderators (assign second user to first two hotels)
    const moderator1 = await Moderator.create({
      userId: createdUsers[1]._id,
      assignedHotels: [createdHotels[0]._id, createdHotels[1]._id],
      isActive: true,
      permissions: {
        canManageWorkers: true,
        canManageRooms: true,
        canViewBookings: true
      }
    });
    
    // Create second moderator (assign fifth user to second two hotels)
    const moderator2 = await Moderator.create({
      userId: createdUsers[4]._id,
      assignedHotels: [createdHotels[2]._id, createdHotels[3]._id],
      isActive: true,
      permissions: {
        canManageWorkers: true,
        canManageRooms: true,
        canViewBookings: true
      }
    });
    
    console.log('Moderators created');

    // Create rooms for each hotel
    const createdRooms = [];
    for (const hotel of createdHotels) {
      const roomTemplates = createRooms(hotel._id);
      
      for (const roomTemplate of roomTemplates) {
        const newRoom = await Room.create(roomTemplate);
        createdRooms.push(newRoom);
      }
    }
    
    console.log('Rooms created');
    
    // Create workers (assign third user as a worker for first hotel)
    const workerTemplates = createWorkers(createdUsers[2]._id, createdHotels[0]._id);
    
    const createdWorkers = [];
    for (const workerTemplate of workerTemplates) {
      const newWorker = await Worker.create(workerTemplate);
      createdWorkers.push(newWorker);
    }
    
    console.log('Workers created');
    
    // Create sample bookings
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const twoWeeks = new Date(now);
    twoWeeks.setDate(twoWeeks.getDate() + 14);
    
    // Create a booking for the regular user
    const booking1 = await Booking.create({
      userId: createdUsers[3]._id, // Regular user
      hotelId: createdHotels[0]._id,
      roomId: createdRooms[0]._id,
      roomNumber: 101,
      dateStart: tomorrow,
      dateEnd: nextWeek,
      totalPrice: 299 * 7, // 7 days at base price
      status: 'confirmed',
      guestCount: 2
    });
    
    // Create another booking for the regular user
    const booking2 = await Booking.create({
      userId: createdUsers[3]._id, // Regular user
      hotelId: createdHotels[1]._id,
      roomId: createdRooms[3]._id, // Room from second hotel
      roomNumber: 201,
      dateStart: nextWeek,
      dateEnd: twoWeeks,
      totalPrice: 349 * 7, // 7 days at base price
      status: 'active',
      guestCount: 3
    });
    
    console.log('Bookings created');
    
    // Assign a room to a worker for cleaning
    const worker = createdWorkers[0]; // First worker
    worker.assignedRooms.push({
      roomId: createdRooms[1]._id, // Assign second room
      assignedBy: moderator1._id,
      assignedAt: new Date(),
      status: 'pending'
    });
    
    await worker.save();
    
    // Mark the room as needing cleaning
    const room = await Room.findById(createdRooms[1]._id);
    room.needsCleaning = true;
    room.isCleaned = false;
    await room.save();
    
    console.log('Worker assigned to room for cleaning');
    
    console.log('Database seeded successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
