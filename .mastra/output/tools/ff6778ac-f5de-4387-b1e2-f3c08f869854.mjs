import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

const getStockPrice = async (symbol) => {
  const data = await fetch(
    `https://mastra-stock-data.vercel.app/api/stock-data?symbol=${symbol}`
  ).then((r) => r.json());
  return data.prices["4. close"];
};
const stockPrices = createTool({
  id: "Get Stock Price",
  inputSchema: z.object({
    symbol: z.string()
  }),
  description: `Fetches the last day's closing stock price for a given symbol`,
  execute: async ({ context: { symbol } }) => {
    console.log("Using tool to fetch stock price for", symbol);
    return {
      symbol,
      currentPrice: await getStockPrice(symbol)
    };
  }
});

export { stockPrices };
//# sourceMappingURL=ff6778ac-f5de-4387-b1e2-f3c08f869854.mjs.map
