import "./style.css";
import { z } from "zod";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "./services/taskService";
import type { TaskStatus } from "./types/tasks";

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.innerHTML = `
        <div class="min-h-screen bg-gray-100 p-8">
            <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">Task Board</h1>

            <div class="max-w-md mx-auto mb-8 flex gap-2">
                <input
                    type="text"
                    id="taskInput"
                    placeHolder="Write a task..."
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                    id="addBtn"
                    class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                    Add
                </button>
            </div>
            
            <div class="grid grid-cols-3 gap-4">
                <div class="bg-white rounded-lg shadow p-4">
                    <h2 class="text-xl font-semibold mb-4 text-gray-700">Pending</h2>
                    <div id="pendingTasks"></div>
                </div>

                <div class="bg-white rounded-lg shadow p-4">
                    <h2 class="text-xl font-semibold mb-4 text-gray-700">In Progress</h2>
                    <div id="inProgressTasks"></div>
                </div>

                <div class="bg-white rounded-lg shadow p-4">
                    <h2 class="text-xl font-semibold mb-4 text-gray-700">Completed</h2>
                    <div id="completedTasks"></div>
                </div>
            </div>
        </div>
    `;

  const input = document.querySelector<HTMLInputElement>("#taskInput");
  const button = document.querySelector<HTMLButtonElement>("#addBtn");

  button?.addEventListener("click", () => {
    const title = input?.value || "";

    try {
      createTask({ title });

      if (input) input.value = "";
      showTasks();
    } catch (error) {
      if (error instanceof z.ZodError)
        alert(`Error: ${error.issues[0].message}`);
    }
  });

  function showTasks() {
    const allTasks = getTasks();

    const pendingContainer =
      document.querySelector<HTMLDivElement>("#pendingTasks");
    const inProgressContainer =
      document.querySelector<HTMLDivElement>("#inProgressTasks");
    const completedContainer =
      document.querySelector<HTMLDivElement>("#completedTasks");

    if (pendingContainer) pendingContainer.innerHTML = "";
    if (inProgressContainer) inProgressContainer.innerHTML = "";
    if (completedContainer) completedContainer.innerHTML = "";

    allTasks.forEach((task) => {
      const taskDiv = document.createElement("div");
      taskDiv.style.border = "1px solid #999";
      taskDiv.style.padding = "10px";
      taskDiv.style.marginBottom = "10px";

      taskDiv.innerHTML = `
                <p class="font-semibold text-gray-800 mb-1" id="title-${task.id}">${task.title}</p>
                <p class="text-xs text-gray-500 mb-3">Created: ${task.createdAt.toLocaleString()}</p>

                <div class="flex flex-wrap gap-1">
                    <button
                        data-id="${task.id}"
                        data-action="edit"
                        class="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition"
                    >
                        Edit
                    </button>

                    ${
                      task.status !== "in_progress"
                        ? `<button
                                data-id="${task.id}"
                                data-action="in_progress"
                                class="px-2 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded transition"
                            >
                                → In Progress
                            </button>`
                        : ""
                    }
                    ${
                      task.status !== "completed"
                        ? `<button
                                data-id="${task.id}"
                                data-action="completed"
                                class="px-2 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded transition"
                            >
                                ✓ Completed
                            </button>`
                        : ""
                    }

                    <button
                        data-id="${task.id}"
                        data-action="delete"
                        class="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition"
                        >
                            Delete
                        </button>
                </div>
            `;

      const buttons = taskDiv.querySelectorAll("button");
      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          const taskId = button.dataset.id!; //The exclamation mark is known as non-null assertion
          const action = button.dataset.action;

          if (action === "delete") {
            deleteTask({ id: taskId });
          } else if (action === "edit") {
            handleEdit(taskId);
          } else {
            updateTask({ id: taskId, status: action as TaskStatus });
          }

          showTasks();
        });
      });

      if (task.status === "pending" && pendingContainer) {
        pendingContainer.appendChild(taskDiv);
      } else if (task.status === "in_progress" && inProgressContainer) {
        inProgressContainer.appendChild(taskDiv);
      } else if (task.status === "completed" && completedContainer) {
        completedContainer.appendChild(taskDiv);
      }
    });
  }

  function handleEdit(taskId: string) {
    const titleElement = document.querySelector<HTMLElement>(
      `#title-${taskId}`,
    );

    if (!titleElement) return;

    const currentTitle = titleElement.textContent || "";
    const newTitle = prompt("Edit task title:", currentTitle);

    if (newTitle !== null) {
      try {
        updateTask({ id: taskId, title: newTitle.trim() });
        showTasks();
      } catch (error) {
        if (error instanceof z.ZodError) {
          alert(`Error: ${error.issues[0].message}`);
        }
      }
    }
  }

  showTasks(); //Render tasks on page load
}
