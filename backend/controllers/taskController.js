import Task from "../models/taskModel.js";

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private/Admin
const createTask = async (req, res) => {
  const { title, description, todos, priority, assignedTo } = req.body;
  const task = new Task({
    title,
    description,
    todos: todos || [],
    priority,
    assignedTo: assignedTo || null,
    createdBy: req.user._id,
  });
  const createdTask = await task.save();
  res.status(201).json(createdTask);
};

// @desc    Get all tasks (Admin) or assigned tasks (Employee)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  const { status, priority, page = 1, limit = 10 } = req.query;
  const filter = {};

  if (req.user.role === "employee") {
    filter.assignedTo = req.user._id;
  }

  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const tasks = await Task.find(filter)
    .populate("assignedTo", "name email")
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const count = await Task.countDocuments(filter);

  res.json({
    tasks,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  });
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id).populate(
    "assignedTo",
    "name email"
  );
  if (task) {
    // Employees can only view tasks assigned to them
    if (
      req.user.role === "employee" &&
      task.assignedTo._id.toString() !== req.user._id.toString()
    ) {
      res.status(401).json({ message: "Not authorized to view this task" });
      return;
    }
    res.json(task);
  } else {
    res.status(404).json({ message: "Task not found" });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private/Admin
const updateTask = async (req, res) => {
  const { title, description, todos, priority, assignedTo, status } = req.body;
  const task = await Task.findById(req.params.id);

  if (task) {
    task.title = title || task.title;
    task.description = description || task.description;
    task.todos = todos || task.todos;
    task.priority = priority || task.priority;
    task.assignedTo = assignedTo || task.assignedTo;
    task.status = status || task.status;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404).json({ message: "Task not found" });
  }
};

// @desc    Update a task's status and todos (by employee)
// @route   PUT /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
  const { todos } = req.body;
  const task = await Task.findById(req.params.id);

  if (task) {
    if (
      req.user.role === "employee" &&
      task.assignedTo.toString() !== req.user._id.toString()
    ) {
      res.status(401).json({ message: "Not authorized to update this task" });
      return;
    }

    task.todos = todos;

    const allTodosCompleted = todos.every((todo) => todo.completed);
    const someTodosCompleted = todos.some((todo) => todo.completed);

    if (allTodosCompleted) {
      task.status = "completed";
    } else if (someTodosCompleted) {
      task.status = "in-progress";
    } else {
      task.status = "pending";
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404).json({ message: "Task not found" });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task) {
    await Task.deleteOne({ _id: task._id });
    res.json({ message: "Task removed" });
  } else {
    res.status(404).json({ message: "Task not found" });
  }
};

export {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
};
