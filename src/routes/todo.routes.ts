import express from "express";
import MessageResponse from "../interfaces/MessageResponse";
import {
  createNewTodo,
  deleteTodo,
  getSingleTodo,
  getTodos,
  updateTodo,
} from "../controllers/todo.controller";

const router = express.Router();

router.get<{}, MessageResponse>("/todos", getTodos);

router.get<{}, MessageResponse>("/todos/:id", getSingleTodo);

router.post<{}, MessageResponse>("/todos", createNewTodo);

router.put<{}, MessageResponse>("/todos/:id", updateTodo);

router.delete<{}, MessageResponse>("/todos/:id", deleteTodo);

export default router;
