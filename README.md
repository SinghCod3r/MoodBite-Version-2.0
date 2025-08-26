# MoodBite AI

MoodBite AI suggests Indian food based on your mood. Tell the app how you feel, and it recommends dishes that match your emotional state.

Live demo: https://mood-bite-version-2-0.vercel.app/

## What it does

The app takes input about your current mood and suggests Indian food that fits how you're feeling. For example, if you're stressed, it might suggest comfort food like khichdi. If you're happy, it might recommend something celebratory.

## Features

- Text input for describing your mood
- Voice input support
- Photo upload to identify ingredients you have
- Food suggestions based on mood analysis
- Voice feedback that reads suggestions aloud
- Works on mobile and desktop

## How it works

1. You tell the app how you feel (typing, speaking, or uploading ingredient photos)
2. The app analyzes your mood using AI models
3. It suggests Indian dishes that match your mood
4. You get explanations for why each dish was recommended

## Tech used

- Next.js and React for the website
- Google Gemini AI for understanding mood and images
- HuggingFace AI models for emotion detection
- Tailwind CSS for styling
- Vercel for hosting

## Setup

1. Clone this repository
```bash
git clone https://github.com/RISHABH4SAHNI/MoodBite-Version-2.0.git
cd MoodBite-Version-2.0
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
Create a file called `.env.local` and add your API keys:

```env
GEMINI_API_KEY=your_key_here
HUGGING_FACE_API_TOKEN=your_token_here
OPENROUTER_API_KEY=your_key_here
GOOGLE_SEARCH_API_KEY=your_key_here
SEARCH_ENGINE_ID=your_id_here
```

4. Start the development server
```bash
npm run dev
```

5. Open http://localhost:3000 in your browser

## Getting API keys

You need API keys from these services:
- Google AI: https://makersuite.google.com/app/apikey
- HuggingFace: https://huggingface.co/settings/tokens
- OpenRouter: https://openrouter.ai/
- Google Search: https://developers.google.com/custom-search/v1/overview

## API endpoints

### POST /api/suggestFood
Send your mood and get food suggestions.

Request:
```json
{
  "text": "I feel stressed",
  "ingredients": ["rice", "dal"]
}
```

Response:
```json
{
  "predictedMood": "stressed",
  "suggestedFood": "Khichdi",
  "reason": "Comfort food that helps with stress",
  "confidenceScore": 85
}
```

### POST /api/identifyIngredients
Upload a photo to identify ingredients.
```json
{
  "ingredients": ["tomatoes", "onions"]
}
```

## Project structure

```
├── components/    # React components
├── pages/         # Website pages
│   └── api/       # Backend functions
├── public/        # Images and static files
└── styles/        # CSS files
