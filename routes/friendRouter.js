import {Router} from "express"
import { acceptResquest, rejectResquest, sendRequest } from "../controllers/friendController.js"
import auth from "../middlewares/authMiddleware.js"

const router = Router()

router.route("/send").post(auth,sendRequest)
router.route("/accept").post(auth,acceptResquest)
router.route("/reject").post(auth,rejectResquest)

export default router