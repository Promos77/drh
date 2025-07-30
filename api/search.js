const axios = require('axios');

module.exports = async (req, res) => {
    const { query } = req.query;
    const apiKey = process.env.SERPAPI_API_KEY;

    if (!apiKey) {
        console.error('Missing SERPAPI_API_KEY in environment variables');
        return res.status(500).json({ error: 'SerpApi API key not configured' });
    }

    try {
        const response = await axios.get('https://serpapi.com/search.json', {
            params: {
                engine: 'google_jobs',
                q: query,
                api_key: apiKey
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Search API error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        res.status(500).json({ 
            error: error.message,
            details: error.response?.data
        });
    }
};
