import {Router} from "express"
import { createPost,viewPost } from "../controllers/postController.js"
import auth from '../middlewares/authMiddleware.js'

const router = Router()

router.route('/create').post(auth,createPost)
router.route('/view').post(auth,viewPost)

export default router