import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTasks } from "../features/tasks/taskSlice";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";

function TaskCardEmployee({ task }) {
  const priorityColor = {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
  };
  const progress =
    task.todos.length > 0
      ? (task.todos.filter((t) => t.completed).length / task.todos.length) * 100
      : task.status === "completed"
      ? 100
      : 0;

  return (
    <Link
      to={`/task/${task._id}`}
      className="block bg-white p-5 rounded-lg shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-gray-800">{task.title}</h3>
        <div
          className={`w-3 h-3 rounded-full ${priorityColor[task.priority]}`}
          title={`Priority: ${task.priority}`}
        ></div>
      </div>
      <p className="text-gray-600 mt-2 text-sm h-10 overflow-hidden">
        {task.description}
      </p>
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <div className="mt-4 text-xs font-semibold text-gray-500">
        Status: <span className="capitalize">{task.status}</span>
      </div>
    </Link>
  );
}

function EmployeeDashboard() {
  const dispatch = useDispatch();
  const { tasks, isLoading } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({ status: "", priority: "" });

  useEffect(() => {
    dispatch(getTasks(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        Welcome back, {user?.name}!
      </h1>
      <p className="text-gray-600 mb-6">Here are the tasks assigned to you.</p>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center space-x-4">
        <span className="font-medium text-gray-700">Filter by:</span>
        <div>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <TaskCardEmployee key={task._id} task={task} />
        ))}
      </div>
      {tasks.length === 0 && (
        <div className="text-center col-span-full mt-10">
          <p className="text-gray-500 text-lg">
            You have no tasks assigned. Great job!
          </p>
        </div>
      )}
    </div>
  );
}

export default EmployeeDashboard;
