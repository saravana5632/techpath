import express from 'express';
import { getUsers, updateUser, deleteUser, createAdmin } from '../controllers/adminController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/users')
  .get(protect, admin, getUsers);

router.route('/create')
  .post(protect, admin, createAdmin);

router.route('/users/:id')
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

export default router;
