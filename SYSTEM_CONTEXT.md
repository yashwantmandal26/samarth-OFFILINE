# Samarth Project: System Context Snapshot (Pre-NLP Upgrade)

This document provides a technical snapshot of the **Samarth Multi-Agent System (MAS)** as of March 2026. It serves as the baseline for the upcoming NLP-driven conversational pipeline upgrade.

## 1. Directory Structure

### Backend Agents (`backend/agents/`)
```text
backend/agents/
├── CoordinatorAgent.js    # Orchestrator (AMS/DF)
├── EligibilityAgent.js    # Symbolic AI rule engine
├── ExplanationAgent.js    # Generative XAI component
├── VisionAgent.js         # Hybrid OCR (Tesseract + Llama3)
├── userProfilingAgent.js  # Attribute extractor & formatter
├── chatAgent.js           # RAG-based chat assistant
└── SimulationAgent.js     # Policy impact simulator
```

### Frontend Source (`frontend/src/`)
```text
frontend/src/
├── components/            # Reusable UI elements
├── context/               # Language & State management
├── pages/                 # Main route components
│   ├── AIChatPage.js      # Conversational interface
│   ├── LandingPage.js     # Project entry point
│   ├── ResultsPage.js     # Ranked scheme display
│   ├── SchemeFinderWizard.js # 5-step smart intake
│   └── ...
├── services/              # API communication (axios)
└── App.js                 # Routing & Layout
```

---

## 2. Data Schemas & Payloads

### UserProfile Object
The `EligibilityAgent` and `userProfilingAgent` use the following structured schema:

```json
{
  "name": "string (default: 'Citizen')",
  "age": "number (default: 0)",
  "gender": "string (Male/Female/Not specified)",
  "occupation": "string",
  "income": "number",
  "socialCategory": "string (General/ST/SC/OBC/Minority)",
  "district": "string",
  "residence": "string (Rural/Urban)",
  "qualification": "string",
  "isBPL": "boolean",
  "housingStatus": "string (Own/Rented)",
  "landHolding": "string",
  "preferredField": "string (Any/Education/Agriculture/etc.)",
  "specialStatus": "array (e.g., ['Widow', 'Disabled'])"
}
```

### FIPA-lite Message Structure
Inter-agent communication is managed via `CoordinatorAgent.js` using this protocol:

```javascript
{
  "id": "msg_timestamp_randomhash",
  "sender": "string (e.g., 'CoordinatorAgent')",
  "receiver": "string (e.g., 'VisionAgent')",
  "intent": "string (e.g., 'REQUEST_EXTRACT_ATTRIBUTES')",
  "content": "object (payload specific to the intent)",
  "timestamp": "ISO-8601 string"
}
```

---

## 3. Core Component Code: Chat UI (`AIChatPage.js`)

The chat interface uses **React Hooks** for state and **Web Speech API** for multimodal interaction.

**State Variables:**
- `messages`: Array of `{ role: 'user' | 'assistant', content: string, relatedSchemes: [] }`.
- `input`: String for the current text area value.
- `loading`: Boolean for AI processing state.
- `isListening`/`isSpeaking`: Booleans for STT/TTS status.

**Payload Dispatch:**
The frontend sends the following to the `/api/chat` endpoint:
```javascript
{
  "message": "User query string",
  "userProfile": "{ ... } (from localStorage)",
  "topSchemes": "[]",
  "language": "string (hi/en/hinglish)",
  "history": "messages.slice(-10) // Context memory"
}
```

---

## 4. Backend Routing Logic (`CoordinatorAgent.js`)

Routing is handled by the `requestRecommendations` function, which orchestrates the sequential execution of agents.

```javascript
// Workflow Orchestration
requestRecommendations: async (rawUserData, fileBuffer, language) => {
    // 1. Vision Agent (Multimodal Intake)
    if (fileBuffer) {
        const extracted = await VisionAgent.handleMessage(visionMsg, fileBuffer);
        currentProfile = { ...currentProfile, ...extracted };
    }
    
    // 2. Eligibility Agent (Symbolic Rule Matching)
    const evaluationResult = await EligibilityAgent.handleMessage(eligibilityMsg);
    
    // 3. Explanation Agent (Generative Reasoning)
    const explainedMatches = await Promise.all(topMatches.map(m => 
        ExplanationAgent.handleMessage(explanationMsg)
    ));
    
    return { profile, recommendations: explainedMatches };
}
```

---

## 5. Current Chat Agent (`chatAgent.js`)

The Chat Agent uses a **RAG (Retrieval-Augmented Generation)** approach with weighted keyword scoring.

**Function Signature:**
```javascript
chat: async (userMessage, userProfile, topSchemes, language, history) => { ... }
```

**Prompt Construction Logic:**
1. **RAG Retrieval**: Searches `jharkhand_schemes.json` for matches using a scoring system (Name: 10pts, Category: 5pts, Keywords: 3pts).
2. **Context Injection**:
   - `PROJECT KNOWLEDGE`: Static info about Samarth architecture.
   - `USER PROFILE`: Structured JSON from Step 2.
   - `KNOWLEDGE BASE`: Relevant scheme descriptions and eligibility.
   - `CONVERSATION HISTORY`: Last 10 messages for pronoun resolution.
3. **System Directives**: Strict rules for "No greetings", "Strict Language compliance", and "Context stickiness".

**Memory**: Currently supports short-term session memory via the `history` array passed from the frontend. No long-term persistence (database) is implemented.
