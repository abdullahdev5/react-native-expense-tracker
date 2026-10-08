import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { getUser, setBaseCurrency, updateProfile } from '../controllers/user.controller';
import { upload } from '../config/multer';

const router = express.Router();


// Get User
// GET (/user)
router.get('/user', protect, getUser);

// Set base Currency
// POST (/user/base-currency)
router.post('/user/base-currency', protect, setBaseCurrency);

// Update Profile
// POST (/user/profile/update)
router.post('/user/profile/update', protect, upload.single('picture'), updateProfile);


export default router;