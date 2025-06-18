import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTasks, deleteTask } from "../../features/tasks/taskSlice";
import { getEmployees } from "../../features/users/userSlice";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import Spinner from "../Spinner";
import TaskModal from "./TaskModal";

function TaskCardAdmin({ task, onEdit, onDelete }) {
  const priorityColor = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };

  const statusColor = {
    pending: "bg-gray-200 text-gray-800",
    "in-progress": "bg-blue-200 text-blue-800",
    completed: "bg-green-200 text-green-800",
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-gray-800">{task.title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="text-gray-500 hover:text-blue-600"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="text-gray-500 hover:text-red-600"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      <p className="text-gray-600 mt-2">{task.description}</p>
      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-2">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              priorityColor[task.priority]
            }`}
          >
            {task.priority}
          </span>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              statusColor[task.status]
            }`}
          >
            {task.status}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          Assigned to:{" "}
          <span className="font-medium">
            {task.assignedTo ? task.assignedTo.name : "Unassigned"}
          </span>
        </div>
      </div>
    </div>
  );
}

function ManageTasks() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const { tasks, isLoading } = useSelector((state) => state.tasks);
  const { users } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(getTasks());
    dispatch(getEmployees());
  }, [dispatch]);

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTask(id))
        .unwrap()
        .then(() => toast.success("Task deleted successfully"))
        .catch((err) => toast.error(err));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  if (isLoading) return <Spinner />;

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={handleAddTask}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
          <FaPlus className="mr-2" /> Add Task
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <TaskCardAdmin
            key={task._id}
            task={task}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>
      {tasks.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No tasks found. Add one!
        </p>
      )}

      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          task={editingTask}
          employees={users}
        />
      )}
    </div>
  );
}

export default ManageTasks;
