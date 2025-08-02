// components/TypingIndicator.js
import { motion } from 'framer-motion';

const containerVariants = {
    start: { transition: { staggerChildren: 0.1 } },
    end: { transition: { staggerChildren: 0.1 } },
};

const circleVariants = {
    start: { y: "0%" },
    end: { y: "100%" },
};

const circleTransition = {
    duration: 0.4,
    repeat: Infinity,
    repeatType: 'reverse',
    ease: 'easeInOut'
};

export default function TypingIndicator() {
    return (
        <div className="flex justify-start">
            <motion.div 
                className="flex items-end space-x-1.5 p-4"
                variants={containerVariants}
                initial="start"
                animate="end"
            >
                <motion.span className="h-2 w-2 bg-gray-500 rounded-full" variants={circleVariants} transition={circleTransition} />
                <motion.span className="h-2 w-2 bg-gray-500 rounded-full" variants={circleVariants} transition={circleTransition} />
                <motion.span className="h-2 w-2 bg-gray-500 rounded-full" variants={circleVariants} transition={circleTransition} />
            </motion.div>
        </div>
    );
}