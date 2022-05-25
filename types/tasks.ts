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

export interface TaskAtomType {
  id: string;
  name: string;
  description: string | null | undefined;
  dueDate: string | null | undefined;
  completed: boolean;
  assigneeId?: string;
}
