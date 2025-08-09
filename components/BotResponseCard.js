// components/BotResponseCard.js (Final Polished & Responsive Version)
import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const ImagePlaceholder = () => (
    <div className="w-full h-32 sm:h-40 bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="w-6 h-6 border-t-2 border-gray-500 rounded-full animate-spin"></div>
    </div>
);

// A component for the "Other Suggestions" list
const OtherSuggestionsList = ({ items }) => {
    if (!Array.isArray(items) || items.length === 0) {
        return null;
    }
    return (
        <div className="pt-2 mt-2 border-t border-gray-600/50">
            <h3 className="text-xs font-semibold text-gray-400 mb-2">Other ideas to try...</h3>
            <ul className="space-y-1">
                {items.map((item, index) => (
                    <motion.li 
                        key={item + index}
                        className="text-xs sm:text-sm text-gray-300"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        - {item.food || item}
                    </motion.li>
                ))}
            </ul>
        </div>
    );
};


export default function BotResponseCard({ response }) {
    const { predictedMood, suggestedFood, reason, confidenceScore, source, otherSuggestions } = response;
    const [isExpanded, setIsExpanded] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageLoading, setImageLoading] = useState(true);

    const count = useMotionValue(0);
    const rounded = useTransform(count, latest => Math.round(latest));
    const targetScore = typeof confidenceScore === 'number' && confidenceScore < 2 ? confidenceScore * 100 : (confidenceScore || 0);

    useEffect(() => {
        const controls = animate(count, targetScore, { duration: 2, ease: "easeOut" });
        
        if (suggestedFood && !suggestedFood.toLowerCase().includes("failed") && !suggestedFood.toLowerCase().includes("error")) {
            setImageLoading(true);
            fetch(`/api/generateFoodImage?foodName=${encodeURIComponent(suggestedFood)}`)
                .then(res => {
                    if (!res.ok) throw new Error("Image not found");
                    return res.json();
                })
                .then(data => {
                    if (data.imageUrl) {
                        setImageUrl(data.imageUrl);
                    } else {
                        setImageLoading(false);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    setImageLoading(false);
                });
        } else {
            setImageLoading(false);
        }

        return () => controls.stop();
    }, [suggestedFood]);

    return (
        <div className="flex items-start space-x-3 w-full max-w-lg">
            {/* Gemini-style Avatar */}
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M11.082 13.918L10 16.5l-1.082-2.582L6.336 13l2.582-1.082L10 9.336l1.082 2.582L13.664 13l-2.582 1.082zm6.664.5L16.5 11.836l-1.246-2.582L12.672 10.5l2.582 1.246L16.5 14.33l1.246-2.584L20.328 10.5l-2.582-1.246zM12 2a10 10 0 100 20 10 10 0 000-20z"></path></svg>
            </div>
            <div className="flex-grow space-y-2">
                {imageLoading && <ImagePlaceholder />}
                {imageUrl && (
                    <img src={imageUrl} alt={suggestedFood} className="w-full h-auto max-h-64 object-cover rounded-lg"
                        onLoad={() => setImageLoading(false)}
                        onError={() => { setImageUrl(null); setImageLoading(false); }}
                    />
                )}
                <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
                    <div>
                        <p className="text-xs text-gray-400">Detected Mood</p>
                        <p className="text-md font-semibold text-white">{predictedMood}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                        <div className="text-center sm:text-left">
                            <p className="text-xs text-gray-400">Suggestion</p>
                            <p className="text-lg sm:text-xl font-bold">{suggestedFood}</p>
                        </div>
                        <div className="text-center bg-gray-900/50 p-1.5 rounded-lg">
                            <p className="text-[10px] text-gray-400">Confidence</p>
                            <motion.p className="text-xl sm:text-2xl font-mono font-bold text-green-400">{rounded}</motion.p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 mb-1">Reason</p>
                        <motion.p 
                            className="text-sm text-gray-300 overflow-hidden" 
                            animate={{ height: isExpanded ? 'auto' : '36px' }}
                            initial={{ height: '36px' }}
                        >
                            {reason}
                        </motion.p>
                        <button 
                            onClick={() => setIsExpanded(!isExpanded)} 
                            className="text-xs text-blue-400 hover:underline mt-1"
                        >
                            {isExpanded ? 'Show Less' : 'Show More...'}
                        </button>
                    </div>

                    <OtherSuggestionsList items={otherSuggestions} />

                    {source && (
                        <div className="text-right text-xs text-gray-500 pt-2 border-t border-gray-600/50">
                            Powered by: {source}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
