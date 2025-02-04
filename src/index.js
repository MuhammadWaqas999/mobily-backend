import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://192.168.0.109:3000", "https://mobily-new.vercel.app/"],
  },
});

app.get("/", (req, res) => {
  res.send("WebSocket server is running!");
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.emit("message", "Hello from server");
  socket.on("navigate", (data) => {
    if (data.link) {
      socket.broadcast.emit("redirect", { link: data.link, socketId: socket.id });
    }
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
