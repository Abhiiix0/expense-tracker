import {Router} from "express"
import { googleCallback, googleLogin, userProfile,logout,userRegistration, userLogin, deleteAccount } from "../controller/auth.controller.js"
import { requireAuth } from "../middleware/requireAuth.js"
const router = Router()

router.get('/google', googleLogin)
router.get('/google/callback', googleCallback)
router.get('/me', requireAuth, userProfile)
router.get('/logout', logout)
router.post('/register',userRegistration) 
router.post('/login',userLogin)
router.delete("/delete_acc",requireAuth,deleteAccount)
    

export default router;

