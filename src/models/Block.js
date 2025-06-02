import crypto from 'crypto';

export default class Block {
    constructor( index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        const blockString = 
        this.index + 
        this.timestamp +
        JSON.stringify(this.data) +
        this.previousHash +
        this.nonce;
        return crypto.createHash('sha256').update(blockString).digest('hex');
    }
    
    mineBlock(difficulty) {
        const target = Array(difficulty + 1).join('0');
        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            this.hash = this.calculateHash();
            console.log(`Mining... ${this.hash}`);
        }
        }
    }