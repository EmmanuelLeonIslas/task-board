import { z } from "zod";

export const TaskStatusSchema = z.enum(["pending", "in_progress", "completed"]);

export const TaskSchema = z.object({
  _id: z.string(),
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(100, "Title is too long"),
  status: TaskStatusSchema,
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]).optional(),
});

export const CreateTaskDTOSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(100, "Title is too long"),
});

export const UpdateTaskDTOSchema = z.object({
  _id: z.string(),
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(100, "Title is too long")
    .optional(),
  status: TaskStatusSchema.optional(),
});

export const DeleteTaskDTOSchema = z.object({
  _id: z.string(),
});
