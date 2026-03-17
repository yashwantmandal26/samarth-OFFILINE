const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// NEW: Hybrid Symbolic-Generative MAS Orchestration
const CoordinatorAgent = require('./agents/CoordinatorAgent');
const SimulationAgent = require('./agents/SimulationAgent');
const chatAgent = require('./agents/chatAgent');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure Multer for multimodal intake
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(bodyParser.json());

// 0. AI Chat Endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, userProfile, topSchemes, language } = req.body;
        console.log(`[API] Received Chat Request (${language}). Delegating to ChatAgent...`);
        const response = await chatAgent.chat(message, userProfile || {}, topSchemes || [], language || 'en');
        res.json({ response });
    } catch (error) {
        console.error('[API] Chat Error:', error);
        res.status(500).json({ error: 'Chat Protocol Failed' });
    }
});

// 1. Policy Recommendation Endpoint (MAS Workflow)
app.post('/api/recommendations', upload.single('document'), async (req, res) => {
    try {
        const rawUserData = req.body.userData ? JSON.parse(req.body.userData) : req.body;
        const fileBuffer = req.file ? req.file.buffer : null;
        const language = req.body.language || 'en';

        console.log(`[API] Received Request for Recommendation (${language}). Delegating to CoordinatorAgent...`);
        const result = await CoordinatorAgent.requestRecommendations(rawUserData, fileBuffer, language);
        res.json(result);
    } catch (error) {
        console.error('[API] Recommendation Error:', error);
        res.status(500).json({ error: 'MAS Protocol Execution Failed' });
    }
});

// 2. Policy Impact Simulation Endpoint (Research Novelty)
app.post('/api/simulate', async (req, res) => {
    try {
        const { profile, hypotheticalChanges } = req.body;
        
        const fipaMsg = CoordinatorAgent.createMessage(
            "Frontend",
            "SimulationAgent",
            "REQUEST_SIMULATION_DELTA",
            { profile, hypotheticalChanges }
        );

        const result = await SimulationAgent.handleMessage(fipaMsg);
        res.json(result);
    } catch (error) {
        console.error('[API] Simulation Error:', error);
        res.status(500).json({ error: 'Simulation Protocol Failed' });
    }
});

// 3. Static Scheme Data (for Explorer)
const SCHEMES_PATH = path.join(__dirname, 'dataset/jharkhand_schemes.json');
app.get('/api/schemes', (req, res) => {
    try {
        const schemes = JSON.parse(fs.readFileSync(SCHEMES_PATH, 'utf8'));
        res.json(schemes);
    } catch (error) {
        res.status(500).json({ error: 'Data retrieval failed' });
    }
});

app.get('/api/schemes/:id', (req, res) => {
    try {
        const schemes = JSON.parse(fs.readFileSync(SCHEMES_PATH, 'utf8'));
        const scheme = schemes.find(s => s.id === req.params.id);
        if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
        res.json(scheme);
    } catch (error) {
        res.status(500).json({ error: 'Data retrieval failed' });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'Samarth MAS Backend is Active', architecture: 'Hybrid Symbolic-Generative' });
});

app.listen(PORT, () => {
    console.log(`Samarth MAS Backend running on http://localhost:${PORT}`);
});
