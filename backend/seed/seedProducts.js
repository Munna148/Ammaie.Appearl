require('dotenv').config();
const mongoose = require('mongoose');
const { Product } = require('../models');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

const dummyProducts = [
  {
    name: 'Floral Party Dress',
    description: 'Elegant floral print party dress with flowy silhouette. Perfect for celebrations and special occasions.',
    price: 2499,
    discountPrice: 1999,
    images: ['https://placehold.co/600x800?text=Floral+Party'],
    category: 'Party',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Pink', 'Blue', 'Mint'],
    rating: 4.5,
    stock: 25,
  },
  {
    name: 'Casual Cotton Maxi',
    description: 'Comfortable cotton maxi dress for everyday wear. Lightweight and breathable.',
    price: 1299,
    discountPrice: 999,
    images: ['https://placehold.co/600x800?text=Casual+Maxi'],
    category: 'Casual',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Lavender', 'Beige'],
    rating: 4.2,
    stock: 40,
  },
  {
    name: 'Bridal Lehenga Style Dress',
    description: 'Stunning bridal-inspired dress with intricate embroidery and elegant drape.',
    price: 8999,
    discountPrice: 7499,
    images: ['https://placehold.co/600x800?text=Bridal+Dress'],
    category: 'Wedding',
    sizes: ['S', 'M', 'L'],
    colors: ['Red', 'Maroon', 'Gold'],
    rating: 4.8,
    stock: 10,
  },
  {
    name: 'Summer Striped Sundress',
    description: 'Bright and cheerful striped sundress ideal for hot summer days.',
    price: 899,
    discountPrice: 699,
    images: ['https://placehold.co/600x800?text=Summer+Sundress'],
    category: 'Summer',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Yellow', 'Orange', 'Coral'],
    rating: 4.0,
    stock: 50,
  },
  {
    name: 'Sequined Cocktail Dress',
    description: 'Sparkling sequined dress for evening parties and night outs.',
    price: 3499,
    discountPrice: 2799,
    images: ['https://placehold.co/600x800?text=Sequined+Dress'],
    category: 'Party',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Black', 'Silver', 'Navy'],
    rating: 4.6,
    stock: 18,
  },
  {
    name: 'Denim Jumper Dress',
    description: 'Trendy denim jumper dress for a casual yet stylish look.',
    price: 1599,
    images: ['https://placehold.co/600x800?text=Denim+Jumper'],
    category: 'Casual',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blue', 'Light Blue'],
    rating: 4.3,
    stock: 30,
  },
  {
    name: 'Wedding Guest Gown',
    description: 'Elegant gown suitable for wedding guests. Sophisticated and graceful.',
    price: 4999,
    discountPrice: 3999,
    images: ['https://placehold.co/600x800?text=Wedding+Guest'],
    category: 'Wedding',
    sizes: ['S', 'M', 'L'],
    colors: ['Sage', 'Dusty Pink', 'Teal'],
    rating: 4.7,
    stock: 15,
  },
  {
    name: 'Tropical Print Dress',
    description: 'Vibrant tropical print dress for beach and vacation vibes.',
    price: 1199,
    discountPrice: 949,
    images: ['https://placehold.co/600x800?text=Tropical+Dress'],
    category: 'Summer',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Green', 'Pink', 'Multi'],
    rating: 4.1,
    stock: 35,
  },
  {
    name: 'Velvet Party Gown',
    description: 'Luxurious velvet gown with a modern fit. Perfect for winter parties.',
    price: 4299,
    discountPrice: 3599,
    images: ['https://placehold.co/600x800?text=Velvet+Gown'],
    category: 'Party',
    sizes: ['S', 'M', 'L'],
    colors: ['Burgundy', 'Emerald', 'Navy'],
    rating: 4.5,
    stock: 12,
  },
  {
    name: 'Knit Midi Dress',
    description: 'Cozy knit midi dress for relaxed casual days.',
    price: 1799,
    images: ['https://placehold.co/600x800?text=Knit+Midi'],
    category: 'Casual',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Grey', 'Cream', 'Brown'],
    rating: 4.4,
    stock: 22,
  },
  {
    name: 'Designer Saree Gown',
    description: 'Contemporary saree-inspired gown for wedding functions.',
    price: 6999,
    discountPrice: 5999,
    images: ['https://placehold.co/600x800?text=Saree+Gown'],
    category: 'Wedding',
    sizes: ['S', 'M', 'L'],
    colors: ['Peach', 'Sky Blue', 'Magenta'],
    rating: 4.9,
    stock: 8,
  },
  {
    name: 'Linen Blend Dress',
    description: 'Breathable linen blend dress for comfortable summer styling.',
    price: 1499,
    discountPrice: 1199,
    images: ['https://placehold.co/600x800?text=Linen+Dress'],
    category: 'Summer',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['White', 'Olive', 'Terracotta'],
    rating: 4.3,
    stock: 28,
  },
  {
    name: 'Ruffle Hem Party Dress',
    description: 'Playful ruffle hem dress that stands out at any party.',
    price: 2199,
    discountPrice: 1799,
    images: ['https://placehold.co/600x800?text=Ruffle+Dress'],
    category: 'Party',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Red', 'White', 'Blush'],
    rating: 4.4,
    stock: 20,
  },
  {
    name: 'Pocket Shirt Dress',
    description: 'Practical shirt dress with pockets. Easy to style for casual outings.',
    price: 1399,
    images: ['https://placehold.co/600x800?text=Shirt+Dress'],
    category: 'Casual',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Striped', 'Solid Blue', 'Check'],
    rating: 4.2,
    stock: 38,
  },
  {
    name: 'Anarkali Wedding Dress',
    description: 'Traditional Anarkali style dress for wedding ceremonies.',
    price: 5999,
    discountPrice: 4999,
    images: ['https://placehold.co/600x800?text=Anarkali'],
    category: 'Wedding',
    sizes: ['S', 'M', 'L'],
    colors: ['Pink', 'Green', 'Purple'],
    rating: 4.7,
    stock: 14,
  },
  {
    name: 'Off-Shoulder Summer Dress',
    description: 'Chic off-shoulder dress perfect for summer brunches and outings.',
    price: 1699,
    discountPrice: 1349,
    images: ['https://placehold.co/600x800?text=OffShoulder'],
    category: 'Summer',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['White', 'Lemon', 'Coral'],
    rating: 4.5,
    stock: 26,
  },
  {
    name: 'Metallic Evening Dress',
    description: 'Stunning metallic finish dress for glamorous evening events.',
    price: 3999,
    discountPrice: 3299,
    images: ['https://placehold.co/600x800?text=Metallic+Dress'],
    category: 'Party',
    sizes: ['S', 'M', 'L'],
    colors: ['Gold', 'Rose Gold', 'Bronze'],
    rating: 4.6,
    stock: 16,
  },
  {
    name: 'Bohemian Maxi Dress',
    description: 'Free-spirited boho maxi dress with relaxed fit and print.',
    price: 1899,
    images: ['https://placehold.co/600x800?text=Boho+Maxi'],
    category: 'Casual',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Mustard', 'Rust', 'Olive'],
    rating: 4.3,
    stock: 24,
  },
  {
    name: 'Sharara Set Style Dress',
    description: 'Indo-western sharara inspired dress for wedding receptions.',
    price: 5499,
    discountPrice: 4499,
    images: ['https://placehold.co/600x800?text=Sharara+Dress'],
    category: 'Wedding',
    sizes: ['S', 'M', 'L'],
    colors: ['Teal', 'Pink', 'Black'],
    rating: 4.8,
    stock: 11,
  },
  {
    name: 'Crochet Summer Dress',
    description: 'Lightweight crochet detail dress for breezy summer days.',
    price: 999,
    discountPrice: 799,
    images: ['https://placehold.co/600x800?text=Crochet+Dress'],
    category: 'Summer',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['White', 'Pastel Pink', 'Sky Blue'],
    rating: 4.0,
    stock: 42,
  },
];

const seed = async () => {
  try {
    await connectDB();
    const existing = await Product.countDocuments();
    if (existing > 0) {
      console.log('Products already exist. Clear collection first if you want to re-seed.');
      process.exit(0);
      return;
    }
    await Product.insertMany(dummyProducts);
    console.log(`Seeded ${dummyProducts.length} products successfully.`);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seed();
