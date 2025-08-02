// pages/api/suggestFood.js (Using Gemini Flash)
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getMood(userInput) {
    const emotionResponse = await fetch(
        "https://api-inference.huggingface.co/models/SamLowe/roberta-base-go_emotions",
        {
            headers: { Authorization: `Bearer ${process.env.HUGGING_FACE_API_TOKEN}`, 'Content-Type': 'application/json' },
            method: "POST",
            body: JSON.stringify({ inputs: userInput }),
        }
    );
    if (!emotionResponse.ok) throw new Error("Hugging Face classifier failed.");
    const emotions = await emotionResponse.json();
    return emotions[0][0].label;
}

async function callGemini(prompt) {
    try {
        // --- THIS IS THE ONLY LINE THAT CHANGED ---
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest", generationConfig: { temperature: 0.8 } });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonString = responseText.replace(/```json|```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Gemini API failed:", error.message);
        return null;
    }
}

async function callOpenRouter(prompt) {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}` },
            body: JSON.stringify({ model: "anthropic/claude-3-haiku", messages: [{ "role": "user", "content": prompt }] })
        });
        if (!response.ok) { const errorBody = await response.json(); throw new Error(`OpenRouter API failed: ${JSON.stringify(errorBody)}`); }
        const result = await response.json();
        return JSON.parse(result.choices[0].message.content);
    } catch (error) {
        console.error("OpenRouter API failed:", error.message);
        return null;
    }
}

export default async function handler(req, res) {
    const { text: userInput, ingredients } = req.body;
    if (!userInput) return res.status(400).json({ message: 'User input is required.' });

    try {
        const predictedMood = await getMood(userInput);
        const varietyInstruction = `CRITICAL INSTRUCTION: You MUST suggest a different and creative dish each time. Do not repeat previous suggestions. For positive moods like 'joy' or 'excitement', prioritize suggesting a savory celebratory meal.`;
        let prompt;
        if (ingredients && ingredients.length > 0) {
            prompt = `The user is feeling: "${predictedMood}". Based on this mood, suggest a simple, creative Indian meal they can make using ONLY ingredients from this list: [${ingredients.join(', ')}]. Respond ONLY with a JSON object with these exact keys: "predictedMood", "suggestedFood", "reason", "confidenceScore". The "predictedMood" should be "${predictedMood}". "confidenceScore" must be an INTEGER between 80 and 95. ${varietyInstruction}`;
        } else {
            prompt = `The user is feeling: "${predictedMood}". Based on this mood, suggest a creative and appropriate Indian meal. Respond ONLY with a JSON object with these exact keys: "predictedMood", "suggestedFood", "reason", "confidenceScore". The "predictedMood" should be "${predictedMood}". "confidenceScore" must be an INTEGER between 80 and 95. ${varietyInstruction}`;
        }

        console.log("Starting 2-way AI competition between Gemini and OpenRouter...");
        const [geminiResult, openRouterResult] = await Promise.allSettled([
            callGemini(prompt),
            callOpenRouter(prompt)
        ]);

        const successfulResponses = [];
        if (geminiResult.status === 'fulfilled' && geminiResult.value) {
            successfulResponses.push({ ...geminiResult.value, source: 'Gemini' });
        }
        if (openRouterResult.status === 'fulfilled' && openRouterResult.value) {
            successfulResponses.push({ ...openRouterResult.value, source: 'Claude 3 Haiku' });
        }

        if (successfulResponses.length === 0) {
            throw new Error("All AI models failed to provide a valid response.");
        }

        successfulResponses.sort((a, b) => b.confidenceScore - a.confidenceScore);
        const winner = successfulResponses[0];
        
        console.log(`Competition finished. Winner is ${winner.source} with score ${winner.confidenceScore}`);
        
        const finalResponse = { ...winner, predictedMood: predictedMood };
        res.status(200).json(finalResponse);

    } catch (e) {
        console.error("----------- DETAILED ERROR -----------", e);
        res.status(500).json({
            predictedMood: "Error",
            suggestedFood: "Request Failed",
            reason: "Sorry, the AI assistants failed to respond. Please try again in a moment.",
            confidenceScore: 0
        });
    }
}