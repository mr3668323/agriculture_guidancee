// backend/controllers/chat.controller.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize the model with gemini-1.5-flash-latest and system instruction
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest", // As per your requirement
    systemInstruction: "You are an expert agricultural assistant. Your primary purpose is to provide helpful and accurate information related to crop cultivation, fertilizers, pest control, harvesting, soil science, and general farming practices. If a user asks a question outside the scope of agriculture, politely decline to answer and redirect them back to agricultural topics. For example, you might say: 'I specialize in agriculture. How can I assist you with your farming needs?'"
});

export const sendMessage = async (req, res) => {
    console.log('Backend: sendMessage function triggered.');
    console.log('Backend: Request body received:', req.body);

    const { query } = req.body;

    if (!query) {
        console.warn('Backend: Query parameter is missing from the request body.');
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        console.log(`Backend: Calling Gemini API with query: "${query}"`);
        const result = await model.generateContent(query);
        const response = await result.response;
        const text = response.text();

        console.log('Backend: Successfully received response from Gemini API.');
        res.status(200).json({ response: text });
    } catch (error) {
        console.error('Backend: Error during Gemini API call:', error.message);
        res.status(500).json({ error: 'Failed to get response from AI', details: error.message });
    }
};