import * as dotenv from "dotenv";
dotenv.config();

import { stockAgent } from "./agents/stockAgent";

async function testAutoEvaluation() {
  console.log("Testing Stock Agent with Automatic Evaluation");
  console.log("============================================\n");

  const testQuery = "What is the current price of Apple stock (AAPL)?";
  
  console.log(`Query: "${testQuery}"`);
  console.log("-".repeat(50));
  
  try {
    const result = await stockAgent.generate(testQuery);
    
    console.log("Agent Response:");
    console.log(result.text);
    
    if (result.evaluation) {
      console.log("\nDetailed Evaluation Results:");
      console.log("- Relevancy:", result.evaluation.relevancy);
      console.log("- Completeness:", result.evaluation.completeness);
      console.log("- Tone:", result.evaluation.tone);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

if (require.main === module) {
  testAutoEvaluation().catch(console.error);
}