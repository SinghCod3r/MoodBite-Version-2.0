# MoodBite AI - Food Recommendation System

A web application that suggests Indian food based on your mood using AI analysis.

**Live Demo:** [https://mood-bite-version-2-0.vercel.app/](https://mood-bite-version-2-0.vercel.app/)

## Features

- Text or voice mood input
- AI mood analysis using multiple models
- Ingredient photo recognition
- Indian food recommendations
- Voice feedback
- Mobile responsive

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **AI:** Google Gemini, HuggingFace, OpenRouter
- **Backend:** Next.js API Routes, Supabase

## Quick Start

```bash
git clone https://github.com/RISHABH4SAHNI/MoodBite-Version-2.0.git
cd MoodBite-Version-2.0
npm install
npm run dev
```

## Environment Setup

Create `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key
HUGGING_FACE_API_TOKEN=your_hugging_face_token
OPENROUTER_API_KEY=your_openrouter_key
GOOGLE_SEARCH_API_KEY=your_google_search_key
SEARCH_ENGINE_ID=your_search_engine_id
```

**Get API Keys:**
- [Google AI](https://makersuite.google.com/app/apikey)
- [HuggingFace](https://huggingface.co/settings/tokens)
- [OpenRouter](https://openrouter.ai/)
- [Google Search](https://developers.google.com/custom-search/v1/overview)

## API Endpoints

### POST /api/suggestFood
```json
// Request
{
  "text": "I'm feeling stressed",
  "ingredients": ["rice", "dal"]
}

// Response
{
  "predictedMood": "stressed",
  "suggestedFood": "Dal Khichdi",
  "reason": "Comforting meal for stress relief",
  "confidenceScore": 92
}
```

### POST /api/identifyIngredients
```json
// Request: Image file

// Response
{
  "ingredients": ["tomatoes", "onions"]
}
```

## Project Structure

```
├── components/          # React components
├── pages/
│   ├── api/            # API endpoints
│   └── index.js        # Main page
├── public/             # Static files
└── styles/             # CSS files
```

## How It Works

1. User inputs mood via text/voice or uploads ingredient photos
2. System analyzes mood using AI models (RoBERTa, Gemini, Claude)
3. Recommends Indian dishes based on mood and available ingredients
4. Provides explanation and alternative suggestions

## Contributing

1. Fork the repository
2. Create feature branch
3. Submit pull request

```
MoodBite-Version-2.0/
├── components/
│   ├── BotResponseCard.js      # Displays AI responses
│   ├── ModernInputBar.js       # User input interface
│   ├── TypingIndicator.js      # Loading animations
│   └── Loader.js               # App loading screen
├── pages/
│   ├── api/
│   │   ├── suggestFood.js      # Main recommendation logic
│   │   ├── identifyIngredients.js  # Image analysis
│   │   └── generateFoodImage.js    # Food image search
│   ├── _app.js                 # App configuration
│   ├── _document.js            # HTML document structure
│   └── index.js                # Main application page
├── public/                     # Static assets
├── styles/                     # Stylesheets
└── package.json                # Dependencies

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

Live Project URL LInk --> https://mood-bite-version-2-0.vercel.app/
