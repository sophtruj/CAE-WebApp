import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data folder exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const dbPath = path.join(dataDir, 'app.db');
const db = new Database(dbPath, { fileMustExist: false });

// Create table on first run
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// Prepared statements
const stmtList = db.prepare(`SELECT id, name, created_at FROM items ORDER BY id DESC;`);
const stmtInsert = db.prepare(`INSERT INTO items (name) VALUES (?);`);

export function listItems() {
  return stmtList.all();
}

export function addItem(name) {
  const info = stmtInsert.run(name);
  return { id: info.lastInsertRowid, name };
}
