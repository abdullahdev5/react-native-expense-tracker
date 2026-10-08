import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { login, registerUser, googleAuth, facebookAuth } from '../controllers/auth.controller';
import { upload } from '../config/multer';

const router = express.Router();


// Register User
// POST (/register)
router.post('/register', upload.single('picture'), registerUser);

// Login
// POST (/login)
router.post('/login', login);

// Google Auth
// POST (/google)
router.post('/google', googleAuth);

// Facebook Auth
// POST (/facebook)
router.post('/facebook', facebookAuth);


export default router;