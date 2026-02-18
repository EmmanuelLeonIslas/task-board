import type { CreateTaskDTO, DeleteTaskDTO, Task, UpdateTaskDTO } from "../types/tasks";

let tasks: Task[] = loadTasksFromStorage()

function loadTasksFromStorage(): Task[] {
    const saved = localStorage.getItem('tasks')

    if (saved) {
        const parsed = JSON.parse(saved)
        console.log("entra")

        return parsed.map((task: Task) => ({
            ...task,
            createdAt: new Date(task.createdAt)
        }))
    }

    return []
}

function saveTasksToStorage(): void {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

export function createTask(data: CreateTaskDTO): Task {
    const newTask: Task = {
        id: crypto.randomUUID(), //A browser function that returns a unique set of characters.
        title: data.title,
        status: "pending",
        createdAt: new Date()
    }

    tasks.push(newTask)
    saveTasksToStorage()
    return newTask
}

export function getTasks(): Task[] {
    return tasks
}

export function updateTask(data: UpdateTaskDTO): void {
    const task = tasks.find(task => task.id === data.id)

    if (task) {
        if (data.title !== undefined)
            task.title = data.title

        if (data.status !== undefined)
            task.status = data.status
    }

    saveTasksToStorage()
}

export function deleteTask(data: DeleteTaskDTO): void {
    const index = tasks.findIndex(task => task.id === data.id)

    if (index !== -1) {
        tasks.splice(index, 1)
        saveTasksToStorage()
    }
}