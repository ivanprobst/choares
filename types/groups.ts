import { UserAtomType } from "./users";

export interface GroupSessionAtomType {
  id: string;
  name: string;
  members: Array<{ user: UserAtomType }>;
}

export interface GroupAtomType {
  id: string;
  name: string;
  members: Array<{ user: UserAtomType }>;
}

export interface GroupAPIReturnedType {
  id: string;
  name: string;
  members: Array<{ user: UserAtomType }>;
}
