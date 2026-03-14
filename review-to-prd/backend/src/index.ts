import express from 'express';
import cors from 'cors';
import scrapeRouter from './routes/scrape';
import analyzeRouter from './routes/analyze';
import ticketRouter from './routes/ticket';

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

// Health check
app.get('/api/health', (_, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`\n🚀 Review-to-PRD Backend running on http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health`);
    console.log(`   Scrape:       POST http://localhost:${PORT}/api/scrape`);
    console.log(`   Analyze:      POST http://localhost:${PORT}/api/analyze\n`);
});
