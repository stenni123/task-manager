import React, { useState } from "react";
import { FaTasks, FaUsers } from "react-icons/fa";
import ManageTasks from "../components/admin/ManageTasks";
import ManageEmployees from "../components/admin/ManageEmployees";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("tasks");

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("tasks")}
          className={`flex items-center py-3 px-6 text-lg font-medium transition-colors duration-300 ${
            activeTab === "tasks"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-blue-600"
          }`}
        >
          <FaTasks className="mr-2" /> Manage Tasks
        </button>
        <button
          onClick={() => setActiveTab("employees")}
          className={`flex items-center py-3 px-6 text-lg font-medium transition-colors duration-300 ${
            activeTab === "employees"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-blue-600"
          }`}
        >
          <FaUsers className="mr-2" /> Manage Employees
        </button>
      </div>
      <div>
        {activeTab === "tasks" && <ManageTasks />}
        {activeTab === "employees" && <ManageEmployees />}
      </div>
    </div>
  );
}

export default AdminDashboard;
