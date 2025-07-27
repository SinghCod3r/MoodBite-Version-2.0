// pages/api/suggestFood.js (with better error logging)
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const HUGGING_FACE_API_TOKEN = process.env.HUGGING_FACE_API_TOKEN;

async function getEmbedding(text) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
        {
            headers: {
                Authorization: `Bearer ${HUGGING_FACE_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ inputs: text, options: { wait_for_model: true } }),
        }
    );
    const result = await response.json();
    return result;
}

export default async function handler(req, res) {
    try { // We will try to run all the code below
        const { text: userInput } = req.body;

        const queryEmbedding = await getEmbedding(userInput);

        const { data: documents } = await supabase.rpc('match_documents', {
            query_embedding: queryEmbedding,
            match_threshold: 0.70,
            match_count: 2,
        });

        const context = documents?.map(d => d.content).join('\n\n---\n\n') || 'No specific context found.';

        // NEW, CORRECT LINE
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const prompt = `
            You are "MoodBite", a kind food suggestion assistant. A user is feeling this way: "${userInput}".
            Based ONLY on the following context, provide a thoughtful and comforting food suggestion.
            Explain why you are suggesting it. Be conversational.
            Context: ${context}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const suggestion = response.text();
        res.status(200).json({ suggestion });

    } catch (e) { // If anything in the 'try' block fails, this 'catch' block will run
        console.error("----------- DETAILED ERROR -----------");
        console.error(e); // This will print the true, detailed error to the terminal
        console.error("--------------------------------------");
        res.status(500).json({ message: "An error occurred. Check the server terminal for details." });
    }
}