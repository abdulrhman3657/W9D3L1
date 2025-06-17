import { List } from "../models/list.model";
import { generateId } from "../utils/generate-id";

const lists: Map<string, List> = new Map();

const create = (data: Omit<List, 'id' | 'createdAt' | 'updatedAt'>): List => {
  const id = generateId();
  const now = new Date();
  const list: List = {
    id,
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  
  lists.set(id, list);
  return list;
}

const findAll = (): List[] => {
  return Array.from(lists.values());
}

const findById = (id: string): List | undefined => {
  return lists.get(id);
}

const update = (id: string, data: Partial<Omit<List, 'id' | 'createdAt'>>): List | undefined => {
  const list = lists.get(id);
  if (!list) return undefined;

  const updatedList: List = {
    ...list,
    ...data,
    updatedAt: new Date(),
  };

  lists.set(id, updatedList);
  return updatedList;
}

const deleteList = (id: string): boolean => {
  return lists.delete(id);
}

export const listStore = {
  create,
  findAll,
  findById,
  update,
  delete: deleteList,
};