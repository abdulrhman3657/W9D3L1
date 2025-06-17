import { Item } from "../models/item.model";
import { generateId } from "../utils/generate-id";

const items: Map<string, Item> = new Map();

const create = (data: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Item => {
  const id = generateId();
  const now = new Date();
  const item: Item = {
    id,
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  
  items.set(id, item);
  return item;
}

const findAll = (): Item[] => {
  return Array.from(items.values());
}

const findById = (id: string): Item | undefined => {
  return items.get(id);
}

const findByListId = (listId: string): Item[] => {
  return findAll().filter(item => item.listId === listId);
}

const update = (id: string, data: Partial<Omit<Item, 'id' | 'listId' | 'createdAt'>>): Item | undefined => {
  const item = items.get(id);
  if (!item) return undefined;

  const updatedItem: Item = {
    ...item,
    ...data,
    updatedAt: new Date(),
  };

  items.set(id, updatedItem);
  return updatedItem;
}

const deleteItem = (id: string): boolean => {
  return items.delete(id);
}

const deleteByListId = (listId: string): void => {
  const itemsToDelete = findByListId(listId);
  itemsToDelete.forEach(item => items.delete(item.id));
}

export const itemStore = {
  create,
  findAll,
  findById,
  findByListId,
  update,
  delete: deleteItem,
  deleteByListId,
};