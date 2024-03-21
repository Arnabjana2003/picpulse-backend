import {Router} from "express"
import { createPost,viewPost,deletePost } from "../controllers/postController.js"
import auth from '../middlewares/authMiddleware.js'

const router = Router()

router.route('/create').post(auth,createPost)
router.route('/view').post(auth,viewPost)
router.route('/delete/:postId').delete(auth,deletePost)

export default router