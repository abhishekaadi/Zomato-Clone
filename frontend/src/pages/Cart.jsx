import React, { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, user, openAuthModal } = useStore();
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const addressRef = useRef(null);

    const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const deliveryFee = 40;
    const taxes = totalAmount * 0.05; // 5% GST
    const grandTotal = totalAmount + deliveryFee + taxes;

    const handleCheckout = () => {
        if (!user) {
            openAuthModal('login');
            return;
        }

        // Basic mock checkout
        if (!address.trim()) {
            setError('Please enter a delivery address above to proceed.');
            if (addressRef.current) addressRef.current.focus();
            return;
        }
        setError('');

        // In a real app, this would make an API call to POST /api/orders
        const mockOrder = {
            _id: 'ord_' + Math.random().toString(36).substr(2, 9),
            items: cart,
            totalAmount: grandTotal,
            status: 'Pending',
            createdAt: new Date().toISOString()
        };

        // Save to local storage for Orders page mock
        const existingOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
        localStorage.setItem('mockOrders', JSON.stringify([mockOrder, ...existingOrders]));

        clearCart();
        navigate('/orders');
    };

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <img src="https://b.zmtcdn.com/web-assets/images/placeholder_200.png" alt="Empty Cart" className="w-64 mb-6 opacity-80" />
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">You can go to home page to view more restaurants</p>
                <button onClick={() => navigate('/')} className="px-6 py-2 bg-zomato-red text-white font-bold rounded-lg hover:bg-red-600 transition">
                    See Restaurants near you
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
            {/* Cart Items */}
            <div className="md:w-2/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold border-b pb-4 mb-4">Cart ({cart.length} Items)</h2>

                <div className="space-y-6">
                    {cart.map(item => (
                        <div key={item._id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                            <div className="flex items-center w-2/3">
                                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg mr-4" />
                                <div>
                                    <h4 className="font-bold text-lg">{item.name}</h4>
                                    <p className="text-gray-500 text-sm">₹{item.price}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                                        className="px-3 py-1 bg-gray-50 hover:bg-gray-100 font-bold"
                                    >
                                        <Minus className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <span className="px-4 py-1 font-semibold">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        className="px-3 py-1 bg-gray-50 hover:bg-gray-100 font-bold text-zomato-red"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                <p className="font-bold w-16 text-right">₹{item.price * item.quantity}</p>

                                <button onClick={() => removeFromCart(item._id)} className="text-gray-400 hover:text-red-500 transition">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bill & Checkout */}
            <div className="md:w-1/3">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
                    <h3 className="font-bold text-xl mb-4 text-gray-800">Delivery Address</h3>
                    <textarea
                        ref={addressRef}
                        className={`w-full border ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg p-3 outline-none focus:border-zomato-red focus:ring-1 focus:ring-zomato-red transition h-24 resize-none`}
                        placeholder="Enter your full delivery address..."
                        value={address}
                        onChange={(e) => { setAddress(e.target.value); setError(''); }}
                    ></textarea>
                    {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-xl border-b pb-4 mb-4 text-gray-800">Bill Details</h3>

                    <div className="space-y-3 mb-4 text-gray-600">
                        <div className="flex justify-between">
                            <span>Item Total</span>
                            <span className="font-medium">₹{totalAmount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery Fee</span>
                            <span className="font-medium">₹{deliveryFee}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Taxes and Charges</span>
                            <span className="font-medium">₹{taxes.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="border-t pt-4 flex justify-between items-center mb-6">
                        <span className="font-bold text-lg">TO PAY</span>
                        <span className="font-bold text-xl text-gray-900">₹{grandTotal.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        className="w-full bg-zomato-red hover:bg-red-600 text-white font-bold py-3 rounded-xl transition text-lg shadow-md mt-4"
                    >
                        {user ? 'Place Mock Order' : 'Log in to Place Order'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
