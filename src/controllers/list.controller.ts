import { Request, Response } from 'express';
import { listStore } from '../store/list.store';
import { itemStore } from '../store/item.store';
import { OK, CREATED, BAD_REQUEST, NOT_FOUND } from '../utils/http-status';

export const createList = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description = '' } = req.body;

    if (!title) {
      res.status(BAD_REQUEST).json({
        success: false,
        error: 'Title is required',
      });
      return;
    }

    const list = listStore.create({ title, description });
    res.status(CREATED).json({
      success: true,
      data: list,
    });
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create list',
    });
  }
};

export const getLists = async (_req: Request, res: Response): Promise<void> => {
  try {
    const lists = listStore.findAll();
    res.status(OK).json({
      success: true,
      data: lists,
    });
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch lists',
    });
  }
};

export const getList = async (req: Request, res: Response): Promise<void> => {
  try {
    const list = listStore.findById(req.params.id);
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'List not found',
      });
      return;
    }

    const items = itemStore.findByListId(list.id);
    res.status(OK).json({
      success: true,
      data: {
        ...list,
        items,
      },
    });
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch list',
    });
  }
};

export const updateList = async (req: Request, res: Response): Promise<void> => {
  try {
    const list = listStore.update(req.params.id, req.body);
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'List not found',
      });
      return;
    }
    res.status(OK).json({
      success: true,
      data: list,
    });
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update list',
    });
  }
};

export const deleteList = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = listStore.delete(req.params.id);
    if (!deleted) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'List not found',
      });
      return;
    }

    // Delete all items in the list
    itemStore.deleteByListId(req.params.id);

    res.status(OK).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete list',
    });
  }
}; 