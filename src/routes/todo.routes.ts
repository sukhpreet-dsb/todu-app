import express from "express";
import MessageResponse from "../interfaces/MessageResponse";
import {
  createNewTodo,
  deleteTodo,
  getSingleTodo,
  getTodos,
  updateTodo,
} from "../controllers/todo.controller";
import { validate } from "../middlewares";
import { todoSchema } from "../validations/todo.validation";

const router = express.Router();

router.get<{}, MessageResponse>("/todos", getTodos);

router.get<{}, MessageResponse>("/todos/:id", getSingleTodo);

router.post<{}, MessageResponse>("/todos", validate(todoSchema), createNewTodo);

router.put<{}, MessageResponse>("/todos/:id", validate(todoSchema), updateTodo);

router.delete<{}, MessageResponse>("/todos/:id", deleteTodo);

export default router;
