const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io setup for real-time tracking
const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins for dev; restrict in prod
        methods: ['GET', 'POST']
    }
});

// Routes
const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('Zomato Clone API is running');
});

// Socket.io connection logic
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Users can join a "room" specific to their order ID to listen for updates
    socket.on('joinOrderRoom', (orderId) => {
        socket.join(`order_${orderId}`);
        console.log(`Socket ${socket.id} joined room order_${orderId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Export io so it can be used in controllers
app.set('socketio', io);

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongodb:27017/zomato')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error: ', err));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
