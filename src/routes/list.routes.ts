import { Router } from "express"
import {
  createList,
  getLists,
  getList,
  updateList,
  deleteList,
} from "../controllers/list.controller"

const router = Router()

router.route("/").get(getLists).post(createList)
router.route("/:id").get(getList).put(updateList).delete(deleteList)

export default router
