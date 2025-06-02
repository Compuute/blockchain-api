import Blockchain from '../models/Blockchain.js';
import Block from '../models/Block.js';
import createError from 'http-errors';
import Joi from 'joi';

const blockchain = new Blockchain();
const blockDataSchema = Joi.object().required();

export async function createBlock(req, res, next) {
  try {
    const { error, value } = blockDataSchema.validate(req.body.data);
    if (error) {
      throw createError(400, 'Ogiltig blockdata');
    }

    const newIndex = blockchain.chain.length;
    const timestamp = new Date().toISOString();
    const data = value;
    const newBlock = new Block(newIndex, timestamp, data);

    blockchain.addBlock(newBlock);

    res.status(201).json({ message: 'Block skapat', block: newBlock });
  } catch (err) {
    next(err);
  }
}

export async function getAllBlocks(req, res, next) {
  try {
    const allBlocks = blockchain.getAllBlocks();
    res.status(200).json({ chain: allBlocks });
  } catch (err) {
    next(err);
  }
}

export async function getBlockByIndex(req, res, next) {
  try {
    const index = parseInt(req.params.index, 10);
    if (isNaN(index) || index < 0) {
      throw createError(400, 'Index måste vara ett giltigt heltal ≥ 0');
    }

    const block = blockchain.getBlockByIndex(index);
    if (!block) {
      throw createError(404, `Inget block med index ${index} hittades`);
    }

    res.status(200).json({ block });
  } catch (err) {
    next(err);
  }
}
