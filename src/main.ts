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
  const savedTheme = localStorage.getItem("theme");

// Si no hay tema guardado, usar light por defecto
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

  app.innerHTML = `
        <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 transition-colors duration-300">
            <div class="flex justify-between items-center mb-8">
              <h1 class="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">Task Board</h1>
              <button
                id="themeToggle"
                class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer select-none"
              >
                🌙 Dark Mode
              </button>
            </div>

            <div class="max-w-md mx-auto mb-8 flex gap-2">
                <input
                    type="text"
                    id="taskInput"
                    placeHolder="Write a task..."
                    class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                    id="addBtn"
                    class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer select-none"
                >
                    Add
                </button>
            </div>
            
            <div class="grid grid-cols-3 gap-4">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <h2 class="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Pending</h2>
                  <div id="pendingTasks"></div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <h2 class="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">In Progress</h2>
                  <div id="inProgressTasks"></div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <h2 class="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Completed</h2>
                  <div id="completedTasks"></div>
                </div>
            </div>
        </div>
    `;

  const input = document.querySelector<HTMLInputElement>("#taskInput");
  const button = document.querySelector<HTMLButtonElement>("#addBtn");
  const themeToggle = document.querySelector<HTMLButtonElement>("#themeToggle");

  themeToggle?.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");

    if (themeToggle)
      themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  });

  if (themeToggle) {
    const isDark = document.documentElement.classList.contains("dark");
    themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  }

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
      taskDiv.className =
        "bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 mb-3 hover:shadow-lg hover:scale-101 transition-all duration-300 ease-out opacity-0";

      taskDiv.innerHTML = `
                <p class="font-semibold text-gray-800 dark:text-white mb-1" id="title-${task.id}">${task.title}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">Created: ${task.createdAt.toLocaleString()}</p>

                <div class="flex flex-wrap gap-1">
                    <button
                        data-id="${task.id}"
                        data-action="edit"
                        class="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded transition cursor-pointer select-none"
                    >
                        Edit
                    </button>

                    ${
                      task.status !== "in_progress"
                        ? `<button
                                data-id="${task.id}"
                                data-action="in_progress"
                                class="px-2 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded transition cursor-pointer select-none"
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
                                class="px-2 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded transition cursor-pointer select-none"
                            >
                                ✓ Completed
                            </button>`
                        : ""
                    }

                    <button
                        data-id="${task.id}"
                        data-action="delete"
                        class="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition cursor-pointer select-none"
                        >
                            Delete
                        </button>
                </div>
            `;

      setTimeout(() => {
        taskDiv.classList.remove("opacity-0");
        taskDiv.classList.add("opacity-100");
      }, 100);

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
