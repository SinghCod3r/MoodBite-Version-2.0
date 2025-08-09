// pages/api/generateFoodImage.js (FINAL - Google Image Search)

export default async function handler(req, res) {
    const { foodName } = req.query;
    if (!foodName) {
        return res.status(400).json({ error: 'foodName parameter is required' });
    }

    const API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
    const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID;
    // We make the query very specific for better results
    const query = `photograph of ${foodName} indian dish`;
    
    const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&searchType=image&num=1`;

    try {
        const searchResponse = await fetch(url);
        if (!searchResponse.ok) {
            throw new Error(`Google Search API failed: ${await searchResponse.text()}`);
        }

        const searchResult = await searchResponse.json();
        
        if (!searchResult.items || searchResult.items.length === 0) {
            throw new Error("No image found for this food.");
        }

        // Get the URL of the first and best image result
        const imageUrl = searchResult.items[0].link;

        // Send the URL back to the frontend
        res.status(200).json({ imageUrl });

    } catch (error) {
        console.error("Image search failed:", error);
        res.status(500).json({ error: 'Failed to find an image' });
    }
}
