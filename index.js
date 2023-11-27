const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Adjust the CORS configuration for production
const corsOptions = {
  origin: "http://localhost:3000", // Replace with the actual URL of your React app
  methods: ["GET", "POST"],
};

app.use(cors(corsOptions));

// Set up a simple CSP allowing unsafe inline scripts (for development only)
const csp = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    // Add other directives as needed
  },
};

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", getCSPHeader(csp));
  next();
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    socket.broadcast.emit("received_message", data);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});

// Function to generate CSP header
function getCSPHeader(csp) {
  const header = Object.entries(csp.directives)
    .map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
    .join("; ");
  return header;
}
