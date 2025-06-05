import Block from '../models/Block.mjs';
import { loadChainFromFile, saveChainToFile } from '../../storage.mjs';

const DEFAULT_DIFFICULTY = 3;

export async function getFullChain() {

  const rawChain = await loadChainFromFile();

  // Konvertera varje rått objekt till en riktig Block‐instans...
  return rawChain.map(blk =>
    Object.assign(
      new Block(blk.index, blk.timestamp, blk.data, blk.previousHash),
      { nonce: blk.nonce, hash: blk.hash }
    )
  );
}

// Skapa ett nytt block....
export async function addNewBlock(dataObject) {
  
  const chain = await getFullChain();

  // Beräkna index och föregående hash...
  const newIndex = chain.length;
  const previousHash = chain.length > 0
    ? chain[chain.length - 1].hash
    : '0';

  // Skapa ett nytt Block‐objekt...
  const newBlock = new Block(newIndex, new Date().toISOString(), dataObject, previousHash);

  // Kör Proof‐of‐Work enligt DEFAULT_DIFFICULTY...
  newBlock.mineBlock(DEFAULT_DIFFICULTY);

  // Lägg till blocket i kedjan och spara hela kedjan till fil
  chain.push(newBlock);
  await saveChainToFile(chain);

  return newBlock;
}

// Hämta ett enskilt block från kedjans index...
 
export async function findBlockByIndex(index) {
  const chain = await getFullChain();
  return chain.find(b => b.index === index) || null;
}
