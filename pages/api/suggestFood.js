// pages/api/suggestFood.js (FINAL - with Fallback Logic)
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- Expert #1: RoBERTa (The Specialist) ---
async function getRobertaMood(userInput) {
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/SamLowe/roberta-base-go_emotions",
            {
                headers: { Authorization: `Bearer ${process.env.HUGGING_FACE_API_TOKEN}`, 'Content-Type': 'application/json' },
                method: "POST", body: JSON.stringify({ inputs: userInput }),
            }
        );
        if (!response.ok) return "neutral";
        const emotions = await response.json();
        return emotions[0][0].label;
    } catch (error) {
        console.error("RoBERTa mood classifier failed:", error);
        return "unknown";
    }
}

// --- Expert #2: Gemini (The Creative Generalist) ---
async function getGeminiMood(userInput) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const prompt = `Analyze the following text and determine the user's primary, nuanced mood in one or two words. Text: "${userInput}"`;
        const result = await model.generateContent(prompt);
        return result.response.text().trim().toLowerCase();
    } catch (error) {
        console.error("Gemini mood analysis failed:", error);
        return "unknown";
    }
}

// --- Expert #3: Claude (The Logical Generalist via OpenRouter) ---
async function getClaudeMood(userInput) {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}` },
            body: JSON.stringify({
                model: "anthropic/claude-3-haiku",
                messages: [{ "role": "user", "content": `Analyze the following text and determine the user's primary, nuanced mood in one or two words. Text: "${userInput}"` }]
            })
        });
        if (!response.ok) return "unknown";
        const result = await response.json();
        return result.choices[0].message.content.trim().toLowerCase();
    } catch (error) {
        console.error("Claude mood analysis failed:", error);
        return "unknown";
    }
}

// --- Helper function to call Gemini for the suggestion ---
async function callGeminiForFood(prompt) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest", generationConfig: { temperature: 0.9 } });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonString = responseText.replace(/```json|```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Gemini suggestion failed:", error.message);
        return null; // Return null on failure
    }
}

// --- Helper function to call OpenRouter (Claude) for the suggestion ---
async function callOpenRouterForFood(prompt) {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}` },
            body: JSON.stringify({
                model: "anthropic/claude-3-haiku",
                messages: [{ "role": "user", "content": prompt }]
            })
        });
        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`OpenRouter API error: ${JSON.stringify(errorBody)}`);
        }
        const result = await response.json();
        return JSON.parse(result.choices[0].message.content);
    } catch (error) {
        console.error("OpenRouter suggestion failed:", error.message);
        return null;
    }
}


export default async function handler(req, res) {
    const { text: userInput, ingredients } = req.body;
    if (!userInput) return res.status(400).json({ message: 'User input is required.' });

    try {
        // --- Run the expert consultation in parallel ---
        console.log("Starting expert panel consultation for mood analysis...");
        const [robertaMood, geminiMood, claudeMood] = await Promise.all([
            getRobertaMood(userInput),
            getGeminiMood(userInput),
            getClaudeMood(userInput)
        ]);
        console.log(`Expert Opinions -> RoBERTa: ${robertaMood}, Gemini: ${geminiMood}, Claude: ${claudeMood}`);

        // --- Judge the winner by majority vote ---
        const moods = [robertaMood, geminiMood, claudeMood].filter(m => m !== 'unknown');
        const moodCounts = moods.reduce((acc, mood) => { acc[mood] = (acc[mood] || 0) + 1; return acc; }, {});
        let finalJudgedMood = robertaMood;
        let maxCount = 0;
        for (const mood in moodCounts) {
            if (moodCounts[mood] > maxCount) {
                finalJudgedMood = mood;
                maxCount = moodCounts[mood];
            }
        }
        console.log(`Final Judged Mood (by majority vote): ${finalJudgedMood}`);

        // --- THIS IS THE CORRECTED PROMPT ---
        const prompt = `
            You are MoodBite, an expert Indian chef.
            A user is feeling: "${finalJudgedMood}".
            They have these ingredients available: [${ingredients && ingredients.length > 0 ? ingredients.join(', ') : 'None specified'}].
            
            Your task is to respond with a JSON object with these exact keys: "predictedMood", "suggestedFood", "reason", "confidenceScore", "otherSuggestions".

            - "predictedMood": The final mood determination: "${finalJudgedMood}".
            - "suggestedFood": A string for the single BEST food suggestion.
            - "reason": A detailed string explaining why the main suggestion is a good choice.
            - "confidenceScore": An INTEGER between 80 and 95.
            - "otherSuggestions": A JSON array of 2-3 other creative food ideas (strings).
            
            IMPORTANT: Your suggestions must be realistic and varied. Include comforting, indulgent, or sweet foods and drinks where appropriate.
        `;
        
        // --- Fallback Logic ---
        console.log("Attempting to get suggestion from primary model (Gemini)...");
        let result = await callGeminiForFood(prompt);
        let source = "Gemini";

        if (!result) {
            console.log("Primary model failed. Attempting fallback model (Claude via OpenRouter)...");
            result = await callOpenRouterForFood(prompt);
            source = "Claude 3 Haiku (via OpenRouter)";
        }
        // --- End of Fallback Logic ---

        if (!result) {
            throw new Error("All suggestion models failed to provide a valid response.");
        }
        
        console.log(`Suggestion received successfully from ${source}.`);
        // Add the source to the final response
        result.source = source;
        res.status(200).json(result);

    } catch (e) {
        console.error("----------- DETAILED ERROR -----------", e);
        res.status(500).json({
            predictedMood: "Error",
            suggestedFood: "Request Failed",
            reason: "Sorry, the AI assistants failed to respond. Please try again in a moment.",
            confidenceScore: 0,
            otherSuggestions: []
        });
    }
}
