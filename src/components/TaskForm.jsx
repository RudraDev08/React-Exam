import React, { useState, useEffect } from "react";
import { validateTask } from "../utils/taskUtils";

function TaskForm({ onAddTask, onUpdateTask, editId, setEditId, tasks }) {
  const initialForm = {
    task: "",
    username: "",
    date: "",
    task_type: "Office",
    status: 0,
    id: null,
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  // Fill form when editing
  useEffect(() => {
    if (editId !== null) {
      const taskToEdit = tasks.find((task) => task.id === editId);
      if (taskToEdit) {
        setFormData({ ...taskToEdit });
      }
    }
  }, [editId, tasks]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle checkbox (status) change
  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.checked ? 1 : 0,
    }));
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateTask(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      if (editId) {
        onUpdateTask(formData);
      } else {
        const newTask = {
          ...formData,
          id: Date.now(),
        };
        onAddTask(newTask);
      }

      // Reset form
      setFormData(initialForm);
      setErrors({});
      setEditId(null);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData(initialForm);
    setErrors({});
    setEditId(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 h-fit sticky top-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        {editId ? "✏️ Edit Task" : "➕ Add New Task"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Task Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Description
            </label>
            <textarea
              name="task"
              value={formData.task}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.task ? "border-red-500" : "border-gray-300"
              }`}
              rows={4}
              placeholder="Enter task details..."
            />
            {errors.task && (
              <p className="mt-1 text-sm text-red-600">{errors.task}</p>
            )}
          </div>

          {/* Username and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Your name"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date (DD-MMM-YYYY)
              </label>
              <input
                type="text"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.date ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="12-May-2025"
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>
          </div>

          {/* Task Type & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Type
              </label>
              <select
                name="task_type"
                value={formData.task_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Office">Office</option>
                <option value="Personal">Personal</option>
                <option value="Family">Family</option>
                <option value="Friends">Friends</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="status"
                checked={formData.status === 1}
                onChange={handleCheckboxChange}
                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="status" className="ml-2 block text-sm text-gray-700">
                Mark as completed
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              {editId ? "Update Task" : "Add Task"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;