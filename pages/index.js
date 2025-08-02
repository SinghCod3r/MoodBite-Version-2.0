// pages/index.js (Final and Complete)
import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BotResponseCard from '../components/BotResponseCard';
import TypingIndicator from '../components/TypingIndicator';
import InputOverlay from '../components/InputOverlay';
import Textarea from 'react-textarea-autosize';
import Loader from '../components/Loader';

export default function HomePage() {
    const [isAppLoading, setIsAppLoading] = useState(true);
    const [ingredients, setIngredients] = useState([]);
    const [messages, setMessages] = useState([]); 
    const [textInput, setTextInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [assistantState, setAssistantState] = useState('idle');
    const [currentLang, setCurrentLang] = useState('en-IN');
    const [filePreviews, setFilePreviews] = useState([]);
    const [inputMode, setInputMode] = useState(null);
    const recognitionRef = useRef(null);
    const voices = useRef([]);
    const chatEndRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => { setIsAppLoading(false); }, 5000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);
    
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const loadVoices = () => { voices.current = window.speechSynthesis.getVoices(); };
        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = currentLang;
        recognition.onresult = (event) => {
            let interim_transcript = '', final_transcript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) final_transcript += event.results[i][0].transcript;
                else interim_transcript += event.results[i][0].transcript;
            }
            setTextInput(final_transcript + interim_transcript);
        };
        recognition.onerror = (event) => console.error("Speech recognition error:", event.error);
        recognition.onstart = () => setAssistantState('listening');
        recognition.onend = () => setAssistantState('idle');
        recognitionRef.current = recognition;
    }, [currentLang]);
    
    const speak = (text) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        setAssistantState('speaking');
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentLang;
        const voice = voices.current.find(v => v.lang === currentLang && v.name.includes('Google'));
        if (voice) utterance.voice = voice;
        utterance.onend = () => setAssistantState('idle');
        window.speechSynthesis.speak(utterance);
    };

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        if (!files || files.length === 0) return;
        const newPreviews = files.map(file => ({
            id: `${file.name}-${Date.now()}`, file,
            previewUrl: URL.createObjectURL(file), status: 'uploading', ingredients: []
        }));
        setFilePreviews(prev => [...prev, ...newPreviews]);
        newPreviews.forEach(preview => {
            fetch('/api/identifyIngredients', {
                method: 'POST', headers: { 'Content-Type': preview.file.type }, body: preview.file,
            })
            .then(res => { if (!res.ok) throw new Error('Analysis failed'); return res.json(); })
            .then(data => {
                setIngredients(prev => [...new Set([...prev, ...data.ingredients])]);
                setFilePreviews(prev => prev.map(p => p.id === preview.id ? { ...p, status: 'success', ingredients: data.ingredients } : p));
            })
            .catch(err => {
                console.error(err);
                setFilePreviews(prev => prev.map(p => p.id === preview.id ? { ...p, status: 'error' } : p));
            });
        });
    };
    
    const handleChatSubmit = async (e, textOverride = null) => {
        if (e) e.preventDefault();
        const textToSubmit = textOverride || textInput;
        if (!textToSubmit.trim()) return;
        const userMessage = { role: 'user', content: textToSubmit };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setTextInput('');
        setFilePreviews([]);
        try {
            const response = await fetch('/api/suggestFood', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: textToSubmit, ingredients }),
            });
            const data = await response.json();
            const botMessage = { role: 'bot', content: data };
            setMessages(prev => [...prev, botMessage]);
            speak(`${data.suggestedFood}. ${data.reason}`);
        } catch (error) {
            const errorContent = {
                predictedMood: "Error", suggestedFood: "Request Failed",
                reason: "Sorry, the AI assistant failed to respond. Please try again.",
                confidenceScore: 0
            };
            const errorMessage = { role: 'bot', content: errorContent };
            setMessages(prev => [...prev, errorMessage]);
            speak(errorContent.reason);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVoiceClick = (e) => {
        e.stopPropagation();
        if (!recognitionRef.current) return;
        if (assistantState === 'listening') {
            recognitionRef.current.stop();
        } else {
            setTextInput('');
            setFilePreviews([]);
            setIngredients([]);
            recognitionRef.current.start();
        }
    };

    const handleInterrupt = () => {
        if (assistantState === 'speaking') {
            window.speechSynthesis.cancel();
            setAssistantState('idle');
        }
    };
    
    const removePreview = (idToRemove) => {
        setFilePreviews(prev => prev.filter(p => p.id !== idToRemove));
    };

    const handleManualEntryClick = () => {
        if (assistantState === 'idle') setInputMode('ingredients');
    };

    const handleOverlaySubmit = (value) => {
        if (inputMode === 'ingredients') {
            const ingredientsArray = value.split(',').map(item => item.trim().toLowerCase()).filter(Boolean);
            setIngredients(prev => [...new Set([...prev, ...ingredientsArray])]);
        }
        setInputMode(null);
    };

    if (isAppLoading) {
        return <Loader />;
    }

    return (
        <div className="w-full h-screen bg-black flex flex-col text-white" onClick={handleInterrupt}>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] -z-10"></div>
            
            <header className="relative z-20 p-4 border-b border-gray-700/50 text-center backdrop-blur-sm flex-shrink-0">
                <h1 className="text-2xl font-bold tracking-wider">MOODBITE AI</h1>
                <p className="text-xs text-gray-400 mt-1">Final Year Project By Ayush and Lucky</p>
            </header>
            
            <main className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'user' ? ( <div className="max-w-lg p-3 rounded-2xl bg-blue-600 shadow-lg">{msg.content}</div> ) : ( <BotResponseCard response={msg.content} /> )}
                    </div>
                ))}
                {isLoading && <TypingIndicator />}
                <div ref={chatEndRef} />
            </main>
            
            <footer className="relative z-20 w-full max-w-3xl mx-auto p-2 sm:p-4 sm:pt-2" onClick={e => e.stopPropagation()}>
                <AnimatePresence>
                    {filePreviews.length > 0 && (
                        <motion.div 
                            className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mb-2"
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                            {filePreviews.map(p => (
                                <motion.div key={p.id} className="relative aspect-square rounded-lg overflow-hidden group" layout>
                                    <img src={p.previewUrl} className="w-full h-full object-cover" alt="Ingredient preview" />
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        {p.status === 'uploading' && <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>}
                                        {p.status === 'success' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
                                        {p.status === 'error' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>}
                                    </div>
                                    {p.status === 'success' && p.ingredients.length > 0 && (
                                        <div className="absolute bottom-0 left-0 w-full p-1 bg-black/70 text-center"><p className="text-white text-[10px] truncate">{p.ingredients.join(', ')}</p></div>
                                    )}
                                    <button onClick={() => removePreview(p.id)} className="absolute top-0.5 right-0.5 bg-black/50 rounded-full p-0 text-white leading-none hidden group-hover:block">&times;</button>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
                <form onSubmit={handleChatSubmit} className="bg-gray-800/80 backdrop-blur-sm border border-gray-600/50 rounded-full p-2 flex items-center gap-2 shadow-lg">
                    <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2">
                       <label htmlFor="image-upload-input" className="p-2 rounded-full hover:bg-gray-700 cursor-pointer transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a3 3 0 006 0V7a1 1 0 112 0v4a5 5 0 01-10 0V7a3 3 0 013-3z" clipRule="evenodd" /></svg>
                        </label>
                        <input id="image-upload-input" type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                        <button type="button" onClick={handleManualEntryClick} className="p-2 rounded-full hover:bg-gray-700 cursor-pointer transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                    <Textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        className="flex-grow bg-transparent text-white placeholder-gray-400 focus:outline-none px-2 py-1.5 resize-none"
                        placeholder={assistantState === 'listening' ? "Listening..." : "Tell me how you're feeling..."}
                        disabled={isLoading}
                        maxRows={5}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChatSubmit(e); } }}
                    />
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <button type="button" onClick={handleVoiceClick} className={`p-2 rounded-full hover:bg-gray-700 transition-colors ${assistantState === 'listening' ? 'bg-red-600 hover:bg-red-700' : ''}`}>
                            {assistantState === 'listening' 
                                ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                : <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z"/><path d="M5.5 11.5a5.5 5.5 0 0011 0h-1.5a4 4 0 01-8 0H5.5z"/><path d="M3 10a1 1 0 001 1v1a7 7 0 0014 0v-1a1 1 0 10-2 0v1a5 5 0 01-10 0v-1a1 1 0 00-1-1z"/></svg>
                            }
                        </button>
                        <button type="submit" className="flex-shrink-0 px-3 sm:px-4 py-2 text-sm font-semibold rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                            <span className="hidden sm:inline">Send</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:hidden" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009.5 16.571V11.5a1 1 0 011-1h.043c.248 0 .45.223.497.472l.5 2.5a1 1 0 001.953.054l1.328-5.313a1 1 0 00-.5-1.157l-7-3.5z" /></svg>
                        </button>
                    </div>
                </form>
                {inputMode && ( <InputOverlay mode={inputMode} onSubmit={handleOverlaySubmit} onClose={() => setInputMode(null)} /> )}
            </footer>
        </div>
    );
}