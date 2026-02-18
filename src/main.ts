import './style.css'
import { createTask, deleteTask, getTasks, updateTask } from './services/taskService';
import type { TaskStatus } from './types/tasks';

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
    app.innerHTML = `
        <h1>Task Board</h1>

        <div>
            <input
                type="text"
                id="taskInput"
                placeHolder="Write a task..."
            />
            <button id="addBtn">Add</button>
        </div>
        
        <div style="display: flex; gap: 20px; margin-top: 20px;">
            <div style="flex: 1; border: 1px solid #ccc; padding: 10px;">
                <h2>Pending</h2>
                <div id="pendingTasks"></div>
            </div>

            <div style="flex: 1; border: 1px solid #ccc; padding: 10px;">
                <h2>In Progress</h2>
                <div id="inProgressTasks"></div>
            </div>

            <div style="flex: 1; border: 1px solid #ccc; padding: 10px;">
                <h2>Completed</h2>
                <div id="completedTasks"></div>
            </div>
        </div>
    `

    const input = document.querySelector<HTMLInputElement>('#taskInput')
    const button = document.querySelector<HTMLButtonElement>('#addBtn')

    button?.addEventListener('click', () => {
        const taskText = input?.value || ''

        if (taskText.trim() !== '') {
            createTask({ title: taskText })

            if (input) input.value = ''

            showTasks();
        }
    })

    function showTasks() {
        const allTasks = getTasks()

        const pendingContainer = document.querySelector<HTMLDivElement>('#pendingTasks')
        const inProgressContainer = document.querySelector<HTMLDivElement>('#inProgressTasks')
        const completedContainer = document.querySelector<HTMLDivElement>('#completedTasks')

        if (pendingContainer) pendingContainer.innerHTML = ''
        if (inProgressContainer) inProgressContainer.innerHTML = ''
        if (completedContainer) completedContainer.innerHTML = ''

        allTasks.forEach(task => {
            const taskDiv = document.createElement('div')
            taskDiv.style.border = '1px solid #999'
            taskDiv.style.padding = '10px'
            taskDiv.style.marginBottom = '10px'

            taskDiv.innerHTML = `
                <p><strong>${task.title}</strong></p>
                <p style="font-size: 12px;">Created: ${task.createdAt.toLocaleString()}</p>
                ${
                    task.status !== 'in_progress' ?
                    `<button data-id="${task.id}" data-action="in_progress">Mark In Progress</button>`
                    : ''
                }
                ${
                    task.status !== 'completed' ?
                    `<button data-id="${task.id}" data-action="completed">Mark Completed</button>`
                    : ''
                }

                <button data-id="${task.id}" data-action="delete">Delete</button>
            `
            
            const buttons = taskDiv.querySelectorAll('button')
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const taskId = button.dataset.id! //The exclamation mark is known as non-null assertion
                    const action = button.dataset.action

                    if (action === 'delete') {
                        deleteTask({ id: taskId })
                    } else {
                        updateTask({ id: taskId, status: action as TaskStatus })
                    }
                    
                    showTasks()
                })
            })

            if (task.status === 'pending' && pendingContainer) {
                pendingContainer.appendChild(taskDiv)
            } else if (task.status === 'in_progress' && inProgressContainer) {
                inProgressContainer.appendChild(taskDiv)
            } else if (task.status === 'completed' && completedContainer) {
                completedContainer.appendChild(taskDiv)
            }
        })
    }

    showTasks() // Render tasks on page load.
}