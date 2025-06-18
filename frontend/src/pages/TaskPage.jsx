import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getTaskById, updateTaskStatus } from "../features/tasks/taskSlice";
import { FaArrowLeft, FaCheck, FaPlus } from "react-icons/fa";
import Spinner from "../components/Spinner";

function TaskPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { task, isLoading } = useSelector((state) => state.tasks);
  const [localTodos, setLocalTodos] = useState([]);

  useEffect(() => {
    dispatch(getTaskById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (task?.todos) {
      setLocalTodos(task.todos);
    }
  }, [task]);

  const handleTodoToggle = (index) => {
    const updatedTodos = localTodos.map((todo, i) =>
      i === index ? { ...todo, completed: !todo.completed } : todo
    );

    setLocalTodos(updatedTodos);

    // Dispatch the updated todos
    dispatch(updateTaskStatus({ id: task._id, todos: updatedTodos }));
  };
  if (isLoading || !task._id) return <Spinner />;

  return (
    <div>
      <Link
        to="/"
        className="inline-flex items-center text-blue-600 hover:underline mb-6"
      >
        <FaArrowLeft className="mr-2" /> Back to Task List
      </Link>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-4xl font-bold text-gray-800">{task.title}</h1>
          <span
            className={`px-4 py-1.5 text-sm font-semibold rounded-full ${
              task.priority === "high"
                ? "bg-red-100 text-red-800"
                : task.priority === "medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {task.priority}
          </span>
        </div>
        <p className="text-gray-600 mb-6">{task.description}</p>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">To-Do List</h2>
          <div className="space-y-3">
            {localTodos.map((todo, index) => (
              <div
                key={index}
                onClick={() => handleTodoToggle(index)}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                  todo.completed
                    ? "bg-green-50 text-gray-500 line-through"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                    todo.completed
                      ? "bg-green-500 border-green-500"
                      : "border-gray-400"
                  }`}
                >
                  {todo.completed && <FaCheck className="text-white text-xs" />}
                </div>
                <span>{todo.text}</span>
              </div>
            ))}
            {localTodos.length === 0 && (
              <p className="text-gray-500">
                No specific to-do items for this task.
              </p>
            )}
          </div>
        </div>

        <div className="border-t pt-4 text-sm text-gray-500">
          Status:{" "}
          <span className="font-semibold capitalize text-gray-800">
            {task.status}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TaskPage;
