import {Router} from "express"
import auth from "../middlewares/authMiddleware.js"
import { like ,unlike} from "../controllers/likeController.js"

const router = Router()

router.route('/').post(auth,like)
router.route('/unlike').post(auth,unlike)

export default router