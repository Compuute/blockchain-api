import { Router } from 'express';
import {
  createBlock,
  getAllBlocks,
  getBlockByIndex
} from '../controllers/blockController.mjs';

const router = Router();

// POST /api/blocks       → Skapa nytt block
router.post('/', createBlock);

// GET  /api/blocks       → Lista alla block
router.get('/', getAllBlocks);

// GET  /api/blocks/:index → Hämta block med angivet index
router.get('/:index', getBlockByIndex);

export default router;
