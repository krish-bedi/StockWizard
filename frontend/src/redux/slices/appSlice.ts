import { apiSlice } from "./apiSlice";

// App API Slice: Handle HTTP requests to /api/app
// All application feature API calls: search stocks, get stock data, etc.

const APP_URL = "/api/app";

interface StockSymbol {
  symbol: string;
  name: string;
  type: string;
  exchange?: string;
}

export const appApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    searchStocks: builder.query<StockSymbol[], string>({
      query: (searchTerm) => ({
        url: `${APP_URL}/search`,
        method: "GET",
        params: { q: searchTerm }
      }),

      transformResponse: (response: any) => {
        if (!response?.quotes) return [];
        
        return response.quotes
          .filter((quote: any) => 
            ["EQUITY", "ETF"].includes(quote.quoteType) 
            && !quote.symbol.includes('.')    // Excludes symbols like "BHP.AX" (Australian Stock Exchange)
                                              // or "RY.TO" (Toronto Exchange)

            && !quote.symbol.includes('-')    // Excludes symbols like "BRK-B" (Berkshire Class B)
                                              // or "GOLD-W" (Warrants)

            && !quote.symbol.includes('^')    // Excludes indices like "^GSPC" (S&P 500)
                                              // or "^DJI" (Dow Jones) which are not tradable on alpaca

            && quote.exchange !== 'PNK'       // Excludes Pink Sheet stocks (very risky/low volume)
                                              
            && quote.exchange !== 'OTC'       // Excludes Over The Counter stocks (not on major exchanges)
            
            && quote.symbol.length <= 5       // Most legitimate US stocks have 1-5 letters
                                              // Helps filter out unusual instruments
          )
          .map((item: any) => ({
            symbol: item.symbol,
            name: item.longname || item.shortname || item.symbol,
            type: item.quoteType,
            exchange: item.exchange
          }));
      },
    }),
  }),
});

export const { useSearchStocksQuery } = appApiSlice;