import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { createTransaction, exportTransactions, getTransactions } from "../controllers/transaction.controller";


const router = Router();


// Create Transaction
// POST (/transactions/create)
router.post('/transactions/create', protect, createTransaction);

// Get Transactions
// GET (/transactions)
router.get('/transactions', protect, getTransactions);

// Export Transactions
// post (/transactions/export)
router.post('/transactions/export', protect, exportTransactions)


export default router;