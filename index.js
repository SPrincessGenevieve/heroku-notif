const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const { Server } = require("socket.io");
const cors = require("cors");
const PORT = process.env.PORT || 3001;
app.use(cors());

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    socket.broadcast.emit("received_message", data);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
