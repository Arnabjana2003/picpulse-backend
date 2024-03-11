import {Router} from "express"
import { createPost } from "../controllers/postController.js"
import auth from '../middlewares/authMiddleware.js'

const router = Router()

router.route('/create').post(auth,createPost)

export default router