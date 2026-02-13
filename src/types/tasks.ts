export type TaskStatus = "pending" | "in_progress" | "completed"

export interface Task {
    readonly id: string,
    title: string,
    status: TaskStatus,
    readonly createdAt: Date
}

export type CreateTaskDTO = Pick<Task, "title">