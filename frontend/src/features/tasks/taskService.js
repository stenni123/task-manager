import axios from "axios";
const API_URL = "/api/tasks/";

const getTasks = async (filters) => {
  const response = await axios.get(API_URL, { params: filters });
  return response.data;
};

const getTaskById = async (taskId) => {
  const response = await axios.get(API_URL + taskId);
  return response.data;
};

const createTask = async (taskData) => {
  const response = await axios.post(API_URL, taskData);
  return response.data;
};

const updateTask = async (taskData) => {
  const response = await axios.put(API_URL + taskData._id, taskData);
  return response.data;
};

const updateTaskStatus = async (taskData) => {
  const response = await axios.put(`${API_URL}${taskData.id}/status`, {
    todos: taskData.todos,
  });
  return response.data;
};

const deleteTask = async (taskId) => {
  const response = await axios.delete(API_URL + taskId);
  return response.data;
};

const taskService = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
export default taskService;
