export type TaskStatus = "pending" | "in_progress" | "completed"

export interface Task {
    readonly id: string,
    title: string,
    status: TaskStatus,
    readonly createdAt: Date
}

export type CreateTaskDTO = Pick<Task, "title">
export type UpdateTaskDTO = Partial<Omit<Task, "createdAt">> & Pick<Task, "id">
export type DeleteTaskDTO = Pick<Task, "id">