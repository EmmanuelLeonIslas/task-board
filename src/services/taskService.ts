import type {
  CreateTaskDTO,
  DeleteTaskDTO,
  Task,
  UpdateTaskDTO,
} from '../types/tasks';
import {
  CreateTaskDTOSchema,
  UpdateTaskDTOSchema,
  DeleteTaskDTOSchema,
} from '../schemas/taskSchemas';
import { API_URL } from '../config/api';
import { getToken } from './authService';

function getAuthHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }), // Add token if exists
  };
}

export async function createTask(data: CreateTaskDTO): Promise<Task> {
  const validatedData = CreateTaskDTOSchema.parse(data);

  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(validatedData),
  });

  if (!response.ok) {
    throw new Error('Failed to create task');
  }

  return response.json();
}

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_URL}/tasks`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  return response.json();
}

export async function updateTask(data: UpdateTaskDTO): Promise<Task> {
  const validatedData = UpdateTaskDTOSchema.parse(data);

  const { _id, ...updateData } = validatedData;

  const response = await fetch(`${API_URL}/tasks/${_id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    throw new Error('Failed to update task');
  }

  return response.json();
}

export async function deleteTask(data: DeleteTaskDTO): Promise<Task> {
  const validatedData = DeleteTaskDTOSchema.parse(data);

  const response = await fetch(`${API_URL}/tasks/${validatedData._id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to update task');
  }

  return response.json();
}
