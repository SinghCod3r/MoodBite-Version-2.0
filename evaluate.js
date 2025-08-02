// evaluate.js (FINAL - Self-Contained)
// NOTE: This script does not require any external packages to be installed.

const testData = [
    { sentence: "I am so happy, my project is finally working!", true_mood: "joy" },
    { sentence: "This is amazing, thank you so much for your help.", true_mood: "admiration" },
    { sentence: "I feel very down and lonely today.", true_mood: "sadness" },
    { sentence: "My computer crashed and I lost all my work, I'm so angry.", true_mood: "anger" },
    { sentence: "I'm not sure what to do, I'm really worried about the deadline.", true_mood: "fear" },
    { sentence: "Wow, I was not expecting that at all!", true_mood: "surprise" },
    { sentence: "I'm so grateful for my friends and family.", true_mood: "gratitude" },
    { sentence: "I'm so frustrated with this bug, it won't go away.", true_mood: "anger" },
    { sentence: "It was a very calm and peaceful evening.", true_mood: "neutral" },
    { sentence: "I just feel so excited for the trip next week!", true_mood: "excitement" },
    { sentence: "I love this new song, it's beautiful.", true_mood: "love" },
    { sentence: "I'm disappointed with the result.", true_mood: "disappointment" },
];

const emotionGroups = {
    joy: ['joy', 'excitement', 'love', 'admiration', 'gratitude'],
    sadness: ['sadness', 'disappointment', 'grief'],
    anger: ['anger', 'annoyance', 'frustration'],
    fear: ['fear', 'nervousness', 'remorse'],
    surprise: ['surprise', 'curiosity'],
    neutral: ['neutral', 'optimism']
};

const groupLookup = {};
for (const group in emotionGroups) {
    emotionGroups[group].forEach(emotion => {
        groupLookup[emotion] = group;
    });
}

async function getPrediction(sentence) {
    try {
        const response = await fetch('http://localhost:3000/api/suggestFood', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: sentence }),
        });
        if (!response.ok) return 'error';
        const data = await response.json();
        // Handle cases where the response might be malformed
        return data && data.predictedMood ? data.predictedMood.toLowerCase() : 'error';
    } catch (error) {
        console.error(`Error fetching prediction for: "${sentence}"`, error.message);
        return 'error';
    }
}

function calculateMetrics(y_true, y_pred) {
    const labels = [...new Set(y_true)];
    let strictCorrect = 0;
    let nuancedCorrect = 0;
    const report = {};

    for (let i = 0; i < y_true.length; i++) {
        // Strict Accuracy
        if (y_true[i] === y_pred[i]) {
            strictCorrect++;
        }
        // Nuanced Accuracy
        const trueGroup = groupLookup[y_true[i]];
        const predGroup = groupLookup[y_pred[i]];
        if ((trueGroup && predGroup && trueGroup === predGroup) || y_true[i] === y_pred[i]) {
            nuancedCorrect++;
        }
    }

    const strictAccuracy = (strictCorrect / y_true.length) * 100;
    const nuancedAccuracy = (nuancedCorrect / y_true.length) * 100;

    labels.forEach(label => {
        let tp = 0, fp = 0, fn = 0;
        for (let i = 0; i < y_true.length; i++) {
            if (y_pred[i] === label && y_true[i] === label) tp++;
            if (y_pred[i] === label && y_true[i] !== label) fp++;
            if (y_pred[i] !== label && y_true[i] === label) fn++;
        }
        
        const precision = tp / (tp + fp) || 0;
        const recall = tp / (tp + fn) || 0;
        const f1 = 2 * (precision * recall) / (precision + recall) || 0;
        
        report[label] = {
            precision: precision.toFixed(2),
            recall: recall.toFixed(2),
            'f1-score': f1.toFixed(2),
            support: tp + fn,
        };
    });

    return { strictAccuracy, nuancedAccuracy, report };
}

async function runEvaluation() {
    console.log("Starting model evaluation...");
    console.log("Please ensure your main app is running with 'npm run dev'");
    
    const y_true = [];
    const y_pred = [];

    await Promise.all(testData.map(async (item) => {
        const prediction = await getPrediction(item.sentence);
        if (prediction !== 'error') {
            y_true.push(item.true_mood);
            y_pred.push(prediction);
            console.log(`- Tested: "${item.sentence.substring(0, 30)}..." -> Pred: ${prediction} (Actual: ${item.true_mood})`);
        }
    }));
    
    console.log("\n--- Evaluation Complete ---");
    
    if (y_true.length > 0) {
        const { strictAccuracy, nuancedAccuracy, report } = calculateMetrics(y_true, y_pred);
        console.log(`\nStrict Accuracy (exact match): ${strictAccuracy.toFixed(2)}%`);
        console.log(`Nuanced Accuracy (emotion group match): ${nuancedAccuracy.toFixed(2)}%\n`);

        console.log("Detailed Classification Report (Strict):");
        console.table(report);
    } else {
        console.log("Could not get any successful predictions to generate a report.");
    }
}

runEvaluation();