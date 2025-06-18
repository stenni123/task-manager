import express from "express";
const router = express.Router();
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from "../controllers/taskController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

// Admin can do everything
router.route("/").post(protect, admin, createTask).get(protect, getTasks); // Employee can also get their tasks

router
  .route("/:id")
  .get(protect, getTaskById) // Employee can also get task by id
  .put(protect, admin, updateTask)
  .delete(protect, admin, deleteTask);

// Employee specific route to update their task status
router.put("/:id/status", protect, updateTaskStatus);

export default router;
