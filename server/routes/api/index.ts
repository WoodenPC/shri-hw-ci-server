import { Router } from 'express';
import { builds } from './builds';
import { settings } from './settings';

export const router = Router();

router.use('/builds', builds);
router.use('/settings', settings);
