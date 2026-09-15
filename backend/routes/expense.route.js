import { Router } from "express"
import { requireAuth } from "../middleware/requireAuth.js"
import { createExpense, deleteExpense, getExpenses,updateExpense } from "../controller/expense.controller.js"
const router = Router()

router.post("/expenses", requireAuth, createExpense)
router.get("/expenses", requireAuth, getExpenses)
router.patch("/expense/:id",requireAuth,updateExpense )
router.delete("/expense/:id", requireAuth, deleteExpense)
export default router