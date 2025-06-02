import fs from 'fs';
import path from 'path';
import Block from './Block.js';

const DATA_FILE = path.resolve('data/blockchain.json');

export default class Blockchain {
  constructor() {
    this.chain = [];
    this.difficulty = 3;   // kan ändras om du vill
    this.loadChain();
  }

  createGenesisBlock() {
    return new Block(0, new Date().toISOString(), { info: 'Genesis Block' }, '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
    this.saveChain();
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

      if (current.hash !== current.calculateHash()) return false;
      if (current.previousHash !== previous.hash) return false;
    }
    return true;
  }

  saveChain() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.chain, null, 2));
    } catch (err) {
      throw new Error('Kunde inte spara blockchain-data: ' + err.message);
    }
  }

  loadChain() {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      if (raw) {
        const json = JSON.parse(raw);
        this.chain = json.map(blk =>
          Object.assign(
            new Block(blk.index, blk.timestamp, blk.data, blk.previousHash),
            { nonce: blk.nonce, hash: blk.hash }
          )
        );
        if (this.chain.length === 0) {
          this.chain = [this.createGenesisBlock()];
          this.saveChain();
        }
        return;
      }
    }
    this.chain = [this.createGenesisBlock()];
    this.saveChain();
  }

  getBlockByIndex(index) {
    return this.chain.find(b => b.index === index);
  }

  getAllBlocks() {
    return this.chain;
  }
}
