import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    googleId:   { type: String, unique: true, sparse: true },      // unique ONLY among docs that have it
    email: { type: String, required: true, unique: true },
  password: { type: String },
  resetPasswordToken: String,
    resetPasswordExpires:Date,
    name: { type: String,required: true },
    profileImg: { type: String},
},{
  timestamps: true
});

export default mongoose.model("User", userSchema);
