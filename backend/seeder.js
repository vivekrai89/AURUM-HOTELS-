const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Room = require('./models/mongo/Room');

const cities = {
  Delhi: { name: 'New Delhi', address: 'Connaught Place, New Delhi 110001', lat: 28.6315, lng: 77.2167, landmarks: ['India Gate (3 km)', 'Red Fort (5 km)', 'Qutub Minar (12 km)'] },
  Mumbai: { name: 'Mumbai', address: 'Bandra West, Mumbai 400050', lat: 19.0596, lng: 72.8295, landmarks: ['Gateway of India (8 km)', 'Marine Drive (4 km)', 'Juhu Beach (2 km)'] },
  Goa: { name: 'Goa', address: 'Calangute Beach Road, North Goa 403516', lat: 15.5440, lng: 73.7552, landmarks: ['Calangute Beach (0.5 km)', 'Baga Beach (2 km)', 'Anjuna Flea Market (5 km)'] },
  Bangalore: { name: 'Bangalore', address: 'Indiranagar, Bengaluru 560038', lat: 12.9716, lng: 77.6412, landmarks: ['MG Road (4 km)', 'Cubbon Park (5 km)', 'Lalbagh (7 km)'] },
  Jaipur: { name: 'Jaipur', address: 'MI Road, Jaipur 302001', lat: 26.9124, lng: 75.7873, landmarks: ['Hawa Mahal (2 km)', 'Amber Fort (11 km)', 'City Palace (3 km)'] },
}

const rooms = [
  // Delhi
  {
    name: 'Classic Standard Room', type: 'Standard', city: 'Delhi', location: cities.Delhi,
    description: 'A cozy and well-furnished standard room perfect for solo travelers or couples on a budget. Features a comfortable queen bed, modern bathroom, and city view.',
    price: 2500, maxGuests: 2, size: 280, floor: 2,
    images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800','https://images.unsplash.com/photo-1631049421450-348ccd7f8949?w=800','https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800','https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800','https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'],
    amenities: ['Free WiFi', 'Air Conditioning', 'Flat Screen TV', 'Mini Fridge', 'Daily Housekeeping', 'Room Service'],
    features: { wifi: true, ac: true, tv: true, minibar: false, balcony: false, jacuzzi: false, pool: false, breakfast: false }, rating: 4.2
  },
  {
    name: 'Deluxe Garden View', type: 'Deluxe', city: 'Delhi', location: cities.Delhi,
    description: 'Spacious deluxe room with stunning garden views. Enjoy the lush greenery from your private balcony while relaxing in a king-size bed with premium linens.',
    price: 4500, maxGuests: 2, size: 380, floor: 3,
    images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800','https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800','https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800','https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800','https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=800'],
    amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Minibar', 'Balcony', 'Bathtub', 'Daily Housekeeping', 'Complimentary Breakfast'],
    features: { wifi: true, ac: true, tv: true, minibar: true, balcony: true, jacuzzi: false, pool: false, breakfast: true }, rating: 4.5
  },
  {
    name: 'Executive Suite', type: 'Suite', city: 'Delhi', location: cities.Delhi,
    description: 'Our Executive Suite offers the perfect blend of comfort and luxury. Featuring a separate living area, private dining space, and panoramic city views from the 8th floor.',
    price: 9500, maxGuests: 2, size: 650, floor: 8,
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800','https://images.unsplash.com/photo-1601565415267-724db0e1e4ca?w=800','https://images.unsplash.com/photo-1549294413-26f195200463?w=800','https://images.unsplash.com/photo-1605346434674-a440ca4dc4c0?w=800','https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'],
    amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Full Minibar', 'Balcony', 'Jacuzzi', 'Separate Living Room', 'Butler Service', 'Complimentary Breakfast', 'Airport Transfer'],
    features: { wifi: true, ac: true, tv: true, minibar: true, balcony: true, jacuzzi: true, pool: true, breakfast: true }, rating: 4.8
  },
  // Mumbai
  {
    name: 'Sea View Deluxe', type: 'Deluxe', city: 'Mumbai', location: cities.Mumbai,
    description: 'Wake up to the sound of waves in this stunning sea-facing deluxe room in the heart of Bandra. Premium linens, rainfall shower, and breathtaking Arabian Sea views.',
    price: 6500, maxGuests: 2, size: 420, floor: 5,
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800','https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800','https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800','https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800','https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800'],
    amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Minibar', 'Sea View Balcony', 'Rainfall Shower', 'Daily Housekeeping', 'Room Service'],
    features: { wifi: true, ac: true, tv: true, minibar: true, balcony: true, jacuzzi: false, pool: true, breakfast: false }, rating: 4.6
  },
  {
    name: 'Honeymoon Suite', type: 'Suite', city: 'Mumbai', location: cities.Mumbai,
    description: 'Designed for romance, our Honeymoon Suite features a four-poster king bed, private jacuzzi, rose petal turndown service, and a bottle of champagne on arrival.',
    price: 12000, maxGuests: 2, size: 720, floor: 9,
    images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800','https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800','https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800','https://images.unsplash.com/photo-1601565415267-724db0e1e4ca?w=800','https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'],
    amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Full Minibar', 'Private Balcony', 'Jacuzzi', 'Four-Poster Bed', 'Rose Petal Turndown', 'Champagne', 'Butler Service', 'Complimentary Breakfast'],
    features: { wifi: true, ac: true, tv: true, minibar: true, balcony: true, jacuzzi: true, pool: true, breakfast: true }, rating: 4.9
  },
  {
    name: 'Business Class Room', type: 'Deluxe', city: 'Mumbai', location: cities.Mumbai,
    description: 'Tailored for business travelers, this room features a large work desk, ergonomic chair, high-speed fiber WiFi, and 24-hour business center access.',
    price: 5000, maxGuests: 2, size: 400, floor: 5,
    images: ['https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800','https://images.unsplash.com/photo-1587985064135-0366536eab42?w=800','https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=800','https://images.unsplash.com/photo-1536300099515-6c61b290b654?w=800','https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800'],
    amenities: ['Free Fiber WiFi', 'Air Conditioning', 'Smart TV', 'Large Work Desk', 'Ergonomic Chair', 'Minibar', 'Daily Housekeeping', 'Express Laundry', 'Complimentary Breakfast'],
    features: { wifi: true, ac: true, tv: true, minibar: true, balcony: false, jacuzzi: false, pool: true, breakfast: true }, rating: 4.5
  },
  // Goa
  {
    name: 'Beachside Cottage Room', type: 'Standard', city: 'Goa', location: cities.Goa,
    description: 'Steps away from Calangute Beach, this charming cottage-style room offers a relaxed Goan vibe with a private sit-out, hammock, and direct beach access.',
    price: 3500, maxGuests: 2, size: 300, floor: 1,
    images: ['https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800','https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800','https://images.unsplash.com/photo-1531088009183-5ff5b7c95f91?w=800','https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800','https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800'],
    amenities: ['Free WiFi', 'Air Conditioning', 'Flat Screen TV', 'Private Sit-Out', 'Hammock', 'Beach Access', 'Daily Housekeeping', 'Room Service'],
    features: { wifi: true, ac: true, tv: true, minibar: false, balcony: true, jacuzzi: false, pool: true, breakfast: false }, rating: 4.4
  },
  {
    name: 'Pool Villa Suite', type: 'Suite', city: 'Goa', location: cities.Goa,
    description: 'Your own private pool in Goa! This stunning villa suite features a private plunge pool, open-air bathroom, sundeck, and lush tropical garden surroundings.',
    price: 15000, maxGuests: 3, size: 900, floor: 1,
    images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800','https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800','https://images.unsplash.com/photo-1549294413-26f195200463?w=800','https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800','https://images.unsplash.com/photo-1605346434674-a440ca4dc4c0?w=800'],
    amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Full Minibar', 'Private Pool', 'Open-Air Bathroom', 'Sundeck', 'Butler Service', 'Complimentary Breakfast', 'Airport Transfer'],
    features: { wifi: true, ac: true, tv: true, minibar: true, balcony: true, jacuzzi: true, pool: true, breakfast: true }, rating: 4.9
  },
  {
    name: 'Deluxe Garden Cottage', type: 'Deluxe', city: 'Goa', location: cities.Goa,
    description: 'Nestled in a lush tropical garden, this deluxe cottage offers peace and tranquility while being just minutes from Goa\'s finest beaches and restaurants.',
    price: 5500, maxGuests: 2, size: 380, floor: 1,
    images: ['https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=800','https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800','https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800','https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800','https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800'],
    amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Minibar', 'Garden Patio', 'Outdoor Shower', 'Pool Access', 'Daily Housekeeping', 'Complimentary Breakfast'],
    features: { wifi: true, ac: true, tv: true, minibar: true, balcony: true, jacuzzi: false, pool: true, breakfast: true }, rating: 4.6
  },
  // Bangalore
  {
    name: 'Urban Standard Room', type: 'Standard', city: 'Bangalore', location: cities.Bangalore,
    description: 'A smart, modern room in the heart of Indiranagar. Perfect for tech travelers with high-speed WiFi, smart controls, and walking distance to top restaurants and pubs.',
    price: 2800, maxGuests: 2, size: 260, floor: 3,
    images: ['https://images.unsplash.com/photo-1531088009183-5ff5b7c95f91?w=800','https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800','https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800','https://images.unsplash.com/photo-1587985064135-0366536eab42?w=800','https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'],
    amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Work Desk', 'Mini Fridge', 'Daily Housekeeping', 'Room Service'],
    features: { wifi: true, ac: true, tv: true, minibar: false, balcony: false, jacuzzi: false, pool: false, breakfast: false }, rating: 4.3
  },
  {
    name: 'Tech Park Deluxe', type: 'Deluxe', city: 'Bangalore', location: cities.Bangalore,
    description: 'Designed for the modern business professional, with fiber internet, co-working lounge access, ergonomic workspace, and stunning city views from the 7th floor.',
    price: 5200, maxGuests: 2, size: 400, floor: 7,
    images: ['https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800','https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=800','https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800','https://images.unsplash.com/photo-1536300099515-6c61b290b654?w=800','https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
    amenities: ['Free Fiber WiFi', 'Air Conditioning', 'Smart TV', 'Minibar', 'Co-Working Lounge', 'Ergonomic Chair', 'City View', 'Daily Housekeeping', 'Complimentary Breakfast'],
    features: { wifi: true, ac: true, tv: true, minibar: true, balcony: true, jacuzzi: false, pool: true, breakfast: true }, rating: 4.5
  },
  {
    name: 'Garden City Suite', type: 'Suite', city: 'Bangalore', location: cities.Bangalore,
    description: 'Experience Bangalore\'s famous garden city charm from this lush suite surrounded by greenery. Features a private terrace garden, soaking tub, and skyline views.',
    price: 10000, maxGuests: 2, size: 680, floor: 10,
    images: ['https://images.unsplash.com/photo-1601565415267-724db0e1e4ca?w=800','https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800','https://images.unsplash.com/photo-1549294413-26f195200463?w=800','https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800','https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'],
    amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Full Minibar', 'Private Terrace Garden', 'Soaking Tub', 'Skyline View', 'Butler Service', 'Complimentary Breakfast'],
    features: { wifi: true, ac: true, tv: true, minibar: true, balcony: true, jacuzzi: false, pool: true, breakfast: true }, rating: 4.7
  },
  // Jaipur
  {
    name: 'Royal Heritage Room', type: 'Standard', city: 'Jaipur', location: cities.Jaipur,
    description: 'Experience the Pink City\'s royal heritage in this beautifully decorated room with Rajasthani motifs, handcrafted furniture, and a view of the majestic Hawa Mahal.',
    price: 3000, maxGuests: 2, size: 300, floor: 2,
    images: ['https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800','https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800','https://images.unsplash.com/photo-1531088009183-5ff5b7c95f91?w=800','https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800','https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800'],
    amenities: ['Free WiFi', 'Air Conditioning', 'Flat Screen TV', 'Rajasthani Decor', 'Heritage View', 'Daily Housekeeping', 'Room Service', 'Complimentary Chai'],
    features: { wifi: true, ac: true, tv: true, minibar: false, balcony: true, jacuzzi: false, pool: false, breakfast: false }, rating: 4.4
  },
  {
    name: 'Maharaja Deluxe Suite', type: 'Suite', city: 'Jaipur', location: cities.Jaipur,
    description: 'Live like a Maharaja in this opulent suite inspired by the royal palaces of Rajasthan. Features hand-painted frescoes, a private courtyard, and a traditional steam bath.',
    price: 18000, maxGuests: 3, size: 850, floor: 4,
    images: ['https://images.unsplash.com/photo-1562438668-bcf0ca6578f0?w=800','https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800','https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800','https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800','https://images.unsplash.com/photo-1549294413-26f195200463?w=800'],
    amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Full Minibar', 'Private Courtyard', 'Steam Bath', 'Hand-Painted Frescoes', 'Butler Service', 'Complimentary Breakfast', 'Heritage Tour'],
    features: { wifi: true, ac: true, tv: true, minibar: true, balcony: true, jacuzzi: true, pool: true, breakfast: true }, rating: 4.9
  },
  {
    name: 'Pink City Family Room', type: 'Family', city: 'Jaipur', location: cities.Jaipur,
    description: 'A spacious family room designed for those exploring Jaipur\'s rich history. Features two queen beds, a kids play area, and a traditional Rajasthani dining corner.',
    price: 6500, maxGuests: 5, size: 580, floor: 3,
    images: ['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800','https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800','https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800','https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=800','https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800'],
    amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Two Queen Beds', 'Kids Play Area', 'Rajasthani Dining Corner', 'Pool Access', 'Daily Housekeeping', 'Complimentary Breakfast'],
    features: { wifi: true, ac: true, tv: true, minibar: false, balcony: true, jacuzzi: false, pool: true, breakfast: true }, rating: 4.6
  },
]

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hotel_booking_rooms')
    console.log('✅ MongoDB connected for seeding')
    await Room.deleteMany({})
    console.log('🗑️  Old rooms cleared')
    const inserted = await Room.insertMany(rooms)
    console.log(`✅ ${inserted.length} rooms seeded across 5 cities!`)
    const cities_list = [...new Set(rooms.map(r => r.city))]
    cities_list.forEach(city => {
      const cityRooms = rooms.filter(r => r.city === city)
      console.log(`  📍 ${city}: ${cityRooms.length} rooms`)
    })
    process.exit(0)
  } catch (err) {
    console.error('❌ Seeding error:', err)
    process.exit(1)
  }
}

seedDB()