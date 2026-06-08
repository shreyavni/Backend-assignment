require('dotenv').config(); // Load environment variables from a .env file
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Import Modular Routes
const authRoutes = require('./src/routes/authRoutes');
const taskRoutes = require('./src/routes/taskRoutes');

// Initialize the Express application
const app = express();

// Define the port (Fallback to 5000 if not defined in .env)
const PORT = process.env.PORT || 5000;

// ==========================================
// 1. GLOBAL MIDDLEWARES
// ==========================================
app.use(express.json()); // Parse incoming JSON payloads
app.use(cors());         // Enable Cross-Origin Resource Sharing (allows frontend to connect)

// ==========================================
// 2. DATABASE CONNECTION
// ==========================================
// Connects to MongoDB using the config file we created
connectDB();

// ==========================================
// 3. API ROUTES
// ==========================================
// Health Check Route (Good practice to verify the server is up)
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API is running smoothly!' });
});

// Mount the imported routes to specific base URLs
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);

// ==========================================
// 4. GLOBAL ERROR HANDLER
// ==========================================
// Catches any unhandled errors from the routes/controllers
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});