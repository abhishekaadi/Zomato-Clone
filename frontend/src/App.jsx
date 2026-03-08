import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RestaurantMenu from './pages/RestaurantMenu';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import AuthModal from './components/AuthModal';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/restaurant/:id" element={<RestaurantMenu />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/orders" element={<Orders />} />
                    </Routes>
                </main>
                <AuthModal />
            </div>
        </Router>
    );
}

export default App;
