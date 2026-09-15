import {Router} from "express"
import {
    googleCallback, googleLogin, userProfile, logout,
    userRegistration, userLogin, deleteAccount,
    sendPasswordLink,resetPassword,verifyLink
} from "../controller/auth.controller.js"
import { requireAuth } from "../middleware/requireAuth.js"
const router = Router()

router.get('/google', googleLogin)
router.get('/google/callback', googleCallback)
router.get('/me', requireAuth, userProfile)
router.get('/logout', logout)
router.post('/register',userRegistration) 
router.post('/login', userLogin)
router.post("/forgot_password", sendPasswordLink);
router.post("/reset_password/:token", resetPassword)
router.post("/verify_link",verifyLink)

router.delete("/delete_acc",requireAuth,deleteAccount)
    

export default router;

