import express from 'express';
import { getResources, createResource, updateResource, deleteResource } from '../controllers/resourceController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(getResources)
  .post(protect, admin, createResource);

router.route('/:id')
  .put(protect, admin, updateResource)
  .delete(protect, admin, deleteResource);

export default router;
