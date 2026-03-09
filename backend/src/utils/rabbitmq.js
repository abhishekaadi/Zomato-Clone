const amqp = require('amqplib');

let channel = null;

const connectRabbitMQ = async () => {
    try {
        const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
        const connection = await amqp.connect(rabbitUrl);
        channel = await connection.createChannel();
        await channel.assertQueue('order_updates_queue', { durable: true });
        console.log('✅ Connected to RabbitMQ');
    } catch (error) {
        console.error('❌ RabbitMQ Connection Error:', error.message);
        // Retry connection after 5 seconds
        setTimeout(connectRabbitMQ, 5000);
    }
};

const publishOrderUpdate = (statusData) => {
    if (!channel) {
        console.error('RabbitMQ channel not established yet.');
        return;
    }
    channel.sendToQueue(
        'order_updates_queue',
        Buffer.from(JSON.stringify(statusData)),
        { persistent: true }
    );
};

const consumeOrderUpdates = (io) => {
    if (!channel) {
        console.error('RabbitMQ channel not established yet. Delaying consumer...');
        setTimeout(() => consumeOrderUpdates(io), 2000);
        return;
    }

    channel.consume('order_updates_queue', (msg) => {
        if (msg !== null) {
            const data = JSON.parse(msg.content.toString());
            console.log('🐰 Consumed from RabbitMQ:', data);

            // Broadcast via Socket.io to the specific order room
            io.to(`order_${data.orderId}`).emit('orderStatusUpdate', data);

            // Acknowledge the message
            channel.ack(msg);
        }
    });
};

module.exports = { connectRabbitMQ, publishOrderUpdate, consumeOrderUpdates };
