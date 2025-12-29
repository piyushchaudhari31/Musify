const amqp = require('amqplib');

let channel, connection;

async function connect() {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URI, {
      heartbeat: 60,
      ssl: { rejectUnauthorized: false }
    });
    channel = await connection.createChannel();
    console.log("✅ Connected to RabbitMQ Cloud");
  } catch (err) {
    console.error("❌ RabbitMQ Connection Error:", err.message);
    setTimeout(connect, 5000); // auto-retry every 5 sec
  }
}

async function publishTOQueue(queueName, data) {
  if (!channel) {
    console.error("⚠️ No channel available. Message not sent.");
    return;
  }
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
  console.log("📨 Message sent to queue:", queueName);
}

module.exports = { connect, publishTOQueue };
