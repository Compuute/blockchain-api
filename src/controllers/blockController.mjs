import createError from "http-errors";
import Joi from "joi";
import {
  getFullChain,
  addNewBlock,
  findBlockByIndex,
} from "../repositories/blockRepository.mjs";

// Valideringsschema: vi förväntar oss att req.body.data är ett objekt
const blockDataSchema = Joi.object().required();
export async function createBlock(req, res, next) {
  try {
    // 1. Validera att "data" finns och är ett objekt
    const { error, value } = blockDataSchema.validate(req.body.data);
    if (error) {
      throw createError(400, "Ogiltig blockdata");
    }

    // 2. Lägga till nytt block
    const newBlock = await addNewBlock(value);

    // 3. Blocket är skapad Returnera 201.......
    res.status(201).json({ message: "Block skapat", block: newBlock });
  } catch (err) {
    next(err);
  }
}

// Hämtar hela kedjan. GET

export async function getAllBlocks(req, res, next) {
  try {
    const chain = await getFullChain();
    res.status(200).json({ chain });
  } catch (err) {
    next(err);
  }
}

// Hämtar ett enskilt block baserat på index‐parameter...

export async function getBlockByIndex(req, res, next) {
  try {
    const index = parseInt(req.params.index, 10);
    if (isNaN(index) || index < 0) {
      throw createError(400, "Index måste vara ett giltigt heltal ≥ 0");
    }

    const block = await findBlockByIndex(index);
    if (!block) {
      throw createError(404, `Block med index ${index} hittades inte`);
    }

    res.status(200).json({ block });
  } catch (err) {
    next(err);
  }
}
