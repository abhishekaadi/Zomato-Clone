import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Package, Clock, CheckCircle2, MapPin } from 'lucide-react';
import axios from 'axios';
import { useStore } from '../store/useStore';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const { user } = useStore();

    useEffect(() => {
        // Initialize Socket.io connection - using relative path to root since Nginx proxies /socket.io to backend
        const newSocket = io({ transports: ['polling', 'websocket'] });
        setSocket(newSocket);

        const fetchOrders = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get('/api/orders/myorders', config);
                setOrders(data);

                // Join room for each order to listen for status updates
                data.forEach(order => {
                    newSocket.emit('joinOrderRoom', order._id);
                });
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();

        // Listen for status updates
        newSocket.on('orderStatusUpdate', (data) => {
            console.log('Order status updated from socket:', data);
            setOrders(prevOrders => prevOrders.map(order => {
                if (order._id === data.orderId) {
                    return { ...order, status: data.status };
                }
                return order;
            }));
        });

        return () => newSocket.close();
    }, [user]);

    // Development helper to simulate status changes
    const simulateStatusUpdate = (orderId, newStatus) => {
        setOrders(prevOrders => prevOrders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));

        // In a real app with connected backend, we would call an API like:
        // axios.put(`/api/orders/${orderId}/status`, { status: newStatus })
        // which would then trigger the socket emission from the backend to all clients viewing this order.
    };

    if (loading) {
        return <div className="p-8 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zomato-red mx-auto"></div></div>;
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-20">
                <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-700">No Orders yet</h2>
                <p className="text-gray-500 mt-2">Looks like you haven't ordered yet.</p>
            </div>
        );
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'Preparing': return <Package className="w-5 h-5 text-orange-500" />;
            case 'OutForDelivery': return <MapPin className="w-5 h-5 text-blue-500" />;
            case 'Delivered': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            default: return <Clock className="w-5 h-5 text-gray-500" />;
        }
    };

    const statusList = ['Pending', 'Preparing', 'OutForDelivery', 'Delivered'];

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">Past Orders & Tracking</h1>

            <div className="space-y-6">
                {orders.map(order => (
                    <div key={order._id} className="bg-white border text-left border-gray-200 shadow-sm rounded-xl p-6 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4 border-b pb-4">
                            <div>
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-mono mb-2 inline-block">ID: {order._id}</span>
                                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                            </div>
                            <div className="bg-gray-50 border px-4 py-2 rounded-lg flex items-center shadow-inner">
                                {getStatusIcon(order.status)}
                                <span className="ml-2 font-bold text-gray-700">{order.status}</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="font-semibold text-gray-700 mb-2 border-b pb-1">Items</h4>
                            <ul className="space-y-1">
                                {order.items.map((item, idx) => (
                                    <li key={idx} className="flex justify-between text-sm text-gray-600">
                                        <span>{item.quantity} x {item.name}</span>
                                        <span>₹{item.price * item.quantity}</span>
                                    </li>
                                ))}
                            </ul>

                            {order.discount > 0 && (
                                <div className="flex justify-between mt-2 pt-2 text-sm font-medium text-green-600">
                                    <span>Discount ({order.couponApplied})</span>
                                    <span>-₹{order.discount.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between mt-3 pt-3 border-t font-bold text-gray-900">
                                <span>Total Paid</span>
                                <span>₹{order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Tracking Status Bar */}
                        <div className="mt-4 pt-4 border-t border-dashed">
                            <h4 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Live Tracking Timeline</h4>
                            <div className="relative">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded"></div>

                                <div className="relative flex justify-between z-10 w-full px-2">
                                    {statusList.map((stepStatus, idx) => {
                                        const currentIndex = statusList.indexOf(order.status);
                                        const isCompleted = idx <= currentIndex;
                                        const isActive = stepStatus === order.status;

                                        return (
                                            <div key={stepStatus} className="flex flex-col items-center">
                                                <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center
                          ${isCompleted ? 'bg-zomato-red border-red-200' : 'bg-white border-gray-300'}
                          ${isActive ? 'ring-4 ring-red-100' : ''} transition-all duration-300
                        `}></div>
                                                <span className={`text-xs mt-2 font-medium 
                          ${isActive ? 'text-zomato-red' : isCompleted ? 'text-gray-800' : 'text-gray-400'}
                        `}>
                                                    {stepStatus}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Development Mock Testing Actions */}
                        <div className="mt-8 bg-blue-50 p-3 rounded text-sm border border-blue-100">
                            <p className="text-blue-800 font-semibold mb-2">Dev Tools (Simulate Socket Event):</p>
                            <div className="flex space-x-2">
                                {statusList.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => simulateStatusUpdate(order._id, s)}
                                        className="px-2 py-1 bg-white border shadow-sm rounded hover:bg-gray-50 text-xs"
                                    >
                                        Set {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
