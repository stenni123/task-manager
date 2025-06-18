import axios from "axios";
const API_URL = "/api/users/";

const addEmployee = async (userData) => {
  const response = await axios.post(API_URL, userData);
  return response.data;
};

const getEmployees = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const updateEmployee = async (userData) => {
  const response = await axios.put(API_URL + userData._id, userData);
  return response.data;
};

const deleteEmployee = async (userId) => {
  const response = await axios.delete(API_URL + userId);
  return response.data;
};

const userService = {
  addEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
};
export default userService;
