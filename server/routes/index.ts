import express from 'express';

const router = express.Router();
import { router as apiRouter } from './api';

router.use('/api', apiRouter);

export { router };
