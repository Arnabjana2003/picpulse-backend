import {Router} from "express"
import auth from "../middlewares/authMiddleware.js"
import { addComment } from "../controllers/commentController.js"

const router = Router()
router.route('/add').post(auth,addComment)


export default router
