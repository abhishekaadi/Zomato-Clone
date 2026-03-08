import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const RestaurantCard = ({ restaurant }) => {
    return (
        <Link to={`/restaurant/${restaurant._id}`} className="block overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative h-48 sm:h-56">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white truncate">{restaurant.name}</h3>
                        <div className="flex items-center bg-green-600 text-white px-2 py-1 rounded text-sm font-bold">
                            <span>{restaurant.rating}</span>
                            <Star className="w-3 h-3 ml-1 fill-current" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-center text-gray-600 text-sm">
                    <p className="truncate mr-2 flex-grow">{restaurant.cuisine.join(', ')}</p>
                    <p className="whitespace-nowrap font-medium">{restaurant.deliveryTime} min</p>
                </div>
                <div className="mt-2 text-sm text-gray-500 truncate">
                    {restaurant.location}
                </div>
            </div>
        </Link>
    );
};

export default RestaurantCard;
