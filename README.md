# Samarth – AI System for Personalized Government Scheme Identification

Samarth is a full-stack web application designed to help citizens of Jharkhand identify government schemes they are eligible for. It uses a multi-agent architecture and a local LLM (Ollama) to provide personalized recommendations and simplified explanations.

## Features

- **Personalized Scheme Finder**: A step-by-step wizard to collect user profiles and match them with eligible schemes.
- **AI-Powered Explanations**: Uses Llama3 (via Ollama) to explain complex scheme rules in simple terms.
- **Multi-Agent Architecture**: Modular agents for profiling, matching, explaining, and chatting.
- **Scheme Explorer**: Browse all 50+ Jharkhand government schemes with category filters.
- **AI Assistant**: A natural language chat interface to answer questions about schemes.
- **Fully Offline**: Designed to run on a local machine without external API dependencies.

## Tech Stack

- **Frontend**: React, Tailwind CSS, Lucide React, Framer Motion
- **Backend**: Node.js, Express
- **AI Model**: Ollama (Llama3:8b)
- **Data**: Local JSON dataset of 50+ Jharkhand schemes

## Prerequisites

1. **Install Ollama**: Download and install from [ollama.com](https://ollama.com/).
2. **Download Llama3**:
   ```bash
   ollama run llama3:8b
   ```
   (Ensure Ollama is running before starting the backend).

## Getting Started

### 1. Clone the repository
```bash
cd samarth
```

### 2. Start the Backend
```bash
cd backend
npm install
node server.js
```
The backend will run on `http://localhost:5000`.

### 3. Start the Frontend
```bash
cd ../frontend
npm install
npm start
```
The application will open at `http://localhost:3000`.

## Project Structure

- `/backend`: Express server and multi-agent logic.
  - `/agents`: Modular agents (Profiling, Matching, Explanation, Chat, Orchestrator).
  - `/dataset`: `jharkhand_schemes.json` containing 50 schemes.
- `/frontend`: React application with Tailwind CSS.
  - `/src/pages`: Landing, Finder, Results, Details, Explorer, and Chat pages.

## Multi-Agent Workflow

1. **UserProfilingAgent**: Structures raw user input into a standardized profile.
2. **SchemeMatchingAgent**: Scores schemes based on eligibility rules (Occupation, Income, Category, etc.).
3. **ExplanationAgent**: Connects to Ollama to generate user-friendly summaries.
4. **ChatAgent**: Handles natural language queries using the local LLM.
5. **Orchestrator**: Manages the flow between agents and returns the final result.

## License

This project is part of an MCA Dissertation and is intended for educational purposes.
