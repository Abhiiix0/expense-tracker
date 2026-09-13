import { verifyToken } from "../utils/jwt.js"

export const requireAuth = async (req, res, next) => {
    try {
        const token = req.cookies.authToken
        console.log("requireAuth token", token)
        if (!token) {
            return res.status(401).json({
                message:"Not authenticated" 
            })
        }

        const payload = verifyToken(token)
        console.log("requireAuth payload", payload)

        if (!payload) {
        return res.status(401).json({ message: "Invalid or expired token" });
        }

        req.user = payload;
        next()
    } catch (error) {
                console.error("Auth error:", error);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}