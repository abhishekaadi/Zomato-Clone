const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');

dotenv.config();

const RESTAURANT_TYPES = ['Indian', 'Chinese', 'Italian', 'Mexican', 'Fast Food', 'Healthy', 'Desserts', 'Cafe'];
const STREETS = ['Main St', 'Park Ave', 'High St', 'Broadway', 'Oak Rd', 'Pine St', 'Cyber City', 'Ring Road'];
const IMAGES = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
    'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=80',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80',
    'https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=500&q=80',
    'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&q=80',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=500&q=80',
    'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?w=500&q=80'
];

const FOOD_ITEMS = [
    { name: 'Butter Chicken', type: 'Meals', price: 350 },
    { name: 'Paneer Tikka Masala', type: 'Meals', price: 280 },
    { name: 'Margherita Pizza', type: 'Meals', price: 400 },
    { name: 'Sushi Platter', type: 'Meals', price: 600 },
    { name: 'Chicken Biryani', type: 'Meals', price: 300 },
    { name: 'Masala Dosa', type: 'Meals', price: 150 },
    { name: 'Hakka Noodles', type: 'Meals', price: 180 },
    { name: 'Veg Hakka Noodles', type: 'Meals', price: 160 },
    { name: 'Pasta Alfredo', type: 'Meals', price: 250 },
    { name: 'Chicken Burger', type: 'Snacks', price: 150 },
    { name: 'Veggie Burger', type: 'Snacks', price: 120 },
    { name: 'French Fries', type: 'Snacks', price: 90 },
    { name: 'Nachos with Salsa', type: 'Snacks', price: 180 },
    { name: 'Samosa (2 pcs)', type: 'Snacks', price: 50 },
    { name: 'Spring Rolls', type: 'Snacks', price: 140 },
    { name: 'Chicken Wings', type: 'Snacks', price: 220 },
    { name: 'Onion Rings', type: 'Snacks', price: 110 },
    { name: 'Paneer Tikka Roll', type: 'Snacks', price: 130 },
    { name: 'Coca Cola Can', type: 'Cold Drinks', price: 60 },
    { name: 'Pepsi Can', type: 'Cold Drinks', price: 60 },
    { name: 'Thums Up', type: 'Cold Drinks', price: 50 },
    { name: 'Sprite', type: 'Cold Drinks', price: 50 },
    { name: 'Cold Coffee', type: 'Cold Drinks', price: 120 },
    { name: 'Fresh Lime Soda', type: 'Cold Drinks', price: 80 },
    { name: 'Mint Mojito', type: 'Cold Drinks', price: 150 },
    { name: 'Mango Shake', type: 'Cold Drinks', price: 100 },
    { name: 'Strawberry Milkshake', type: 'Cold Drinks', price: 130 },
    { name: 'Iced Tea', type: 'Cold Drinks', price: 90 }
];

const FOOD_IMAGES = {
    'Meals': 'https://images.unsplash.com/photo-1544025162-8350b92395a6?w=400&q=80',
    'Snacks': 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&q=80',
    'Cold Drinks': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80'
};

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomSubset = (arr, num) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
};

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/zomato');
        console.log('✅ Connected to MongoDB');

        await Restaurant.deleteMany({});
        await MenuItem.deleteMany({});
        console.log('🗑️  Cleared existing restaurant and menu data');

        const NUM_RESTAURANTS = 50;
        const restaurants = [];

        for (let i = 0; i < NUM_RESTAURANTS; i++) {
            const name = `Bistro ${i + 1} - ${getRandomItem(RESTAURANT_TYPES)}`;
            const image = getRandomItem(IMAGES);
            const cuisine = getRandomSubset(RESTAURANT_TYPES, getRandomInt(1, 4));
            const location = `${getRandomInt(1, 200)} ${getRandomItem(STREETS)}, City Center`;
            const rating = (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1);
            const deliveryTime = getRandomInt(20, 60);

            restaurants.push({
                name,
                image,
                cuisine,
                location,
                rating: parseFloat(rating),
                deliveryTime
            });
        }

        const createdRestaurants = await Restaurant.insertMany(restaurants);
        console.log(`🍔 Inserted ${createdRestaurants.length} restaurants`);

        const menuItems = [];

        // Add 5-15 random menu items to EACH restaurant
        for (const restaurant of createdRestaurants) {
            const numItems = getRandomInt(5, 15);
            const selectedFoods = getRandomSubset(FOOD_ITEMS, numItems);

            for (const food of selectedFoods) {
                menuItems.push({
                    restaurantId: restaurant._id,
                    name: food.name,
                    description: `Delicious ${food.name} served fresh. Perfect for your cravings!`,
                    price: food.price,
                    image: FOOD_IMAGES[food.type]
                });
            }
        }

        const createdMenu = await MenuItem.insertMany(menuItems);
        console.log(`🍟 Inserted ${createdMenu.length} menu items`);

        console.log('🎉 Data seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('❌ Seeding Error:', error);
        process.exit(1);
    }
};

seedData();
