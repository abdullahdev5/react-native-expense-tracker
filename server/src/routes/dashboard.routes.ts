import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { getDashboard } from "../controllers/dashboard.controller";

const router = Router();


// Get Dashboard Data
// GET (/dashboard)
router.get('/dashboard', protect, getDashboard);


export default router;