import amqp from "amqplib";

let channel, connection;

export async function connect() {
    connection = await amqp.connect(process.env.RABBITMQ_URI);
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");
}

export async function publishTOQueue(queue, data) {
    await channel.assertQueue(queue, { durable: true });
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
    console.log("Message sent to queue:", queue);
}

export async function subscribeTOQueue(queue, callback) {
    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, async (msg) => {
        const content = JSON.parse(msg.content.toString());
        console.log("🔥 MESSAGE RECEIVED:", content);

        await callback(content);
        channel.ack(msg);
    });
}
