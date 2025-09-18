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
                            {/* Attach Icon - Paperclip */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                            </svg>
                        </label>
                        <input id="image-upload-input" type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                        
                        <button type="button" onClick={handleManualEntryClick} className="p-2 rounded-full hover:bg-gray-700 cursor-pointer transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Voice Button - Better Microphone Icon */}
                        <button type="button" onClick={handleVoiceClick} className={`p-2 rounded-full hover:bg-gray-700 transition-colors group ${assistantState === 'listening' ? 'bg-red-600 hover:bg-red-700' : ''}`}>
                            {assistantState === 'listening' 
                                ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="6" y="6" width="12" height="12" rx="2" ry="2"/>
                                    <line x1="8" y1="12" x2="16" y2="12"/>
                                  </svg>
                                : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                                    <line x1="12" y1="19" x2="12" y2="23"/>
                                    <line x1="8" y1="23" x2="16" y2="23"/>
                                  </svg>
                            }
                        </button>
                        {/* Send Button - Enhanced Paper Airplane Icon */}
                        <button type="submit" className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:bg-gray-600 group" disabled={!textInput.trim() || isLoading}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"/>
                                <polygon points="22,2 15,22 11,13 2,9"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
