import { atom } from "jotai";
import { GroupAtomType, GroupSessionAtomType } from "../types/groups";

export const groupSessionAtom = atom<GroupSessionAtomType | undefined>(
  undefined
);

export const groupsMapAtom = atom<Map<string, GroupAtomType> | undefined>(
  undefined
);

export const groupsArrayAtom = atom<Array<GroupAtomType> | undefined>((get) => {
  const groupsMap = get(groupsMapAtom);
  if (!groupsMap) {
    return undefined;
  }

  return Array.from(groupsMap).map(([key, group]) => group);
});

export const groupAtom = atom<GroupAtomType | undefined>(undefined);
