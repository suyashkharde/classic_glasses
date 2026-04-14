/**
 * Seed script — creates an admin user, sample products, and a coupon.
 * Run: node src/seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');

const products = [
  { name: 'Classic Aviator', description: 'Timeless aviator frames with UV400 protection. Lightweight metal frame.', price: 1299, originalPrice: 1999, category: 'sunglasses', frameType: 'full-rim', stock: 50, isFeatured: true, images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80'] },
  { name: 'Urban Wayfarer', description: 'Bold rectangular frames perfect for everyday wear. Available in multiple colors.', price: 999, originalPrice: 1499, category: 'men', frameType: 'full-rim', stock: 30, isFeatured: true, images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80'] },
  { name: 'Elegant Cat-Eye', description: 'Sophisticated cat-eye design for the modern woman. Acetate frame.', price: 1499, originalPrice: 2199, category: 'women', frameType: 'full-rim', stock: 25, isFeatured: true, images: ['https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80'] },
  { name: 'Blue Shield Pro', description: 'Anti-blue light computer glasses. Reduces eye strain during long screen sessions.', price: 799, originalPrice: 1199, category: 'computer-glasses', frameType: 'half-rim', stock: 60, isFeatured: true, images: ['https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&q=80'] },
  { name: 'Minimalist Round', description: 'Clean round frames with a minimalist aesthetic. Titanium lightweight build.', price: 2499, originalPrice: 3499, category: 'men', frameType: 'full-rim', stock: 15, isFeatured: true, images: ['https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&q=80'] },
  { name: 'Retro Oversized', description: 'Statement oversized sunglasses with gradient lenses. Perfect for summer.', price: 1799, originalPrice: 2499, category: 'sunglasses', frameType: 'full-rim', stock: 20, isFeatured: true, images: ['https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=600&q=80'] },
  { name: 'Slim Rimless', description: 'Ultra-lightweight rimless frames for a barely-there look. Professional style.', price: 3299, originalPrice: 4499, category: 'women', frameType: 'rimless', stock: 10, isFeatured: false, images: ['https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80'] },
  { name: 'Sport Wrap', description: 'Flexible sport wrap sunglasses with polarized lenses. Ideal for outdoor activities.', price: 1599, originalPrice: 2299, category: 'sunglasses', frameType: 'full-rim', stock: 35, isFeatured: true, images: ['https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=600&q=80'] },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing
  await Promise.all([User.deleteMany({}), Product.deleteMany({}), Coupon.deleteMany({})]);

  // Admin user
  await User.create({ name: 'Admin', email: 'admin@visio.com', password: 'admin123', role: 'admin' });
  console.log('Admin created: admin@visio.com / admin123');

  // Sample user
  await User.create({ name: 'Test User', email: 'user@visio.com', password: 'user123', role: 'user' });
  console.log('User created: user@visio.com / user123');

  // Products
  await Product.insertMany(products);
  console.log(`${products.length} products seeded`);

  // Coupons
  await Coupon.create({ code: 'FIRST10', discountPercent: 10, isActive: true });
  await Coupon.create({ code: 'SAVE20', discountPercent: 20, isActive: true });
  console.log('Coupons created: FIRST10 (10%), SAVE20 (20%)');

  console.log('\nSeed complete!');
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
