import { Agent } from "@mastra/core/agent";
import { anthropic } from "@ai-sdk/anthropic";
 
import * as tools from "../tools/stockPrices";

const CLAUDE_MODEL = "claude-3-7-sonnet-20250219";
 
export const stockAgent = new Agent({
  name: "Stock Agent",
  instructions:
    "You are a helpful assistant that provides current stock prices. When asked about a stock, use the stock price tool to fetch the stock price.",
  model: anthropic(CLAUDE_MODEL),
  tools: {
    stockPrices: tools.stockPrices,
  },
});
