const Order = require('../models/Order');
const { publishOrderUpdate } = require('../utils/rabbitmq');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { restaurantId, items, totalAmount, discount, couponApplied, deliveryAddress } = req.body;

        if (items && items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = new Order({
            userId: req.user._id,
            restaurantId,
            items,
            totalAmount,
            discount,
            couponApplied,
            deliveryAddress,
        });

        const createdOrder = await order.save();

        // Emit event to RabbitMQ message broker instead of direct Socket.io
        publishOrderUpdate({
            status: createdOrder.status,
            orderId: createdOrder._id,
        });

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .populate('restaurantId', 'name image')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status (Admin/Mock)
// @route   PUT /api/orders/:id/status
// @access  Public (In real app, this should be admin/restaurant protected)
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();

            // Emit real-time tracking update via RabbitMQ broker
            publishOrderUpdate({
                status: updatedOrder.status,
                orderId: updatedOrder._id,
            });

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    updateOrderStatus,
};
