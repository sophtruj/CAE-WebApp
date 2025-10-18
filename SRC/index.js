import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { listItems, addItem } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 3000);

// CORS: allow same-origin dev by default (tighten if deploying)
app.use(cors());
app.use(express.json());

// --- API ---
app.get('/api/items', (req, res) => {
  try {
    const rows = listItems();
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB query failed' });
  }
});

app.post('/api/items', (req, res) => {
  const { name } = req.body ?? {};
  if (!name || !name.trim()) return res.status(400).json({ error: 'name required' });

  try {
    const row = addItem(name.trim());
    res.status(201).json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Insert failed' });
  }
});

// --- STATIC FRONTEND ---
app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
