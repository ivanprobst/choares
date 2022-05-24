interface APIResponseSuccess<DataType> {
  success: true;
  data: DataType;
}
interface APIResponseFailed {
  success: false;
  error_type: string;
}
export type APIResponseType<DataType = undefined> =
  | APIResponseSuccess<DataType>
  | APIResponseFailed;

interface DBBaseType {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum TaskFilterWhenType {
  today = "today",
  all = "all",
  noDate = "noDate",
}
export enum TaskFilterWhoType {
  me = "me",
  everyone = "everyone",
}
export enum RecurringType {
  weekly = "weekly",
  monthly = "monthly",
}

export interface TaskDataType {
  groupId: string;
  assigneeId?: string;
  name: string;
  description?: string;
  dueDate: string | null;
  recurring: RecurringType | null;
  completed: boolean;
  completedAt?: Date;
}

interface GroupDataType {
  name: string;
  members: Array<{ user: UserDataType }>;
}
export type GroupDBType = DBBaseType & GroupDataType;

export interface UserDataType {
  name: string;
  email: string;
}
export type UserDBType = DBBaseType & UserDataType;
