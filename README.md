# MoodBite

Tell us how you're feeling, and we'll suggest the perfect Indian dish to match your mood.

**Try it here:** https://mood-bite-version-2-0.vercel.app/

## About

Food affects our emotions, and our emotions affect what we crave. MoodBite bridges this connection by analyzing how you feel and recommending Indian dishes that perfectly complement your emotional state.

Stressed? We might suggest comforting khichdi. Celebrating something? How about festive biryani. Feeling nostalgic? Perhaps some home-style dal chawal.

## What You Can Do

- Describe your mood in text or speak it aloud
- Upload photos of ingredients you have at home
- Get personalized Indian food recommendations
- Listen to suggestions read back to you
- Use it anywhere - phone, tablet, or computer

## How It Works

It's simple: share your mood, get your dish, understand why it fits.

The app uses AI to understand the nuances of your emotional state and matches it with dishes from Indian cuisine that historically complement those feelings.

## Running Locally

**Step 1: Get the code**
```bash
git clone https://github.com/RISHABH4SAHNI/MoodBite-Version-2.0.git
cd MoodBite-Version-2.0
```

**Step 2: Install what you need**
```bash
npm install
```

**Step 3: Set up your API keys**
Create a file named `.env.local` in the root folder:

```env
GEMINI_API_KEY=your_key_here
HUGGING_FACE_API_TOKEN=your_token_here
OPENROUTER_API_KEY=your_key_here
GOOGLE_SEARCH_API_KEY=your_key_here
SEARCH_ENGINE_ID=your_id_here
```

**Step 4: Start the app**
```bash
npm run dev
```

**Step 5: Visit http://localhost:3000**

## Getting Your API Keys

You'll need free accounts with these services:

- **Google Gemini:** Visit https://makersuite.google.com/app/apikey
- **HuggingFace:** Go to https://huggingface.co/settings/tokens
- **OpenRouter:** Sign up at https://openrouter.ai/
- **Google Search:** Get keys at https://developers.google.com/custom-search/v1/overview

## Built With

This project uses Next.js for the web interface, Google's Gemini AI for understanding your mood and analyzing ingredient photos, HuggingFace models for emotion detection, and Tailwind CSS for a clean design.

## For Developers

The app exposes two main API endpoints:

**POST /api/suggestFood** - Send mood text and optional ingredients to get food recommendations

```
├── components/    # React components
├── pages/         # Website pages
│   └── api/       # Backend functions
├── public/        # Images and static files
└── styles/        # CSS files
