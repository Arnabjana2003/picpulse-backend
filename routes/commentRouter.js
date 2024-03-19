import {Router} from "express"
import auth from "../middlewares/authMiddleware.js"
import { addComment,updateComment ,deleteComment} from "../controllers/commentController.js"

const router = Router()
router.route('/add').post(auth,addComment)
router.route('/update').post(auth,updateComment)
router.route('/delete').post(auth,deleteComment)


export default router
