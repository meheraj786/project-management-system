import React, { useEffect, useState } from "react";
import { Plus, CheckCircle, Circle, X, Check, Trash2 } from "lucide-react";
import { getDatabase, onValue, push, ref, set, update, remove } from "firebase/database";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import moment from "moment";
import CustomLoader from "../layouts/CustomLoader";

const TodosComponent = () => {
  const user = useSelector((state) => state.userInfo.value);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [addMode, setAddMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const db = getDatabase();

  // Load todos for logged-in user only
  useEffect(() => {
    if (user?.uid) {
      const todoRef = ref(db, "todos/");
      onValue(todoRef, (snapshot) => {
        let arr = [];
        snapshot.forEach((item) => {
          if (item.val().userId === user.uid) {
            arr.push({ ...item.val(), id: item.key });
          }
        });
        setTodos(arr);
        setLoading(false);
      });
    }
  }, [db, user?.uid]);

  // Add Todo
  const handleAddTodo = () => {
    if (newTodo.trim()) {
      set(push(ref(db, "todos/")), {
        title: newTodo,
        status: "unchecked",
        userId: user?.uid,
        createdAt: moment().format(),
      })
        .then(() => {
          toast.success("Todo added!");
          setNewTodo("");
          setAddMode(false);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to add todo");
        });
    }
  };

  // Toggle complete
  const handleToggle = (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    const newStatus = todo.status === "checked" ? "unchecked" : "checked";

    update(ref(db, `todos/${id}`), {
      status: newStatus,
      completedAt: newStatus === "checked" ? new Date().toISOString() : null,
    })
      .then(() => {
        toast.success(newStatus === "checked" ? "Todo completed!" : "Todo reopened!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to update todo");
      });
  };

  // Delete Todo
  const handleDelete = (id) => {
    remove(ref(db, 'todos/' + id))
      .then(() => {
        toast.success("Todo deleted!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to delete todo");
      });
  };

  // Edit Todo
  const handleEdit = (id) => {
    if (editTitle.trim()) {
      update(ref(db, 'todos/' + id), {
        title: editTitle,
        updatedAt: moment().format(),
      })
        .then(() => {
          toast.success("Todo updated!");
          setEditingId(null);
          setEditTitle("");
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to update todo");
        });
    }
  };

  if (loading) return <CustomLoader />;

  return (
    <div className="bg-white max-w-6xl mt-10 mx-auto rounded-xl p-6 font-primary shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">My Todos</h2>
        <button
          onClick={() => setAddMode(true)}
          className="flex items-center gap-2 px-3 py-2 text-primary hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium">Add Todo</span>
        </button>
      </div>

      <div className="space-y-2">
        {/* Add new todo input */}
        {addMode && (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <Circle className="h-5 w-5 text-gray-300" />
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Enter todo..."
              className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTodo();
                if (e.key === "Escape") {
                  setAddMode(false);
                  setNewTodo("");
                }
              }}
            />
            <div className="flex items-center space-x-2">
              <button
                onClick={handleAddTodo}
                disabled={!newTodo.trim()}
                className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setAddMode(false);
                  setNewTodo("");
                }}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Todo items */}
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="group flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <button onClick={() => handleToggle(todo.id)} className="flex-shrink-0">
              {todo.status === "checked" ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>

            {editingId === todo.id ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="flex-1 bg-white border border-gray-200 rounded px-2 py-1 text-gray-700 focus:outline-none focus:border-primary"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleEdit(todo.id);
                  if (e.key === "Escape") {
                    setEditingId(null);
                    setEditTitle("");
                  }
                }}
              />
            ) : (
              <span
                className={`flex-1 ${
                  todo.status === "checked"
                    ? "line-through text-gray-500"
                    : "text-gray-700"
                }`}
              >
                {todo.title}
              </span>
            )}

            {editingId === todo.id ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(todo.id)}
                  disabled={!editTitle.trim()}
                  className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditTitle("");
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setEditingId(todo.id);
                    setEditTitle(todo.title);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="p-1 text-red-500 hover:text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Empty state */}
        {todos.length === 0 && !addMode && (
          <div className="text-center py-8 text-gray-500">
            <Circle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No todos yet</p>
            <button
              onClick={() => setAddMode(true)}
              className="text-primary hover:text-purple-700 text-sm font-medium mt-2"
            >
              Add your first todo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodosComponent;
