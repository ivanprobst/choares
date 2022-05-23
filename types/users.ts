export interface UserAtomType {
  id: string;
  name: string | null | undefined;
  email?: string | null | undefined;
}

export interface UserAPIReturnedType {
  id: string;
  name: string | null | undefined;
  email?: string | null | undefined;
}
