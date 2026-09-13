import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/mongodb.js";
// import run from "./config/mongodb.js"
const PORT = 5000


connectDB().then(() => {
    app.listen(PORT, () => {
    console.log(
     `🚀 Server running on port ${PORT}`
    )
})
}).catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
})

