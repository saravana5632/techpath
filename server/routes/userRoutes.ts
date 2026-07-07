import express from 'express';
import { getUserProfile, updateUserProfile, uploadProfilePhoto, changePassword, deleteUser } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';
import { uploadProfile } from '../middleware/uploadMiddleware';

const router = express.Router();

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.post('/profile/photo', protect, uploadProfile.single('image'), uploadProfilePhoto);
router.put('/change-password', protect, changePassword);
router.delete('/delete', protect, deleteUser);

export default router;