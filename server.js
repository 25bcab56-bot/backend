const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Contact = require("./models/Contact");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Atlas Connected"))
.catch(err => console.log("❌ DB Error:", err));

// Routes
app.get("/", (req, res) => {
    res.send("API Running 🚀");
});

// Save Contact
app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const contact = new Contact({ name, email, message });

        await contact.save();

        res.status(201).json({
            success: true,
            message: "Message saved in MongoDB ✅",
            data: contact
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error ❌"
        });
    }
});

// Get all messages (optional admin)
app.get("/api/messages", async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            count: messages.length,
            data: messages
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching messages"
        });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});