import jwt from "jsonwebtoken"

export function createToken(payload,expireIn="7d") {
   return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn:expireIn
    })
}

export function verifyToken(token) {
    try {
        return jwt.verify(token,process.env.JWT_SECRET)
    } catch (error) {
        return null
    }
}