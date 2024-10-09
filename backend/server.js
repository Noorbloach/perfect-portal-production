import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import connectDB from "./config/db.js";
import UserRoutes from "./routes/UserRoutes.js";
import ProjectRoutes from "./routes/ProjectRoutes.js";
import NotificationRoutes from "./routes/NotificationRoutes.js";
import MessageRoutes from "./routes/MessageRoutes.js";
import Message from "./models/MessageModel.js"; // Import your Message model
import clientRoutes from "./routes/ClientRoutes.js";
import { dirname, join } from "path";
import path from "path";
import { fileURLToPath } from "url";
// Create __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express app
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(express.json()); // For parsing JSON bodies
app.use(cors()); // Enable CORS

// Connect to the database
connectDB();

app.use("/uploads", express.static(join(__dirname, "uploads")));

// Routes
app.use("/api", ProjectRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/auth", UserRoutes); // User authentication routes
app.use("/notifications", NotificationRoutes);
app.use("/api/chat", MessageRoutes);

// WebSocket server
wss.on("connection", (ws) => {
  console.log("New WebSocket connection");

  ws.on("message", async (message) => {
    const data = JSON.parse(message);
    console.log("Received message:", data);

    // Store the message in the database
    try {
      const newMessage = new Message({
        sender: data.sender,
        receiver: data.receiver,
        message: data.message,
      });
      await newMessage.save();
    } catch (err) {
      console.error("Error saving message:", err);
    }

    // Broadcast message to other clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocketServer.OPEN && client !== ws) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Express server!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Server Error",
    error: err.message,
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
