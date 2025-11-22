import express from "express";
import { connect } from "./src/broker/rabbit.js";
import startListner from "./src/broker/listner.js";

const app = express();

app.get("/", (req, res) => {
    res.send("Listener service is running...");
});

// Start listener + dummy server
async function start() {
    await connect();
    startListner();
    console.log("RabbitMQ Listener Started!");

    const PORT = process.env.PORT || 10000;
    app.listen(PORT, () => {
        console.log("Dummy server running on PORT", PORT);
    });
}

start();
