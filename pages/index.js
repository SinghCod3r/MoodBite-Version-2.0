// pages/index.js
import { useState } from 'react';

export default function HomePage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);
        setInput('');

        try {
            const response = await fetch('/api/suggestFood', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: input }),
            });

            if (!response.ok) throw new Error("API call failed");

            const data = await response.json();
            const botMessage = { role: 'bot', content: data.suggestion };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            const errorMessage = { role: 'bot', content: 'Sorry, I had trouble thinking of a suggestion. Please try again.' };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
            <header className="p-4 border-b border-gray-700 text-center">
                <h1 className="text-2xl font-bold">MoodBite AI 🍔</h1>
                <p className="text-sm text-gray-400">Tell me how you feel, and I will suggest something to eat.</p>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-lg p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'}`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex justify-start">
                        <div className="max-w-lg p-3 rounded-lg bg-gray-700 text-white">
                            Thinking...
                        </div>
                    </div>
                )}
            </main>

            <footer className="p-4 border-t border-gray-700">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        placeholder="I had a really stressful day at work..."
                        disabled={isLoading}
                    />
                </form>
            </footer>
        </div>
    );
}