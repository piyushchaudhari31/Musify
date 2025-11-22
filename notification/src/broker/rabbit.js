import amqp from 'amqplib';


let channel,connection ;
 
export async function connect(){

    connection = await amqp.connect(process.env.RABBITMQ_URI)
    channel = await connection.createChannel()

    console.log("connection to RabbitMQ");
    

}

export async function publishTOQueue(QueueName,data){

   await channel.assertQueue(QueueName, { durable: true });
await channel.sendToQueue(QueueName, Buffer.from(JSON.stringify(data)));

    console.log("message send to queue");
    


}

export async function subscribeTOQueue(QueueName,callback){
    
    await channel.assertQueue(QueueName , {durable:true});

    channel.consume(QueueName , async(msg)=>{
        await callback(JSON.parse(msg.content.toString()))
        await channel.ack(msg)
    })
}