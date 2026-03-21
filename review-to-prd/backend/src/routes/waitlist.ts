import { Router } from 'express';
import { query } from '../lib/db';

const router = Router();

router.post('/', async (req, res) => {
    const { email } = req.body;
    
    if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ success: false, message: 'Valid email is required.' });
    }

    try {
        await query(
            'INSERT INTO waitlist (email) VALUES ($1) ON CONFLICT (email) DO NOTHING',
            [email]
        );
        res.status(200).json({ success: true, message: 'Successfully joined the waitlist!' });
    } catch (error) {
        console.error('Waitlist error:', error);
        // Fallback for local dev if waitlist table is missing in db.json based DB wrapper
        // The local fallback db.ts might just return an empty array for unknown tables and not throw,
        // but if it throws we catch it.
        res.status(500).json({ success: false, message: 'Failed to join waitlist.' });
    }
});

export default router;
