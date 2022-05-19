import { atom } from "jotai";
import { GroupAtomType } from "../types/groups";

export const groupSessionAtom = atom<GroupAtomType | undefined>(undefined);
