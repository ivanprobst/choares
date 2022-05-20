import { atom } from "jotai";
import { TaskAtomType } from "../types/tasks";

export const tasksMapAtom = atom<Map<string, TaskAtomType> | undefined>(
  undefined
);

export const tasksArrayAtom = atom<Array<TaskAtomType> | undefined>((get) => {
  const tasksMap = get(tasksMapAtom);
  if (!tasksMap) {
    return undefined;
  }

  return Array.from(tasksMap).map(([key, task]) => task);
});

export const tasksArrayFilteredAtom = atom<Array<TaskAtomType> | undefined>(
  undefined
);

export const taskAtom = atom<TaskAtomType | undefined>(undefined);
