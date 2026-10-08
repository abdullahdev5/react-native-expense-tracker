import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { getInsights } from "../controllers/insight.controller";


const router = Router();


// GET Statistics
// GET (/insights)
router.get('/insights', protect, getInsights);



export default router;