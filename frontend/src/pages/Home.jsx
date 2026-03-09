import React, { useEffect } from 'react';
import axios from 'axios';
import { useStore } from '../store/useStore';
import RestaurantCard from '../components/RestaurantCard';

const Home = () => {
    const { restaurants, setRestaurants } = useStore();

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const { data } = await axios.get('/api/restaurants');
                setRestaurants(data);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
            }
        };
        fetchRestaurants();
    }, [setRestaurants]);

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
