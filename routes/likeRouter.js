import {Router} from "express"
import auth from "../middlewares/authMiddleware.js"
import { like } from "../controllers/likeController.js"

const router = Router()

router.route('/').post(auth,like)

export default router