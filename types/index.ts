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

export interface TaskDataType {
  groupId: string;
  assigneeId?: string;
  name: string;
  description?: string;
  dueDate?: string;
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
    !!data.completedAt
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
