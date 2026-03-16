const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const orchestrator = require('./agents/orchestrator');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Load Schemes for general exploration
const SCHEMES_PATH = path.join(__dirname, 'dataset/jharkhand_schemes.json');
const getAllSchemes = () => JSON.parse(fs.readFileSync(SCHEMES_PATH, 'utf8'));

// API Routes

// 1. Get All Schemes (for Explorer)
app.get('/api/schemes', (req, res) => {
    try {
        const schemes = getAllSchemes();
        res.json(schemes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load schemes' });
    }
});

// 2. Get Single Scheme Detail
app.get('/api/schemes/:id', (req, res) => {
    try {
        const schemes = getAllSchemes();
        const scheme = schemes.find(s => s.id === req.params.id);
        if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
        res.json(scheme);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load scheme' });
    }
});

// 3. Get Recommendations (Orchestrator Flow)
app.post('/api/recommendations', async (req, res) => {
    try {
        const result = await orchestrator.getRecommendations(req.body);
        res.json(result);
    } catch (error) {
        console.error('Recommendations Error:', error);
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
});

// 4. Chat with AI
app.post('/api/chat', async (req, res) => {
    try {
        const { message, profile, topSchemes } = req.body;
        const response = await orchestrator.handleChat(message, profile || {}, topSchemes || []);
        res.json({ response });
    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({ error: 'Failed to process chat' });
    }
});

// 5. Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Samarth Backend is running fully offline' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Samarth Backend running on http://localhost:${PORT}`);
});
