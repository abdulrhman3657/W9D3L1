import { Request, Response } from 'express';
import { itemStore } from '../store/item.store';
import { listStore } from '../store/list.store';
import { OK, CREATED, BAD_REQUEST, NOT_FOUND } from '../utils/http-status';

export const createItem = async (req: Request, res: Response): Promise<void> => {
  try {
    // get listId from url
    const { listId } = req.params;
    // get the data from the request body
    const { title, description = '', completed = false } = req.body;

    if (!title) {
      res.status(BAD_REQUEST).json({
        success: false,
        error: 'Title is required',
      });
      return;
    }

    const list = listStore.findById(listId);
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'List not found',
      });
      return;
    }

    const item = itemStore.create({ listId, title, description, completed });
    
    // return the created item as response
    res.status(CREATED).json({
      success: true,
      data: item,
    });

  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create item',
    });
  }
};

export const getListItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listId } = req.params;
    const list = listStore.findById(listId);
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'List not found',
      });
      return;
    }

    const items = itemStore.findByListId(listId);
    res.status(OK).json({
      success: true,
      data: items,
    });
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch items',
    });
  }
};

export const getItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listId, id } = req.params;
    const list = listStore.findById(listId);
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'List not found',
      });
      return;
    }

    const item = itemStore.findById(id);
    if (!item || item.listId !== listId) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'Item not found in this list',
      });
      return;
    }

    res.status(OK).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch item',
    });
  }
};

export const updateItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listId, id } = req.params;
    const list = listStore.findById(listId);
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'List not found',
      });
      return;
    }

    const existingItem = itemStore.findById(id);
    if (!existingItem || existingItem.listId !== listId) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'Item not found in this list',
      });
      return;
    }

    const item = itemStore.update(id, req.body);
    res.status(OK).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update item',
    });
  }
};

export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listId, id } = req.params;
    const list = listStore.findById(listId);
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'List not found',
      });
      return;
    }

    const existingItem = itemStore.findById(id);
    if (!existingItem || existingItem.listId !== listId) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'Item not found in this list',
      });
      return;
    }

    itemStore.delete(id);
    res.status(OK).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete item',
    });
  }
}; 