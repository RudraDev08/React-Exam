import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

const API_URL = "http://localhost:3000/todos";

function App() {
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);

  // Fetch tasks from JSON server
  useEffect(() => {
    axios.get(API_URL)
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Failed to fetch tasks", err));
  }, []);

  // Add new task
  const handleAddTask = async (newTask) => {
    try {
      // Find the highest existing task ID and increment it
      const maxId = Math.max(...tasks.map((task) => task.id), 0); // Get max id
      const newId = maxId + 1; // Increment the max id by 1
  
      // Add the new task with the incremented id
      const res = await axios.post(API_URL, { ...newTask, id: newId, status: 0 });
  
      // Add the new task to the state
      setTasks([...tasks, res.data]);
    } catch (err) {
      console.error("Failed to add task", err);
    }
  };
  

  const checkTaskExistence = async (taskId) => {
    try {
      const response = await axios.get(`${API_URL}/${taskId}`);
      return response.data; // Task exists
    } catch (err) {
      console.error("Task not found for update:", err);
      return null; // Task does not exist
    }
  };
  
  const handleUpdateTask = async (updatedTask) => {
    try {
      const task = await checkTaskExistence(updatedTask.id);
      if (!task) {
        console.error("Task does not exist for updating.");
        return;
      }
  
      // Now proceed with PUT request
      const response = await axios.put(`${API_URL}/${updatedTask.id}`, updatedTask);
      console.log("Task updated successfully:", response.data);
      setTasks(tasks.map((task) => task.id === updatedTask.id ? updatedTask : task));
      setEditId(null); // Clear edit ID after updating
    } catch (err) {
      console.error("Failed to update task", err.response ? err.response.data : err.message);
    }
  };
  
  
  
  

  // Delete task
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
      if (editId === id) setEditId(null);
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  // Toggle task status
  const handleStatusChange = async (id) => {
    const task = tasks.find((t) => t.id === id);
    const updatedTask = { ...task, status: task.status ? 0 : 1 };

    try {
      await axios.put(`${API_URL}/${id}`, updatedTask);
      setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
    } catch (err) {
      console.error("Failed to change status", err);
    }
  };

  const handleEdit = (task) => setEditId(task.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Task Manager</h1>
          <p className="text-indigo-100 mt-1">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"} in total
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Task Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editId ? "Edit Task" : "Add New Task"}
            </h2>
            <TaskForm
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              editId={editId}
              setEditId={setEditId}
              tasks={tasks}
            />
          </div>
        </div>

        {/* Right: Task List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Your Tasks
              </h2>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <span className="mr-4">
                  Completed: {tasks.filter((t) => t.status === 1).length}
                </span>
                <span>
                  Pending: {tasks.filter((t) => t.status === 0).length}
                </span>
              </div>
            </div>

            <TaskList
              tasks={tasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 mt-8">
        <div className="container mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Task Manager App
        </div>
      </footer>
    </div>
  );
}

export default App;
