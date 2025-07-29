import express from 'express';
import {
  getAllSettings,
  updateSetting,
} from '../controllers/settingController.js';

const router = express.Router();

router.get('/', getAllSettings);
router.put('/:key', updateSetting);

export default router;
