import { Router } from "express"
import {
  createList,
  getLists,
  getList,
  updateList,
  deleteList,
} from "../controllers/list.controller"

// list router
const router = Router()

// list router base route, handeles get and post
router.route("/").get(getLists).post(createList)

// get, update, delete a list by its id
router.route("/:id").get(getList).put(updateList).delete(deleteList)

export default router
