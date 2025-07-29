import express from 'express';
import {
  getVolunteers,
  createVolunteer,
  deleteVolunteer,
} from '../controllers/volunteerController.js';

const router = express.Router();

router.get('/', getVolunteers);
router.post('/', createVolunteer);
router.delete('/:id', deleteVolunteer);

export default router;
