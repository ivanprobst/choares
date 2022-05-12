interface APIResponseSuccess {
  success: true;
  data?: any;
}
interface APIResponseFailed {
  success: false;
  error_type: string;
}
export type APIResponseType = APIResponseSuccess | APIResponseFailed;

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

export interface TaskDataType {
  groupId: string;
  assigneeId?: string;
  name: string;
  description?: string;
  dueDate: string | null;
  completed: boolean;
  completedAt?: Date;
}
export type TaskDBType = DBBaseType & TaskDataType;
export const isTaskDataType = (data: any): data is TaskDataType => {
  return !!data.name && !!data.groupId;
};
export const isTaskUpdateType = (data: any) => {
  return (
    !!data.name ||
    !!data.description ||
    !!data.dueDate ||
    data.completed !== undefined ||
    !!data.completedAt ||
    !!data.assignee
  );
};

export interface GroupDataType {
  name: string;
  members: Array<{ user: UserDataType }>;
}
export type GroupDBType = DBBaseType & GroupDataType;
export const isGroupCreationType = (data: any): data is GroupDataType => {
  return !!data.name;
};

export interface UserDataType {
  name: string;
  email: string;
}
export type UserDBType = DBBaseType & UserDataType;
