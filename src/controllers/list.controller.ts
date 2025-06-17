import { Request, Response } from "express"
import { listStore } from "../store/list.store"
import { itemStore } from "../store/item.store"
import { OK, CREATED, BAD_REQUEST, NOT_FOUND } from "../utils/http-status"

// create a new list
export const createList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // get the list data from the request body
    const { title, description = "" } = req.body

    // if the title is not provided
    if (!title) {
      res.status(BAD_REQUEST).json({
        success: false,
        error: "Title is required",
      })
      return
    }

    // create a new list
    const list = listStore.create({ title, description })

    // return the new list as response
    res.status(CREATED).json({
      success: true,
      data: list,
    })
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to create list",
    })
  }
}

// get all lists
export const getLists = async (_req: Request, res: Response): Promise<void> => {
  try {
    const lists = listStore.findAll()
    // return the lists
    res.status(OK).json({
      success: true,
      data: lists,
    })
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch lists",
    })
  }
}

// get a list by its id
export const getList = async (req: Request, res: Response): Promise<void> => {
  try {
    // find the list by its id from the request body
    const list = listStore.findById(req.params.id)

    // if the list is not found
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: "List not found",
      })
      return
    }

    // find the list items
    const items = itemStore.findByListId(list.id)

    // return the list
    res.status(OK).json({
      success: true,
      data: {
        ...list,
        items,
      },
    })
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch list",
    })
  }
}

// update a list by its id
export const updateList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const list = listStore.update(req.params.id, req.body)
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: "List not found",
      })
      return
    }
    res.status(OK).json({
      success: true,
      data: list,
    })
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to update list",
    })
  }
}

// delete a list by its id
export const deleteList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deleted = listStore.delete(req.params.id)
    if (!deleted) {
      res.status(NOT_FOUND).json({
        success: false,
        error: "List not found",
      })
      return
    }

    // Delete all items in the list
    itemStore.deleteByListId(req.params.id)

    res.status(OK).json({
      success: true,
      data: {},
    })
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete list",
    })
  }
}
