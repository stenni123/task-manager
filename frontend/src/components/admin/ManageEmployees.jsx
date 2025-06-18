import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getEmployees, deleteEmployee } from "../../features/users/userSlice";
import { FaEdit, FaTrash, FaPlus, FaUserShield, FaUser } from "react-icons/fa";
import toast from "react-hot-toast";
import Spinner from "../Spinner";
import EmployeeModal from "./EmployeeModal";

function EmployeeRow({ employee, onEdit, onDelete }) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="py-3 px-6 text-left whitespace-nowrap">{employee.name}</td>
      <td className="py-3 px-6 text-left">{employee.email}</td>
      <td className="py-3 px-6 text-center">
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            employee.role === "admin"
              ? "bg-indigo-200 text-indigo-800"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {employee.role}
        </span>
      </td>
      <td className="py-3 px-6 text-center">
        <div className="flex item-center justify-center space-x-4">
          <button
            onClick={() => onEdit(employee)}
            className="text-gray-500 hover:text-blue-600"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(employee._id)}
            className="text-gray-500 hover:text-red-600"
          >
            <FaTrash />
          </button>
        </div>
      </td>
    </tr>
  );
}

function ManageEmployees() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const { users, isLoading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(getEmployees());
  }, [dispatch]);

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      dispatch(deleteEmployee(id))
        .unwrap()
        .then(() => toast.success("Employee deleted successfully"))
        .catch((err) => toast.error(err));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  if (isLoading) return <Spinner />;

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={handleAddEmployee}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
          <FaPlus className="mr-2" /> Add Employee
        </button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-center">Role</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {users.map((user) => (
              <EmployeeRow
                key={user._id}
                employee={user}
                onEdit={handleEditEmployee}
                onDelete={handleDeleteEmployee}
              />
            ))}
          </tbody>
        </table>
      </div>
      {users.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No employees found.</p>
      )}

      {isModalOpen && (
        <EmployeeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          employee={editingEmployee}
        />
      )}
    </div>
  );
}

export default ManageEmployees;
