import * as dotenv from "dotenv";
dotenv.config();

import { Mastra } from "@mastra/core";
 
import { stockAgent } from "./agents/stockAgent";
 
export const mastra = new Mastra({
  agents: { 
    stockAgent,
  },
});
