
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("my-todos");

    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch {
        return [];
      }
    }

    return [
      { id: 1, title: "Belajar JavaScript", completed: false },
      { id: 2, title: "Mempelajari React", completed: true },
    ];
  });

  const [taskInput, setTaskInput] = useState("");
  const [editId, setEditId] = useState(null);
  useEffect(() => {
    localStorage.setItem("my-todos", JSON.stringify(tasks));
  }, [tasks]);

  // Menambahkan atau mengedit tugas
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!taskInput.trim()) return;

    if (editId !== null) {
      setTasks(
        tasks.map((task) =>
          task.id === editId
            ? { ...task, title: taskInput }
            : task
        )
      );

      setEditId(null);
    } else {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          title: taskInput,
          completed: false,
        },
      ]);
    }

    setTaskInput("");
  };

  // Mengedit tugas
  const handleEdit = (task) => {
    setTaskInput(task.title);
    setEditId(task.id);
  };

  // Menandai tugas selesai
  const handleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  // Menghapus tugas
  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));

    if (editId === id) {
      setEditId(null);
      setTaskInput("");
    }
  };

  return (
    <div className="todo-container">
      <div className="todo-card">

        <h2>list tugas</h2>
        <p className="subtitle">
          atur tugas harianmu dengan mudah.
        </p>

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="todo-form">
          <input
            type="text"
            className="form-control"
            placeholder="Buat tugas baru...."
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
          />

          <button type="submit" className="btn btn-primary">
            {editId !== null ? "Update" : "Add Task"}
          </button>

          {editId !== null && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setEditId(null);
                setTaskInput("");
              }}
            >
              Cancel
            </button>
          )}
        </form>

        {/* Daftar Tugas */}
        <h5 className="task-heading">list tugas</h5>

        {tasks.length === 0 ? (
          <p className="empty-message">
            belum ada tugas. tambahkan tugas baru
          </p>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <div className="task-item" key={task.id}>

                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={task.completed}
                  onChange={() => handleComplete(task.id)}
                />

                <span
                  className={`task-title ${
                    task.completed ? "completed" : ""
                  }`}
                >
                  {task.title}
                </span>

                <div className="task-actions">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleEdit(task)}
                    type="button"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>

                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(task.id)}
                    type="button"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        <div className="task-summary">
          Total: {tasks.length} tasks | Completed:{" "}
          {tasks.filter((task) => task.completed).length}
        </div>
      </div>
    </div>
  );
}

export default App;
