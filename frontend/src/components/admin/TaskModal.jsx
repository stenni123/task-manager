import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  createTask,
  updateTask,
  getTasks,
} from "../../features/tasks/taskSlice";
import toast from "react-hot-toast";

function TaskModal({ isOpen, onClose, task, employees }) {
  const dispatch = useDispatch();

  // --- Start of Changes ---

  // Add `todos` to the initial state
  const initialFormData = {
    title: "",
    description: "",
    priority: "medium",
    assignedTo: "",
    status: "pending",
    todos: [], // Initialize todos as an empty array
  };

  const [formData, setFormData] = useState(initialFormData);
  // State for the new todo input field
  const [newTodoText, setNewTodoText] = useState("");

  useEffect(() => {
    if (task) {
      setFormData({
        _id: task._id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        assignedTo: task.assignedTo?._id || "",
        status: task.status,
        todos: task.todos || [], // Populate todos if editing a task
      });
    } else {
      // Reset to initial state when creating a new task
      setFormData(initialFormData);
    }
  }, [task, isOpen]); // Rerun effect if the modal is reopened

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handler to add a new todo to the list
  const handleAddTodo = () => {
    if (newTodoText.trim() === "") {
      toast.error("Todo text cannot be empty.");
      return;
    }
    setFormData({
      ...formData,
      todos: [...formData.todos, { text: newTodoText, completed: false }],
    });
    setNewTodoText(""); // Clear the input field after adding
  };

  // Handler to remove a todo from the list
  const handleRemoveTodo = (indexToRemove) => {
    setFormData({
      ...formData,
      todos: formData.todos.filter((_, index) => index !== indexToRemove),
    });
  };

  // --- End of Changes ---

  const handleSubmit = (e) => {
    e.preventDefault();
    // The entire formData (including todos) is passed to the action
    const action = task ? updateTask(formData) : createTask(formData);

    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success(`Task ${task ? "updated" : "created"} successfully`);
        dispatch(getTasks()); // Refresh tasks list
        onClose();
      })
      .catch((err) => toast.error(err));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">
          {task ? "Edit Task" : "Add New Task"}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* ... Title and Description fields remain the same ... */}
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 font-medium mb-2"
            >
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium mb-2"
            >
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            ></textarea>
          </div>

          {/* --- New UI Section for Todos --- */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Todo Checklist
            </label>
            {/* List of existing todos */}
            <div className="space-y-2 mb-2">
              {formData.todos.map((todo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-100 p-2 rounded"
                >
                  <span className="text-gray-800">{todo.text}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTodo(index)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            {/* Input to add a new todo */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                placeholder="Add a new checklist item"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddTodo}
                className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Add
              </button>
            </div>
          </div>
          {/* --- End of New UI Section --- */}

          {/* ... Priority, Assign To, and Status fields remain the same ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="priority"
                className="block text-gray-700 font-medium mb-2"
              >
                {" "}
                Priority{" "}
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg bg-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="assignedTo"
                className="block text-gray-700 font-medium mb-2"
              >
                {" "}
                Assign To{" "}
              </label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg bg-white"
              >
                <option value="">Unassigned</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {" "}
                    {emp.name}{" "}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {task && (
            <div className="mb-4">
              <label
                htmlFor="status"
                className="block text-gray-700 font-medium mb-2"
              >
                {" "}
                Status{" "}
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg bg-white"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {task ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
