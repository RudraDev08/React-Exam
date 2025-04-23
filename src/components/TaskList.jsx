import React, { useState, useEffect } from "react";
import axios from "axios";
import { taskTypeColors } from "../types/Task";

const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

const taskService = {
  getTasks: async () => {
    try {
      const res = await api.get("/todos");
      const data = Array.isArray(res.data) ? res.data : [];
      localStorage.setItem("tasks", JSON.stringify(data));
      return data;
    } catch {
      const local = localStorage.getItem("tasks");
      return Array.isArray(JSON.parse(local || "[]")) ? JSON.parse(local) : [];
    }
  },
  deleteTask: async (id) => {
    await api.delete(`/todos/${id}`);
    const updated = (JSON.parse(localStorage.getItem("tasks") || "[]")).filter(task => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(updated));
  },
  updateTaskStatus: async (id, status) => {
    await api.patch(`/todos/${id}`, { status });
    const updated = (JSON.parse(localStorage.getItem("tasks") || "[]")).map(task =>
      task.id === id ? { ...task, status } : task
    );
    localStorage.setItem("tasks", JSON.stringify(updated));
  },
};

function TaskList({ onEdit }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState({ key: null, direction: "asc" });
  const tasksPerPage = 5;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await taskService.getTasks();
        setTasks(data);
      } catch (e) {
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      setLoading(true);
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch {
      setError("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const task = tasks.find(t => t.id === id);
      const newStatus = task.status === 1 ? 0 : 1;
      await taskService.updateTaskStatus(id, newStatus);
      setTasks((prev) => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    } catch {
      setError("Status update failed");
    }
  };

  const filtered = tasks.filter(task => {
    const q = searchTerm.toLowerCase();
    return ["task", "username", "task_type", "date", "description"].some(key =>
      task[key]?.toLowerCase().includes(q)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sort.key) return 0;
    return (a[sort.key] < b[sort.key] ? -1 : 1) * (sort.direction === "asc" ? 1 : -1);
  });

  const current = sorted.slice((currentPage - 1) * tasksPerPage, currentPage * tasksPerPage);
  const totalPages = Math.ceil(sorted.length / tasksPerPage);

  const toggleSort = (key) => {
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (key) => {
    return sort.key === key ? (sort.direction === "asc" ? "↑" : "↓") : "";
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date) ? "-" : date.toLocaleDateString();
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      {/* Search */}
      <div className="p-4 border-b">
        <input
          className="w-full px-4 py-2 border rounded-md"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              {["task", "username", "date", "task_type", "priority"].map((key) => (
                <th
                  key={key}
                  onClick={() => toggleSort(key)}
                  className="px-6 py-3 text-left text-xs font-medium cursor-pointer"
                >
                  {key.replace("_", " ").toUpperCase()} {getSortIcon(key)}
                </th>
              ))}
              <th className="px-6 py-3 text-center text-xs font-medium">Status</th>
              <th className="px-6 py-3 text-center text-xs font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {current.map(task => (
              <tr key={task.id} className={task.status === 1 ? "bg-gray-50" : ""}>
                <td className="px-6 py-4">{task.task}<br /><small>{task.description}</small></td>
                <td className="px-6 py-4">{task.username || "-"}</td>
                <td className="px-6 py-4">{formatDate(task.date)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    taskTypeColors[task.task_type]?.bg || "bg-gray-200"
                  } ${taskTypeColors[task.task_type]?.text || "text-gray-700"}`}>
                    {task.task_type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    task.priority === "High"
                      ? "bg-red-100 text-red-800"
                      : task.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}>
                    {task.priority || "Low"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={task.status === 1}
                    onChange={() => toggleStatus(task.id)}
                  />{" "}
                  {task.status === 1 ? "Done" : "Pending"}
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="text-indigo-600 mr-3" onClick={() => onEdit(task)}>Edit</button>
                  <button className="text-red-600" onClick={() => handleDelete(task.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {current.length === 0 && (
              <tr><td colSpan="7" className="text-center py-4">No tasks found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-3 border-t">
        <div className="text-sm text-gray-700">
          Showing <b>{(currentPage - 1) * tasksPerPage + 1}</b> to <b>{Math.min(currentPage * tasksPerPage, sorted.length)}</b> of <b>{sorted.length}</b>
        </div>
        <div className="space-x-2">
          <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</button>
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>‹</button>
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>›</button>
          <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>»</button>
        </div>
      </div>
    </div>
  );
}

export default TaskList;
