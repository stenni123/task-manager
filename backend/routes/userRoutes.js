import express from "express";
const router = express.Router();
import {
  authUser,
  logoutUser,
  getUserProfile,
  addEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.post("/login", authUser);
router.post("/logout", protect, logoutUser);
router.get("/profile", protect, getUserProfile);

// Admin routes
router
  .route("/")
  .post(protect, admin, addEmployee)
  .get(protect, admin, getEmployees);

router
  .route("/:id")
  .get(protect, admin, getEmployeeById)
  .put(protect, admin, updateEmployee)
  .delete(protect, admin, deleteEmployee);

export default router;
