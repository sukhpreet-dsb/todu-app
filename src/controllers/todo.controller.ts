import { Request, Response } from "express";
import Todu from "../models/todo.model";

export const getTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Todu.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
};

export const getSingleTodo = async (req: Request, res: Response) => {
  try {
    const singleTodo = await Todu.findById(req.params.id);
    if (!singleTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    return res.status(200).json(singleTodo);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todo" });
  }
};

export const createNewTodo = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const newTodo = await Todu.create({ title, description });
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const updateTodo = await Todu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updateTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json(updateTodo);
  } catch (error) {
    res.status(500).json({ error: "Failed to update todo" });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const deletedTodo = await Todu.findByIdAndDelete(req.params.id);
    if (!deletedTodo)
      return res.status(404).json({ message: "Todo not found" });
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
};
