import express from 'express';
import { runCode, submitCode } from '../controllers/code.controller';
import { verifyToken } from '../middleware/auth.middleware';
// import { runCode, submitCode } from '../controllers/code.controller';

const router = express.Router();

router.post('/run', runCode);
router.post('/submit', verifyToken, submitCode); 

export default router;