import { Session } from "next-auth";

export interface UserAtomType {
  id: string;
  name: string | null | undefined;
  email: string | null | undefined;
}

export interface UserAPIReturnedType {
  id: string;
  name: string | null | undefined;
  email?: string | null | undefined;
}

export interface ValidSessionType extends Session {
  user: UserAtomType;
}
