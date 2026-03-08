import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User as UserIcon, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';

const Navbar = () => {
    const { user, logout, cart, setUser } = useStore();

    const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-3xl font-extrabold italic text-zomato-red">zomato</span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex space-x-8">
                            <div className="relative rounded-md shadow-sm">
                                <input
                                    type="text"
                                    className="form-input block w-full sm:text-sm sm:leading-5 placeholder-gray-400 border-gray-300 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out py-2 px-4 shadow-sm border bg-gray-50"
                                    placeholder="Search for restaurant, cuisine or a dish"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/cart" className="text-gray-500 hover:text-gray-900 transition relative flex items-center mr-6">
                            <ShoppingCart className="h-6 w-6" />
                            {cartItemsCount > 0 && (
                                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-zomato-red rounded-full">
                                    {cartItemsCount}
                                </span>
                            )}
                        </Link>
                        {user ? (
                            <>
                                <Link to="/orders" className="text-gray-500 hover:text-gray-900 transition flex items-center">
                                    Orders
                                </Link>
                                <div className="flex items-center space-x-2 border-l pl-4 ml-4">
                                    <UserIcon className="h-5 w-5 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                                    <button onClick={logout} className="text-gray-400 hover:text-zomato-red transition ml-2">
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4 border-l pl-4">
                                <button
                                    onClick={() => setUser({ _id: 'u1', name: 'Guest User', email: 'guest@zomato.com' })}
                                    className="text-gray-500 hover:text-gray-900 font-medium transition"
                                >
                                    Log in
                                </button>
                                <button
                                    onClick={() => setUser({ _id: 'u1', name: 'Guest User', email: 'guest@zomato.com' })}
                                    className="text-white bg-zomato-red hover:bg-red-600 px-4 py-2 rounded-md font-medium transition shadow-sm"
                                >
                                    Sign up
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
