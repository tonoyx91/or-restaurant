const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Simple seed to create demo foods
const mongoose = require('mongoose');
const Food = require('./models/Food');

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/restaurant-app';

console.log('Seeding foods to', MONGO);

const demo = [
  { 
    title: 'Special Hyderabadi Biryani',
    description: 'Aromatic basmati rice cooked with tender chicken, saffron, and secret spices',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    price: 320,
    rating: 4.8
  },
  {
    title: 'Wagyu Beef Burger',
    description: 'Premium wagyu beef patty with caramelized onions and signature sauce',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    price: 450,
    rating: 4.9
  },
  {
    title: 'Seafood Paella',
    description: 'Spanish rice dish with fresh prawns, mussels, and calamari',
    image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=600&q=80',
    price: 580,
    rating: 4.7
  },
  {
    title: 'Truffle Mushroom Pizza',
    description: 'Wood-fired pizza with truffle oil, wild mushrooms, and mozzarella',
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
    price: 420,
    rating: 4.6
  },
  {
    title: 'Mediterranean Bowl',
    description: 'Fresh quinoa bowl with falafel, hummus, and grilled vegetables',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    price: 280,
    rating: 4.5
  },
  {
    title: 'Sushi Deluxe Platter',
    description: 'Assorted premium sushi with fresh salmon, tuna, and tobiko',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80',
    price: 690,
    rating: 4.9
  },
  {
    title: 'Thai Green Curry',
    description: 'Authentic coconut curry with bamboo shoots and Thai basil',
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=600&q=80',
    price: 340,
    rating: 4.6
  },
  {
    title: 'Classic Club Sandwich',
    description: 'Triple-decker sandwich with chicken, bacon, and avocado',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
    price: 240,
    rating: 4.3
  }
];

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected, seeding foods...');
    await Food.deleteMany({});
    await Food.insertMany(demo);
    console.log('Seed done');
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
