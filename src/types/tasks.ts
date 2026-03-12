export type TaskStatus = "pending" | "in_progress" | "completed";

export interface Task {
  readonly _id: string;
  title: string;
  status: TaskStatus;
  readonly createdAt: Date | string; //Puede ser de string del backend
  readonly updatedAt?: Date | string; //Lo agrega MongoDB
}

export type CreateTaskDTO = Pick<Task, "title">;
export type UpdateTaskDTO = Partial<Omit<Task, "createdAt" | "updatedAt">> & Pick<Task, "_id">;
export type DeleteTaskDTO = Pick<Task, "_id">;
