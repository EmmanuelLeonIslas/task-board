import type { CreateTaskDTO, DeleteTaskDTO, Task, UpdateTaskDTO } from "../types/tasks";

let tasks: Task[] = []

export function createTask(data: CreateTaskDTO): Task {
    const newTask: Task = {
        id: crypto.randomUUID(), //A browser function that returns a unique set of characters.
        title: data.title,
        status: "pending",
        createdAt: new Date()
    }

    tasks.push(newTask)
    return newTask
}

export function getTasks(): Task[] {
    return tasks
}

export function deleteTask(data: DeleteTaskDTO): void {
    const index = tasks.findIndex(task => task.id === data.id)

    if (index !== -1)
        tasks.splice(index, 1)
}

export function updateTask(data: UpdateTaskDTO): void {
    const task = tasks.find(task => task.id === data.id)

    if (task) {
        if (data.title !== undefined)
            task.title = data.title

        if (data.status !== undefined)
            task.status = data.status
    }
}