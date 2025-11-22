require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./src/app');
const connectToDb = require('./src/db/db');
const { connect } = require('./src/broker/rabbit');

connectToDb();
connect();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("✅ New socket connected:", socket.id);

  socket.on("play", (data) => {
    console.log("▶️ Play event received:", data);
    io.emit("play", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
