// pages/index.js (FINAL - with Modern Input Bar)
import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BotResponseCard from '../components/BotResponseCard';
import TypingIndicator from '../components/TypingIndicator';
import InputOverlay from '../components/InputOverlay';
import Loader from '../components/Loader';
import ModernInputBar from '../components/ModernInputBar'; // Import the new component

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
            if (data.suggestedFood) {
                speak(`${data.suggestedFood}. ${data.reason}`);
            }
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

    const UserAvatar = () => ( <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold flex-shrink-0"> A </div> );

    const WelcomeScreen = ({ onPromptClick }) => (
        <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text mb-4">
                Hello, Ayush & Lucky
            </h1>
            <p className="text-xl text-gray-400 mb-12">How can I help you today?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <button onClick={() => onPromptClick("I'm feeling stressed after a long day of work")} className="bg-gray-800 p-4 rounded-lg text-left hover:bg-gray-700 transition-colors">
                    <p className="font-semibold">Suggest a comforting meal</p>
                    <p className="text-sm text-gray-400">for a stressful day</p>
                </button>
                <button onClick={() => onPromptClick("It's raining and I want something cozy to eat")} className="bg-gray-800 p-4 rounded-lg text-left hover:bg-gray-700 transition-colors">
                    <p className="font-semibold">Find a rainy day recipe</p>
                    <p className="text-sm text-gray-400">that feels warm and cozy</p>
                </button>
            </div>
        </div>
    );

    if (isAppLoading) {
        return <Loader />;
    }

    return (
        <div className="w-full h-screen bg-black flex flex-col text-white" onClick={handleInterrupt}>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] -z-10"></div>
            
            <header className="relative z-20 p-4 text-center flex-shrink-0">
                <h1 className="text-xl font-bold tracking-wider">MOODBITE AI</h1>
            </header>
            
            <main className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto p-4">
                 {messages.length === 0 ? (
                    <WelcomeScreen onPromptClick={(prompt) => handleChatSubmit(null, prompt)} />
                ) : (
                    <div className="space-y-8">
                        {messages.map((msg, index) => (
                             <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'user' ? (
                                    <div className="flex items-start space-x-4">
                                        <div className="max-w-xl p-4 rounded-2xl bg-gray-700 shadow-lg">{msg.content}</div>
                                        <UserAvatar />
                                    </div>
                                ) : (
                                    <BotResponseCard response={msg.content} />
                                )}
                            </div>
                        ))}
                        {isLoading && <TypingIndicator />}
                        <div ref={chatEndRef} />
                    </div>
                )}
            </main>
            
            <footer className="relative z-20 w-full max-w-3xl mx-auto p-4 pt-2">
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
                                    <button onClick={() => removePreview(p.id)} className="absolute top-0.5 right-0.5 bg-black/50 rounded-full p-0 text-white leading-none hidden group-hover:block">&times;</button>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
                <ModernInputBar
                    textInput={textInput}
                    setTextInput={setTextInput}
                    handleChatSubmit={handleChatSubmit}
                    handleVoiceClick={handleVoiceClick}
                    handleImageUpload={handleImageUpload}
                    handleManualEntryClick={handleManualEntryClick}
                    assistantState={assistantState}
                    isLoading={isLoading}
                />
                {inputMode && ( <InputOverlay mode={inputMode} onSubmit={handleOverlaySubmit} onClose={() => setInputMode(null)} /> )}
            </footer>
        </div>
    );
}
