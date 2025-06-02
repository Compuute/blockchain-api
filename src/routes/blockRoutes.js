import { Router } from 'express';
import { createBlock, getAllBlocks, getBlockById, getBlockByIndex } from '../controllers/blockController.js';

const router = Router();

router.post('/blocks', createBlock);
router.get('/blocks', getAllBlocks);
router.get('/blocks/:id', getBlockByIndex);

export default router;