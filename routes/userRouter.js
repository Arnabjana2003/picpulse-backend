import { Router } from "express";
import { createUser, currentUser, loginUser, logout,updateProfileImage,updateCoverImage,deleteCoverImage,deleteProfileImage } from "../controllers/userController.js";
import auth from "../middlewares/authMiddleware.js"

const router = Router()
router.route("/create").post(createUser)
router.route("/login").post(loginUser)
router.route("/logout").post(auth,logout)
router.route("/currentuser").get(auth,currentUser)
router.route("/updateprofileimage").post(auth,updateProfileImage)
router.route("/updatecoverimage").post(auth,updateCoverImage)
router.route("/deletecoverimage").post(auth,deleteCoverImage)
router.route("/deleteprofileimage").post(auth,deleteProfileImage)

export default router