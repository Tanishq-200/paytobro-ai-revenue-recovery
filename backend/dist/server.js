import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiRouter } from './routes/index.js';
import { seedDatabase } from './database/seed.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
// Security & Parsing Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
// Initialize and seed database if not exists
try {
    seedDatabase(false);
    console.log('⚡ PayToBro database initialized and validated successfully.');
}
catch (err) {
    console.error('Error during database initialization:', err);
}
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        brand: 'PayToBro',
        tagline: 'Recover Every Possible Payment.',
        mode: 'Autonomous Mode Active (Sandbox Simulation)',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});
// API Endpoints
app.use('/api', apiRouter);
// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message || 'An unexpected error occurred in PayToBro engine.',
    });
});
app.listen(PORT, () => {
    console.log(`🚀 PayToBro Backend API Server running at http://localhost:${PORT}`);
    console.log(`🛡️  Autonomous Recovery Agent & Guardrails Active`);
});
