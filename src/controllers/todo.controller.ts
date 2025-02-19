import { Request, Response } from "express";
import Todu from "../models/todo.model";
import sendResponse from "../helpers";

export const getTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Todu.find();
    sendResponse(res, 200, { success: true, data: todos });
  } catch (error) {
    sendResponse(res, 500, {
      success: false,
      errorMessage: "Failed to fetch todos",
    });
  }
};

export const getSingleTodo = async (req: Request, res: Response) => {
  try {
    const singleTodo = await Todu.findById(req.params.id);
    if (!singleTodo) {
      return sendResponse(res, 404, {
        success: false,
        errorMessage: "Todo not found",
      });
    }
    return sendResponse(res, 200, {
      success: true,
      data: singleTodo,
    });
  } catch (error) {
    sendResponse(res, 500, {
      success: false,
      errorMessage: "Failed to fetch todo",
    });
  }
};

export const createNewTodo = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const newTodo = await Todu.create({ title, description });
    sendResponse(res, 201, {
      success: true,
      data: newTodo,
    });
  } catch (error) {
    sendResponse(res, 500, {
      success: false,
      errorMessage: "Internal Server Error",
    });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const updateTodo = await Todu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updateTodo) {
      sendResponse(res, 404, {
        success: false,
        errorMessage: "Todo not found",
      });
    }
    sendResponse(res, 200, {
      success: true,
      data: updateTodo,
    });
  } catch (error) {
    sendResponse(res, 500, {
      success: false,
      errorMessage: "Failed to update todo",
    });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const deletedTodo = await Todu.findByIdAndDelete(req.params.id);
    if (!deletedTodo)
      return sendResponse(res, 500, {
        success: false,
        errorMessage: "Todo not found",
      });

    sendResponse(res, 200, {
      success: true,
      data: deletedTodo,
    });
  } catch (error) {
    sendResponse(res, 500, {
      success: false,
      errorMessage: "Failed to delete todo",
    });
  }
};
