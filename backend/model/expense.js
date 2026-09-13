import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  category: String,
  description: String,
  amount: {
    type: Number,
    required: true
  },
  expenseName: String,
  date: Date
}, {
  timestamps: true
});

export default mongoose.model("Expense", expenseSchema)