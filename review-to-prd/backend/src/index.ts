import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import scrapeRouter from './routes/scrape';
import analyzeRouter from './routes/analyze';
import ticketRouter from './routes/ticket';
import analysesRouter from './routes/analyses';
import settingsRouter from './routes/settings';
import waitlistRouter from './routes/waitlist';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
    origin: /^http:\/\/localhost(:\d+)?$/,
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/scrape', scrapeRouter);
app.use('/api/analyze', analyzeRouter);
app.use('/api/ticket', ticketRouter);
app.use('/api/analyses', analysesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/waitlist', waitlistRouter);

const frontendPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

// Health check
app.get('/api/health', (_, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Catch-all: serve index.html for any other routes (SPA)
app.get('*', (req, res) => {
    // If it's a missing API route, don't serve index.html
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'Not Found' });
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n🚀 Review-to-PRD Monolith running on http://localhost:${PORT}`);
    console.log(`   Serving frontend from: ${frontendPath}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
