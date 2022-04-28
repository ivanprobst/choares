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
  name: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  completedAt?: Date;
}
export type TaskDBType = DBBaseType & TaskDataType;
export const isTaskDataType = (data: any): data is TaskDataType => {
  return !!data.name;
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
