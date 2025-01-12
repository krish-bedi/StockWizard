import asyncHandler from 'express-async-handler';
import axios from 'axios';

// @desc    Search for stock symbols
// @route   GET /api/app/search
// @access  Public
const searchStocks = asyncHandler(async (req, res) => {
    const { q } = req.query;

  if (!q) {
    res.status(400);
    throw new Error('Search query is required');
  }

  try {
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v1/finance/search`,
      {
        params: {
          q,
          quotesCount: 6, // Number of quotes to return
          newsCount: 0, // Number of news articles to return
          enableFuzzyQuery: false, 
          quotesQueryId: 'tss_match_phrase_query' // Unique identifier for the query
        },
        headers: {
          'User-Agent': 'Mozilla/5.0',
        }
      }
    );

    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching stock data:', error.response?.data || error.message);
    res.status(500);
    throw new Error('Failed to fetch stock data');
  }
});

export { searchStocks };