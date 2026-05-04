import "./style.css";
import { z } from "zod";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "./services/taskService";
import {
  signUp,
  signIn,
  signOut,
  isAuthenticated,
} from "./services/authService";
import type { Task, TaskStatus } from "./types/tasks";

const app = document.querySelector<HTMLDivElement>("#app");

function renderAuthForm() {
  if (!app) return;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  }

  app.innerHTML = `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-8 transition-colors duration-300">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Task Board</h1>
          <button
            id="themeToggle"
            class="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm"
          >
            ${savedTheme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>

        <!-- Tabs -->
        <div class="flex mb-6 border-b border-gray-300 dark:border-gray-600">
          <button
            id="loginTab"
            class="flex-1 py-2 text-center font-semibold border-b-2 border-blue-500 text-blue-500"
          >
            Login
          </button>
          <button
            id="signupTab"
            class="flex-1 py-2 text-center font-semibold text-gray-500 dark:text-gray-400"
          >
            Sign Up
          </button>
        </div>

        <!-- Login Form -->
        <form id="loginForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              id="loginEmail"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              id="loginPassword"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
          >
            Login
          </button>
        </form>

        <!-- Signup Form (hidden by default) -->
        <form id="signupForm" class="space-y-4 hidden">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input
              type="text"
              id="signupName"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              id="signupEmail"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              id="signupPassword"
              required
              minlength="6"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Minimum 6 characters</p>
          </div>
          <button
            type="submit"
            class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
          >
            Sign Up
          </button>
        </form>

        <div id="authError" class="mt-4 hidden p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg text-sm"></div>
      </div>
    </div>
  `;

  // Theme toggle
  const themeToggle = document.querySelector("#themeToggle");
  themeToggle?.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    if (themeToggle) themeToggle.textContent = isDark ? "☀️" : "🌙";
  });

  // Tab switching
  const loginTab = document.querySelector("#loginTab");
  const signupTab = document.querySelector("#signupTab");
  const loginForm = document.querySelector("#loginForm");
  const signupForm = document.querySelector("#signupForm");

  loginTab?.addEventListener("click", () => {
    loginTab.classList.add("border-b-2", "border-blue-500", "text-blue-500");
    loginTab.classList.remove("text-gray-500", "dark:text-gray-400");
    signupTab?.classList.remove("border-b-2", "border-blue-500", "text-blue-500");
    signupTab?.classList.add("text-gray-500", "dark:text-gray-400");
    loginForm?.classList.remove("hidden");
    signupForm?.classList.add("hidden");
  });

  signupTab?.addEventListener("click", () => {
    signupTab.classList.add("border-b-2", "border-blue-500", "text-blue-500");
    signupTab.classList.remove("text-gray-500", "dark:text-gray-400");
    loginTab?.classList.remove("border-b-2", "border-blue-500", "text-blue-500");
    loginTab?.classList.add("text-gray-500", "dark:text-gray-400");
    signupForm?.classList.remove("hidden");
    loginForm?.classList.add("hidden");
  });

  // Login form submission
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = (document.querySelector("#loginEmail") as HTMLInputElement)?.value;
    const password = (document.querySelector("#loginPassword") as HTMLInputElement)?.value;
    const errorDiv = document.querySelector("#authError");

    try {
      await signIn({ email, password });
      renderTaskBoard(); // Change task board view
    } catch (error) {
      if (errorDiv) {
        errorDiv.textContent = error instanceof Error ? error.message : "Login failed";
        errorDiv.classList.remove("hidden");
      }
    }
  });

  // Signup form submission
  signupForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = (document.querySelector("#signupName") as HTMLInputElement)?.value;
    const email = (document.querySelector("#signupEmail") as HTMLInputElement)?.value;
    const password = (document.querySelector("#signupPassword") as HTMLInputElement)?.value;
    const errorDiv = document.querySelector("#authError");

    try {
      await signUp({ name, email, password });
      renderTaskBoard(); // Change task board view
    } catch (error) {
      if (errorDiv) {
        errorDiv.textContent = error instanceof Error ? error.message : "Sign up failed";
        errorDiv.classList.remove("hidden");
      }
    }
  });
}

function renderTaskBoard() {
  if (!app) return;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  }

  app.innerHTML = `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 transition-colors duration-300">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 dark:text-white">Task Board</h1>
        <div class="flex gap-2">
          <button
            id="themeToggle"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer select-none"
          >
            ${savedTheme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
          <button
            id="logoutBtn"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer select-none"
          >
            Logout
          </button>
        </div>
      </div>

      <div class="max-w-md mx-auto mb-8 flex gap-2">
        <input
          type="text"
          id="taskInput"
          placeholder="Write a task..."
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

  // Theme toggle
  const themeToggle = document.querySelector("#themeToggle");
  themeToggle?.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    if (themeToggle) themeToggle.textContent = isDark ? "☀️ Light" : "🌙 Dark";
  });

  // Logout button
  const logoutBtn = document.querySelector("#logoutBtn");
  logoutBtn?.addEventListener("click", () => {
    signOut();
  });

  // Task input and add button
  const input = document.querySelector<HTMLInputElement>("#taskInput");
  const button = document.querySelector<HTMLButtonElement>("#addBtn");

  button?.addEventListener("click", async () => {
    const title = input?.value || "";

    try {
      await createTask({ title });
      if (input) input.value = "";
      await showTasks();
    } catch (error) {
      if (error instanceof z.ZodError) {
        alert(`Error: ${error.issues[0].message}`);
      } else if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      }
    }
  });

  async function showTasks() {
    try {
      const allTasks = await getTasks();

      const pendingContainer = document.querySelector<HTMLDivElement>("#pendingTasks");
      const inProgressContainer = document.querySelector<HTMLDivElement>("#inProgressTasks");
      const completedContainer = document.querySelector<HTMLDivElement>("#completedTasks");

      if (pendingContainer) pendingContainer.innerHTML = "";
      if (inProgressContainer) inProgressContainer.innerHTML = "";
      if (completedContainer) completedContainer.innerHTML = "";

      allTasks.forEach((task: Task) => {
        const taskDiv = document.createElement("div");
        taskDiv.className =
          "bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 mb-3 hover:shadow-lg hover:scale-101 transition-all duration-300 ease-out opacity-0";

        const createdAt =
          typeof task.createdAt === "string"
            ? new Date(task.createdAt).toLocaleString()
            : task.createdAt.toLocaleString();

        taskDiv.innerHTML = `
          <p class="font-semibold text-gray-800 dark:text-white mb-1" id="title-${task._id}">${task.title}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">Created: ${createdAt}</p>

          <div class="flex flex-wrap gap-1">
            <button
              data-id="${task._id}"
              data-action="edit"
              class="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded transition cursor-pointer select-none"
            >
              Edit
            </button>

            ${
              task.status !== "in_progress"
                ? `<button
                    data-id="${task._id}"
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
                    data-id="${task._id}"
                    data-action="completed"
                    class="px-2 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded transition cursor-pointer select-none"
                  >
                    ✓ Completed
                  </button>`
                : ""
            }

            <button
              data-id="${task._id}"
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
        }, 10);

        const buttons = taskDiv.querySelectorAll("button");
        buttons.forEach((button) => {
          button.addEventListener("click", async () => {
            const taskId = button.dataset.id!;
            const action = button.dataset.action;

            try {
              if (action === "delete") {
                await deleteTask({ _id: taskId });
              } else if (action === "edit") {
                await handleEdit(taskId);
              } else {
                await updateTask({ _id: taskId, status: action as TaskStatus });
              }

              await showTasks();
            } catch (error) {
              if (error instanceof Error) {
                alert(`Error: ${error.message}`);
              }
            }
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
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error loading tasks: ${error.message}`);
      }
    }
  }

  async function handleEdit(taskId: string) {
    const titleElement = document.querySelector<HTMLElement>(`#title-${taskId}`);

    if (!titleElement) return;

    const currentTitle = titleElement.textContent || "";
    const newTitle = prompt("Edit task title:", currentTitle);

    if (newTitle !== null) {
      try {
        await updateTask({ _id: taskId, title: newTitle.trim() });
        await showTasks();
      } catch (error) {
        if (error instanceof z.ZodError) {
          alert(`Error: ${error.issues[0].message}`);
        } else if (error instanceof Error) {
          alert(`Error: ${error.message}`);
        }
      }
    }
  }

  showTasks();
}

if (app) {
  if (isAuthenticated()) {
    renderTaskBoard();
  } else {
    renderAuthForm();
  }
}