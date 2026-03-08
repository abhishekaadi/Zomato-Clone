const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
// Intentionally left public to easily mock updates for demonstration
router.put('/:id/status', updateOrderStatus);

module.exports = router;
