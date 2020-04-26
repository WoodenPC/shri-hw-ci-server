import { Router } from 'express';

export const router = Router();

router.use('/builds', require('./builds'));
router.use('/settings', require('./settings'));
