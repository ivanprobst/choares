export interface TaskAtomType {
  id: string;
  name: string;
  description: string | null | undefined;
  dueDate: string | null | undefined;
  completed: boolean;
  assigneeId?: string;
}
