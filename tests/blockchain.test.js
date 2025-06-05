import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import Block from "../src/models/Block.mjs";
import { loadChainFromFile, saveChainToFile } from "../storage.mjs";
import {
  getFullChain,
  addNewBlock,
  findBlockByIndex,
} from "../src/repositories/blockRepository.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "../data/blockchain.json");

// Läs in rådata
async function readRaw() {
  const raw = await fs.readFile(dataPath, "utf-8");
  return JSON.parse(raw);
}

let originalData = null;

beforeAll(async () => {
  try {
    originalData = await readRaw();
  } catch {
    originalData = [];
  }
});

afterAll(async () => {
  await saveChainToFile(originalData);
});

beforeEach(async () => {
  await saveChainToFile([]);
});

describe("storage.mjs och blockRepository", () => {
  test("loadChainFromFile() returnerar [] om filen är tom", async () => {
    await saveChainToFile([]);
    const arr = await loadChainFromFile();
    expect(Array.isArray(arr)).toBe(true);
    expect(arr.length).toBe(0);
  });

  test("saveChainToFile() och loadChainFromFile() skriver/läser korrekt", async () => {
    const dummy = [
      {
        index: 0,
        timestamp: "T",
        data: { a: 1 },
        previousHash: "0",
        nonce: 0,
        hash: "abc",
      },
    ];
    await saveChainToFile(dummy);

    const loaded = await loadChainFromFile();
    expect(loaded).toEqual(dummy);
  });

  test("getFullChain() returnerar en array av Block-instansier", async () => {
    const rawBlock = {
      index: 0,
      timestamp: new Date().toISOString(),
      data: { foo: "bar" },
      previousHash: "0",
      nonce: 0,
      hash: "dummyhash",
    };
    await saveChainToFile([rawBlock]);

    const chain = await getFullChain();
    expect(chain.length).toBe(1);
    expect(chain[0]).toBeInstanceOf(Block);
    expect(chain[0].index).toBe(rawBlock.index);
    expect(chain[0].hash).toBe(rawBlock.hash);
  });

  test("addNewBlock() skapar och sparar nytt block i fil", async () => {
    const dataObject = { test: "value" };
    const newBlock = await addNewBlock(dataObject);

    // Läs filen direkt
    const raw = await readRaw();
    expect(raw.length).toBe(1);
    expect(raw[0].index).toBe(0);
    expect(raw[0].data).toEqual(dataObject);
    expect(newBlock).toBeInstanceOf(Block);
    expect(newBlock.hash.substring(0, 3)).toBe("000");
  });

  test("findBlockByIndex() returnerar rätt block eller null", async () => {
    const dataObject = { hello: "world" };
    const added = await addNewBlock(dataObject);

    const found = await findBlockByIndex(0);
    expect(found).not.toBeNull();
    expect(found.index).toBe(0);
    expect(found.data).toEqual(dataObject);

    const notFound = await findBlockByIndex(999);
    expect(notFound).toBeNull();
  });
});
