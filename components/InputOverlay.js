// components/InputOverlay.js
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function InputOverlay({ mode, onSubmit, onClose }) {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(inputValue);
    };

    const title = mode === 'text' ? 'How are you feeling?' : 'What ingredients do you have?';
    const placeholder = mode === 'text' ? 'I feel happy and excited...' : 'e.g., onion, tomato, paneer';

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/70 flex items-center justify-center z-50"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    className="bg-gray-800 border border-purple-500/50 rounded-2xl p-8 w-full max-w-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={placeholder}
                            className="w-full h-24 p-3 rounded-lg bg-gray-900 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
                            autoFocus
                        />
                        <div className="flex justify-end mt-6">
                            <motion.button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 text-sm font-semibold rounded-full text-gray-300 hover:bg-gray-700"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                type="submit"
                                className="ml-4 px-6 py-2 text-sm font-semibold rounded-full bg-purple-600 text-white hover:bg-purple-700"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Submit
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}