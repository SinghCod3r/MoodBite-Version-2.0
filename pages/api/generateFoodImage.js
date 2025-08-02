// pages/api/generateFoodImage.js (FINAL STABLE - Pexels API)

export default async function handler(req, res) {
    const { foodName } = req.query;
    if (!foodName) {
        return res.status(400).json({ error: 'foodName parameter is required' });
    }

    const query = `${foodName} indian food`;
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`;

    try {
        const pexelsResponse = await fetch(url, {
            headers: {
                Authorization: process.env.PEXELS_API_KEY,
            },
        });

        if (!pexelsResponse.ok) {
            throw new Error(`Pexels API failed: ${await pexelsResponse.text()}`);
        }

        const result = await pexelsResponse.json();

        if (!result.photos || result.photos.length === 0) {
            return res.status(404).json({ error: 'No image found' });
        }

        const imageUrl = result.photos[0].src.large;
        res.status(200).json({ imageUrl });

    } catch (error) {
        console.error("Image search failed:", error);
        res.status(500).json({ error: 'Failed to find an image' });
    }
}