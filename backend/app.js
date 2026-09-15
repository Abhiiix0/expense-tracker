import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import router from "./routes/auth.route.js"
import expenseRouter from "./routes/expense.route.js"


const app = express()

app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin:process.env.FRONTEND_URL
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", router)
app.use("/api", expenseRouter)
app.get("/", (req, res) => {
    res.status(200).json({
        message:"Everything running fine!"
    })
})


export default app;
