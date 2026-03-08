import React, { useEffect } from 'react';
import axios from 'axios';
import { useStore } from '../store/useStore';
import RestaurantCard from '../components/RestaurantCard';

const Home = () => {
    const { restaurants, setRestaurants } = useStore();

    useEffect(() => {
        // In a real app, this would fetch from backend API
        // const fetchRestaurants = async () => {
        //   const { data } = await axios.get('/api/restaurants');
        //   setRestaurants(data);
        // };
        // fetchRestaurants();

        // Mock Data for immediate UI rendering without backend attached yet
        const mockRestaurants = [
            {
                _id: '1',
                name: 'The Great Indian Kitchen',
                image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                cuisine: ['North Indian', 'Mughlai'],
                location: 'Connaught Place, New Delhi',
                rating: 4.5,
                deliveryTime: 35
            },
            {
                _id: '2',
                name: 'Burger & Co.',
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                cuisine: ['Burger', 'American', 'Fast Food'],
                location: 'Hauz Khas Village',
                rating: 4.2,
                deliveryTime: 25
            },
            {
                _id: '3',
                name: 'Sushi Zen',
                image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                cuisine: ['Japanese', 'Sushi', 'Asian'],
                location: 'Cyber Hub, Gurugram',
                rating: 4.8,
                deliveryTime: 45
            }
        ];
        setRestaurants(mockRestaurants);
    }, []);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Delivery Restaurants in Your Area</h1>
                <p className="text-gray-500">Discover top-rated places around you</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {restaurants.map(restaurant => (
                    <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                ))}
            </div>
        </div>
    );
};

export default Home;
