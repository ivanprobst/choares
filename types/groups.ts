import { UserAPIReturnedType } from "./users";

export interface GroupSessionAtomType {
  id: string;
  name: string;
}

export interface GroupAtomType {
  id: string;
  name: string;
  members: Array<{ user: UserAPIReturnedType }>;
}

export interface GroupAPIReturnedType {
  id: string;
  name: string;
  members: Array<{ user: UserAPIReturnedType }>;
}
