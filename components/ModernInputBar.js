// components/ModernInputBar.js
import { AnimatePresence, motion } from 'framer-motion';
import Textarea from 'react-textarea-autosize';

export default function ModernInputBar({
    textInput,
    setTextInput,
    handleChatSubmit,
    handleVoiceClick,
    handleImageUpload,
    handleManualEntryClick,
    assistantState,
    isLoading
}) {
    return (
        <form onSubmit={handleChatSubmit} className="relative w-full max-w-2xl mx-auto">
            <div className="relative flex flex-col border border-black/10 dark:border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm shadow-lg">
                <Textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none px-5 py-4 resize-none"
                    placeholder={assistantState === 'listening' ? "Listening..." : "Tell me how you're feeling..."}
                    disabled={isLoading}
                    maxRows={5}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleChatSubmit(e);
                        }
                    }}
                />
                <div className="flex items-center justify-between p-2 border-t border-black/10 dark:border-white/10">
                    <div className="flex items-center gap-2">
                        <label htmlFor="image-upload-input" className="p-2 rounded-full hover:bg-gray-700 cursor-pointer transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a3 3 0 006 0V7a1 1 0 112 0v4a5 5 0 01-10 0V7a3 3 0 013-3z" clipRule="evenodd" /></svg>
                        </label>
                        <input id="image-upload-input" type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                        
                        <button type="button" onClick={handleManualEntryClick} className="p-2 rounded-full hover:bg-gray-700 cursor-pointer transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={handleVoiceClick} className={`p-2 rounded-full hover:bg-gray-700 transition-colors ${assistantState === 'listening' ? 'bg-red-600 hover:bg-red-700' : ''}`}>
                            {assistantState === 'listening' 
                                ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                : <svg className="w-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z"/><path d="M5.5 11.5a5.5 5.5 0 0011 0h-1.5a4 4 0 01-8 0H5.5z"/><path d="M3 10a1 1 0 001 1v1a7 7 0 0014 0v-1a1 1 0 10-2 0v1a5 5 0 01-10 0v-1a1 1 0 00-1-1z"/></svg>
                            }
                        </button>
                        <button type="submit" className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:bg-gray-600" disabled={!textInput.trim() || isLoading}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009.5 16.571V11.5a1 1 0 011-1h.043c.248 0 .45.223.497.472l.5 2.5a1 1 0 001.953.054l1.328-5.313a1 1 0 00-.5-1.157l-7-3.5z" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
