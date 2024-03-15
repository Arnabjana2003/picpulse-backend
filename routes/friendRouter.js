import {Router} from "express"
import { acceptResquest, rejectResquest, sendRequest,suggestedFriends,friendRequest } from "../controllers/friendController.js"
import auth from "../middlewares/authMiddleware.js"

const router = Router()

router.route("/send").post(auth,sendRequest)
router.route("/accept").post(auth,acceptResquest)
router.route("/reject").post(auth,rejectResquest)
router.route("/suggestedfriends").get(auth,suggestedFriends)
router.route("/friendrequest").get(auth,friendRequest)

export default router