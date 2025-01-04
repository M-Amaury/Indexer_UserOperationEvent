import express from 'express';
import db from './db';

const app = express();
const PORT = 3000;

app.use(express.json());

// Add error handling for database connection
db.on('error', (err) => {
    console.error('Database error:', err);
});

// Récupérer les événements avec des filtres
app.get('/events', (req, res) => {
    const { userOpHash, sender, paymaster, fromBlock, toBlock, success } = req.query;
    const conditions: string[] = [];
    const values: any[] = [];
    
    if (userOpHash) {
        conditions.push("userOpHash = ?");
        values.push(userOpHash);
    }
    if (sender) {
        conditions.push("sender = ?");
        values.push(sender);
    }
    if (paymaster) {
        conditions.push("paymaster = ?");
        values.push(paymaster);
    }
    if (fromBlock) {
        conditions.push("blockNumber >= ?");
        values.push(parseInt(fromBlock as string, 10));
    }
    if (toBlock) {
        conditions.push("blockNumber <= ?");
        values.push(parseInt(toBlock as string, 10));
    }
    if (success !== undefined) {
        conditions.push("success = ?");
        values.push(success === 'true' ? 1 : 0);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `SELECT * FROM UserOperationEvent ${whereClause} ORDER BY blockNumber DESC`;

    db.all(query, values, (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Erreur lors de la récupération des événements' });
        } else {
            res.json(rows);
        }
    });
});

app.listen(PORT, () => {
    console.log(`API disponible sur http://localhost:${PORT}`);
}).on('error', (err) => {
    console.error('Server error:', err);
});