import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { X, Mail, Lock, User } from 'lucide-react';

const AuthModal = () => {
    const { isAuthModalOpen, authMode, closeAuthModal, openAuthModal, login, register } = useStore();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isAuthModalOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        let res;
        if (authMode === 'login') {
            res = await login(email, password);
        } else {
            res = await register(name, email, password);
        }

        if (!res.success) {
            setError(res.message);
        } else {
            // Reset fields on success
            setName('');
            setEmail('');
            setPassword('');
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative transform transition-all p-8">
                <button
                    onClick={closeAuthModal}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-1">
                        {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-gray-500 text-sm">
                        {authMode === 'login' ? 'Log in to continue to Zomato' : 'Sign up to start ordering'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 border border-red-100 text-center font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {authMode === 'signup' && (
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Full Name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-zomato-red focus:ring-1 focus:ring-zomato-red transition"
                            />
                        </div>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-zomato-red focus:ring-1 focus:ring-zomato-red transition"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-zomato-red focus:ring-1 focus:ring-zomato-red transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-zomato-red hover:bg-red-600 text-white font-bold py-3 rounded-xl transition shadow-md disabled:bg-red-400 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? 'Please wait...' : (authMode === 'login' ? 'Log In' : 'Sign Up')}
                    </button>
                </form>

                <div className="mt-6 text-center text-gray-600 text-sm">
                    {authMode === 'login' ? (
                        <>
                            New to Zomato?{' '}
                            <button onClick={() => { setError(''); openAuthModal('signup'); }} className="text-zomato-red font-bold hover:underline">
                                Create an account
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{' '}
                            <button onClick={() => { setError(''); openAuthModal('login'); }} className="text-zomato-red font-bold hover:underline">
                                Log in
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
