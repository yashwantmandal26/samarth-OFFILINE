const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const orchestrator = require('./agents/orchestrator');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

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

// 3. Get Recommendations (Orchestrator Flow - Supports Multipart for Files)
app.post('/api/recommendations', upload.single('document'), async (req, res) => {
    try {
        // Parse raw data if sent as string (from FormData)
        const rawUserData = req.body.userData ? JSON.parse(req.body.userData) : req.body;
        const fileBuffer = req.file ? req.file.buffer : null;

        const result = await orchestrator.getRecommendations(rawUserData, fileBuffer);
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
        // Note: chatAgent still uses llama3:8b
        const response = await require('./agents/chatAgent').chat(message, profile || {}, topSchemes || []);
        res.json({ response });
    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({ error: 'Failed to process chat' });
    }
});

// 5. Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Samarth Multimodal MAS Backend is running fully offline' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Samarth Multimodal MAS Backend running on http://localhost:${PORT}`);
});
