// backend/src/server.js

import dotenv from 'dotenv';
import app from './app.js';

// Load .env file from root
dotenv.config();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`🌐 Access via local IP: http://localhost:${PORT}`);
});
