import Block from '../src/models/Block.mjs';

describe('Block-modellen', () => {
  const difficulty = 3;

  test('calculateHash() ger en korrekt sha256-hash', () => {
    const index = 0;
    const timestamp = '2025-06-05T00:00:00.000Z';
    const data = { foo: 'bar' };
    const previousHash = '0';
    const block = new Block(index, timestamp, data, previousHash);

    // calculateHash()
    const expected = block.calculateHash();
    expect(typeof expected).toBe('string');
    expect(expected.length).toBe(64); 
  });

  test('mineBlock() ändrar nonce tills hash börjar med "000" (difficulty=3)', () => {
    const index = 1;
    const timestamp = '2025-06-05T00:00:00.000Z';
    const data = { foo: 'baz' };
    const previousHash = '000ab..'; // dummy
    const block = new Block(index, timestamp, data, previousHash);

    block.mineBlock(difficulty);
    expect(block.hash.substring(0, difficulty)).toBe('0'.repeat(difficulty));
    expect(block.nonce).toBeGreaterThan(0);
  });

  test('ett block med identisk input (inkl. nonce) ger samma hash', () => {
    // Skapa ett block och manuellt "mina" tills rätt hash
    const index = 2;
    const timestamp = '2025-06-05T00:00:00.000Z';
    const data = { alpha: 'beta' };
    const previousHash = '000ab..';
    const b1 = new Block(index, timestamp, data, previousHash);
    b1.mineBlock(difficulty);

    // Skapa nytt block med exakt samma värden
    const b2 = new Block(index, timestamp, data, previousHash);
    b2.nonce = b1.nonce; 
    b2.hash = b2.calculateHash();

    expect(b2.hash).toBe(b1.hash);
  });
});
