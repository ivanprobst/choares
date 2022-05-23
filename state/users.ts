import { atom } from "jotai";
import { UserAtomType } from "../types/users";

export const userSessionAtom = atom<UserAtomType>({
  id: "",
  name: undefined,
  email: undefined,
});
