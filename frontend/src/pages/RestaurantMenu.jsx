import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MenuItemCard from '../components/MenuItemCard';
import { Star, Clock, MapPin } from 'lucide-react';

const RestaurantMenu = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [menu, setMenu] = useState([]);

    useEffect(() => {
        // Mocking the restaurant fetch
        setRestaurant({
            _id: id,
            name: 'The Great Indian Kitchen',
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            cuisine: ['North Indian', 'Mughlai'],
            location: 'Connaught Place, New Delhi',
            rating: 4.5,
            deliveryTime: 35
        });

        // Mocking menu fetch
        setMenu([
            {
                _id: 'm1',
                name: 'Butter Chicken',
                description: 'Tender chicken simmered in a rich tomato base with butter and cream.',
                price: 350,
                image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
                category: 'Main Course',
                isVeg: false
            },
            {
                _id: 'm2',
                name: 'Paneer Tikka Masala',
                description: 'Grilled cottage cheese in a spicy and creamy onion-tomato gravy.',
                price: 280,
                image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
                category: 'Main Course',
                isVeg: true
            },
            {
                _id: 'm3',
                name: 'Garlic Naan',
                description: 'Soft Indian flatbread topped with garlic and butter.',
                price: 60,
                image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
                category: 'Breads',
                isVeg: true
            }
        ]);
    }, [id]);

    if (!restaurant) return <div className="p-8 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zomato-red mx-auto"></div></div>;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
                        <p className="text-gray-600 mb-1">{restaurant.cuisine.join(', ')}</p>
                        <p className="text-gray-500 text-sm flex items-center">
                            <MapPin className="w-4 h-4 mr-1" /> {restaurant.location}
                        </p>
                    </div>
                    <div className="flex flex-col items-center bg-green-50 rounded-lg p-2 border border-green-200">
                        <div className="text-green-700 font-bold flex items-center text-lg">
                            {restaurant.rating} <Star className="w-4 h-4 ml-1 fill-current" />
                        </div>
                        <div className="text-xs text-green-600 mt-1">Delivery Rating</div>
                    </div>
                </div>

                <div className="flex border-t border-gray-100 mt-6 pt-6">
                    <div className="flex items-center text-gray-700 text-sm mr-8">
                        <Clock className="w-5 h-5 mr-2 text-gray-400" />
                        <span className="font-semibold">{restaurant.deliveryTime} mins</span>
                        <span className="mx-1 text-gray-400">|</span>
                        <span>Delivery Time</span>
                    </div>
                </div>
            </div>

            {/* Menu List */}
            <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900">Order Online</h3>
                <div className="space-y-6">
                    {menu.map(item => (
                        <MenuItemCard key={item._id} item={item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RestaurantMenu;
