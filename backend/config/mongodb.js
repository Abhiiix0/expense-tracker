import mongoose from "mongoose";

export async function connectDB() {
  await mongoose.connect(process.env.MONGODB, { dbName: "expense_tracker" });
  console.log("✅ MongoDB connected");
}
