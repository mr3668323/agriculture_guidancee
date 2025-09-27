// backend/config/db.js

import mongoose from 'mongoose'; // Change from require to import
import dotenv from 'dotenv';    // Import dotenv

// Load environment variables.
// Path from backend/config/db.js to AGRICULTURE_GUIDANCE/.env -> "../../.env"
dotenv.config({ path: '../../.env' });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // Exit process with failure. Ensure you have MONGO_URI in your .env file
        process.exit(1);
    }
};

export default connectDB; 