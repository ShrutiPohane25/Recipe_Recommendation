const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Load .env

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());                          
app.use(express.static(path.join(__dirname, 'public'))); // Serve frontend files

// Routes
const recipeRoutes = require('./routes/recipes');
app.use('/api/recipes', recipeRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
