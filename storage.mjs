// storage.mjs
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sökväg till JSON-filen under data/
const DATA_PATH = path.join(__dirname, 'data', 'blockchain.json');

export async function loadChainFromFile() {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    const chain = JSON.parse(raw);
    // Om filen innehåller något annat än array, returnera tom array
    return Array.isArray(chain) ? chain : [];
  } catch (err) {
    if (err.code === 'ENOENT') {
      // Filen saknas: skapa en tom array i filen och returnera tom array
      await saveChainToFile([]);
      return [];
    }
    // Om annat fel, kasta vidare
    throw err;
  }
}

export async function saveChainToFile(chainArray) {
  // Skriv kedjan (array) som snygg JSON
  const jsonString = JSON.stringify(chainArray, null, 2);
  await fs.writeFile(DATA_PATH, jsonString, 'utf-8');
}
