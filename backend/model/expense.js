import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index:true,
  },
  category: {
    type: String,
    enum: [
        "Food",
        "Transport",
        "Bills",
        "Shopping",
        "Health",
        "Entertainment",
        "Other",
    ],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  type: {
      type: String,
      enum: ["expense", "income"],
      required: true,
  },
  note: String,
  date: {
      type: Date,
      required: true,
  },
}, {
  timestamps: true
});

export default mongoose.model("Expense", expenseSchema)