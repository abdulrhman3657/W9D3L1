import { Router } from "express"
import {
  createItem,
  getListItems,
  getItem,
  updateItem,
  deleteItem,
} from "../controllers/item.controller"

const router = Router({ mergeParams: true })

router.route("/").get(getListItems).post(createItem)
router.route("/:id").get(getItem).put(updateItem).delete(deleteItem)

export default router
