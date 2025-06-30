# mastra-agent

```
curl -X POST http://localhost:4111/api/agents/stockAgent/generate \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      { "role": "user", "content": "What is the current stock price of Apple (AAPL)?" }
    ]
  }'
```

```
curl -X POST https://few-blue-solstice.mastra.cloud/api/agents/stockAgent/generate \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      { "role": "user", "content": "What is the current stock price of Apple (AAPL)?" }
    ]
  }'
```
