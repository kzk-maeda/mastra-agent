import * as dotenv from "dotenv";
dotenv.config();

import { Agent } from "@mastra/core/agent";
import { anthropic } from "@ai-sdk/anthropic";
import { evaluate, globalSetup } from "@mastra/evals";
import { CompletenessMetric, ToneConsistencyMetric } from "@mastra/evals/nlp";
 
import * as tools from "../tools/stockPrices";

const CLAUDE_MODEL = "claude-3-7-sonnet-20250219";
const EVALUATION_MODEL = "claude-3-7-sonnet-20250219";

// Set up global evaluation run
globalSetup();

// Create base agent
const baseStockAgent = new Agent({
  name: "Stock Agent Base",
  instructions:
    "You are a helpful assistant that provides current stock prices. When asked about a stock, use the stock price tool to fetch the stock price.",
  model: anthropic(CLAUDE_MODEL),
  tools: {
    stockPrices: tools.stockPrices,
  },
});

// Create evaluation metrics - using only working metrics from @mastra/evals
const completenessMetric = new CompletenessMetric({
  model: anthropic(EVALUATION_MODEL),
});

const toneMetric = new ToneConsistencyMetric({
  model: anthropic(EVALUATION_MODEL),
  expectedTone: "professional and informative",
});

// Agent wrapper with automatic evaluation
class StockAgentWithEvaluation extends Agent {
  private baseAgent: Agent;
  private metrics: any[];

  constructor(config: any) {
    super(config);
    this.baseAgent = baseStockAgent;
    this.metrics = [completenessMetric, toneMetric];
  }

  async generate(query: string, options?: any) {
    // First get the response from the base agent
    const response = await super.generate(query, options);
    
    try {
      console.log("\n📊 Automatic Evaluation using @mastra/evals:");
      
      const evaluationResults = [];
      
      // Run each metric evaluation
      for (const metric of this.metrics) {
        try {
          // Use @mastra/evals evaluate function
          const result = await evaluate(this.baseAgent, query, metric);
          evaluationResults.push({
            metric: metric.name || metric.constructor.name,
            score: result.score,
            reason: result.reason
          });
          
          console.log(`  ✓ ${metric.name || metric.constructor.name}: ${result.score.toFixed(2)}/1.00`);
        } catch (err) {
          console.error(`  ✗ Failed to evaluate ${metric.name || metric.constructor.name}:`, err.message);
        }
      }
      
      // Calculate average score
      const avgScore = evaluationResults.length > 0 
        ? evaluationResults.reduce((sum, r) => sum + r.score, 0) / evaluationResults.length
        : 0;
      
      console.log(`  📊 Overall Score: ${avgScore.toFixed(2)}/1.00\n`);
      
      return {
        ...response,
        evaluations: {
          results: evaluationResults,
          overallScore: avgScore
        }
      };
    } catch (evalError) {
      console.error("Evaluation failed:", evalError);
      return response;
    }
  }
}

// Export the main agent with evaluation
export const stockAgent = new StockAgentWithEvaluation({
  name: "Stock Agent",
  instructions:
    "You are a helpful assistant that provides current stock prices. When asked about a stock, use the stock price tool to fetch the stock price.",
  model: anthropic(CLAUDE_MODEL),
  tools: {
    stockPrices: tools.stockPrices,
  },
});