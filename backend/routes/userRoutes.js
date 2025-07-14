import express from 'express';
import { registrar, login } from '../controllers/userController.js';

const router = express.Router();

router.post('/registrar', registrar);
router.post('/login', login);

export default router;
