import React from 'react';
import { useStore } from '../store/useStore';

const MenuItemCard = ({ item }) => {
    const { addToCart } = useStore();

    return (
        <div className="flex flex-col sm:flex-row bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
            <div className="sm:w-1/3 h-48 sm:h-auto relative">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded shadow-sm text-xs font-bold flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-1 ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    {item.category}
                </div>
            </div>
            <div className="p-4 sm:w-2/3 flex flex-col justify-between">
                <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h4>
                    <p className="text-zomato-red font-bold text-lg mb-2">₹{item.price}</p>
                    <p className="text-gray-500 text-sm line-clamp-2">{item.description}</p>
                </div>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => addToCart(item)}
                        className="px-6 py-2 bg-red-50 text-zomato-red hover:bg-zomato-red hover:text-white border border-red-200 hover:border-zomato-red font-semibold rounded-lg transition-all"
                    >
                        ADD +
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MenuItemCard;
