# 🍽️ MoodBite AI - Intelligent Food Recommendation System

![MoodBite AI Banner](https://img.shields.io/badge/MoodBite-AI%20Powered-purple?style=for-the-badge&logo=react)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat-square&logo=vercel)](https://mood-bite-version-2-0.vercel.app/)

**MoodBite AI** is an innovative web application that combines artificial intelligence with culinary expertise to suggest the perfect Indian food based on your current mood. Using advanced sentiment analysis and machine learning, it understands how you're feeling and recommends comforting, energizing, or mood-appropriate dishes.

## 🌟 Live Demo

🚀 **[Try MoodBite AI Now](https://mood-bite-version-2-0.vercel.app/)**

## ✨ Key Features

### 🧠 **Multi-Modal Mood Analysis**
- **Text Input**: Describe your feelings in natural language
- **Voice Recognition**: Speak your mood with built-in speech recognition
- **AI Ensemble**: Uses RoBERTa, Google Gemini, and Claude AI for accurate mood detection
- **Majority Voting**: Combines multiple AI opinions for precise mood analysis

### 🍽️ **Intelligent Food Recommendations**
- **Indian Cuisine Focus**: Specialized in authentic Indian dishes
- **Mood-Based Suggestions**: Comfort food for stress, energizing meals for fatigue
- **Ingredient Integration**: Upload photos to identify available ingredients
- **Multiple Options**: Primary suggestion plus alternative recommendations
- **Confidence Scoring**: AI confidence levels for each suggestion

### 📸 **Image Recognition**
- **Ingredient Detection**: Upload photos of your pantry/fridge
- **Google Vision API**: Powered by Gemini Vision for accurate identification
- **Smart Integration**: Incorporates detected ingredients into recommendations

### 🎙️ **Voice Interaction**
- **Speech-to-Text**: Convert spoken words to text input
- **Text-to-Speech**: Hear recommendations read aloud
- **Multiple Languages**: Support for various language inputs
- **Hands-Free Operation**: Complete voice-controlled experience

### 🎨 **Modern User Experience**
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Dark Theme**: Easy on the eyes with beautiful gradients
- **Smooth Animations**: Framer Motion powered interactions
- **Real-time Updates**: Live typing indicators and status updates

## 🛠️ Technology Stack

### **Frontend**
- **[Next.js 15.4.4](https://nextjs.org/)** - React framework with SSR/SSG
- **[React 19.1.0](https://reactjs.org/)** - User interface library
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework

### **AI & Machine Learning**
- **[Google Generative AI](https://ai.google.dev/)** - Gemini models for text/vision
- **[Hugging Face Transformers](https://huggingface.co/)** - RoBERTa emotion classification
- **[OpenRouter](https://openrouter.ai/)** - Claude AI integration
- **[Google Custom Search](https://developers.google.com/custom-search/)** - Food image generation

### **Backend & APIs**
- **Next.js API Routes** - Serverless backend functions
- **[Supabase](https://supabase.com/)** - Database and authentication
- **Web Speech API** - Browser-native voice recognition/synthesis

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm**, **yarn**, **pnpm**, or **bun**
- API keys for various services (see [Environment Setup](#environment-setup))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/MoodBite-Version-2.0.git
   cd MoodBite-Version-2.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Fill in your API keys (see [Environment Setup](#environment-setup))

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Google AI (Gemini) - Required for mood analysis and vision
GEMINI_API_KEY=your_gemini_api_key_here

# Hugging Face - Required for RoBERTa emotion classification
HUGGING_FACE_API_TOKEN=your_hugging_face_token_here

# OpenRouter - Required for Claude AI integration
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Google Custom Search - Required for food image generation
GOOGLE_SEARCH_API_KEY=your_google_search_api_key_here
SEARCH_ENGINE_ID=your_search_engine_id_here

# Supabase - Optional for data storage
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### API Key Setup Guide

1. **Google AI (Gemini)**: [Get API Key](https://makersuite.google.com/app/apikey)
2. **Hugging Face**: [Create Account & Token](https://huggingface.co/settings/tokens)
3. **OpenRouter**: [Sign Up & Get Key](https://openrouter.ai/)
4. **Google Custom Search**: [Setup Guide](https://developers.google.com/custom-search/v1/overview)
5. **Supabase**: [Create Project](https://supabase.com/dashboard)

## 📡 API Endpoints

### `POST /api/suggestFood`
Analyzes mood and suggests appropriate food.

**Request Body:**
```json
{
  "text": "I'm feeling stressed after work",
  "ingredients": ["rice", "lentils", "tomatoes"]
}
```

**Response:**
```json
{
  "predictedMood": "stressed",
  "suggestedFood": "Dal Khichdi",
  "reason": "A comforting, easy-to-digest meal perfect for stress relief",
  "confidenceScore": 92,
  "otherSuggestions": ["Masala Chai", "Warm Milk with Turmeric"],
  "source": "Gemini"
}
```

### `POST /api/identifyIngredients`
Identifies ingredients from uploaded images.

**Request:** Image file (multipart/form-data)

**Response:**
```json
{
  "ingredients": ["tomatoes", "onions", "garlic", "ginger"]
}
```

## Getting Started

To start developing:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 🏗️ Project Structure

```
MoodBite-Version-2.0/
├── components/                 # Reusable React components
│   ├── BotResponseCard.js     # AI response display
│   ├── ModernInputBar.js      # User input interface
│   ├── TypingIndicator.js     # Loading animations
│   └── Loader.js              # App loading screen
├── pages/                     # Next.js pages and API routes
│   ├── api/                   # Backend API endpoints
│   │   ├── suggestFood.js     # Main recommendation logic
│   │   ├── identifyIngredients.js  # Image analysis
│   │   └── generateFoodImage.js    # Food image search
│   ├── _app.js                # App configuration
│   ├── _document.js           # HTML document structure
│   └── index.js               # Main application page
├── public/                    # Static assets
├── styles/                    # Global styles
└── package.json               # Dependencies and scripts

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
