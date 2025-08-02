// pages/api/identifyIngredients.js (FINAL - Using Google Gemini for Vision)
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google AI Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// This function converts the image buffer to the format Google's API needs
function bufferToGenerativePart(buffer, mimeType) {
    return {
        inlineData: {
            data: buffer.toString("base64"),
            mimeType,
        },
    };
}

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // We get the image data from the request
        const imageBuffer = await new Promise((resolve, reject) => {
            const chunks = [];
            req.on('data', chunk => chunks.push(chunk));
            req.on('end', () => resolve(Buffer.concat(chunks)));
            req.on('error', err => reject(err));
        });

        // We get the content type from the request headers (e.g., 'image/jpeg')
        const mimeType = req.headers['content-type'];

        // We get the Gemini model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        // The prompt we will give to the AI along with the image
        const prompt = "Analyze this image and list only the food ingredients you see. Exclude any non-food items like bowls, plates, or utensils. Please provide the list as a simple comma-separated string. For example: 'apples, milk, cheese, bread'.";

        // We convert the image to the correct format
        const imagePart = bufferToGenerativePart(imageBuffer, mimeType);

        // We send the prompt and the image to the AI
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        // We clean up the result from the AI and turn it into an array
        const ingredients = text.split(',').map(item => item.trim().toLowerCase());

        res.status(200).json({ ingredients });

    } catch (error) {
        console.error("----------- DETAILED ERROR -----------");
        console.error(error);
        console.error("--------------------------------------");
        res.status(500).json({ message: 'Failed to identify ingredients.' });
    }
}