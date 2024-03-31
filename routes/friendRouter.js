import {Router} from "express"
import { acceptResquest, rejectResquest, sendRequest,suggestedFriends,pendingFriendRequests,getPendingReqCount,getAllFriends } from "../controllers/friendController.js"
import auth from "../middlewares/authMiddleware.js"

const router = Router()

router.route("/send").post(auth,sendRequest)
router.route("/accept").post(auth,acceptResquest)
router.route("/reject").post(auth,rejectResquest)
router.route("/suggestedfriends").get(auth,suggestedFriends)
router.route("/friendrequest").get(auth,pendingFriendRequests)
router.route("/pendingcount").get(auth,getPendingReqCount)
router.route("/all").get(auth,getAllFriends)

export default router