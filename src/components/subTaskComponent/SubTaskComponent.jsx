import React, { useEffect, useState } from "react";
import {
  Plus,
  CheckCircle,
  Circle,
  MoreHorizontal,
  Edit,
  Trash2,
  X,
  Check,
  User,
} from "lucide-react";
import {
  getDatabase,
  onValue,
  push,
  ref,
  set,
  update,
  remove,
} from "firebase/database";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const SubtasksComponent = ({ task }) => {
  const [addSubTaskMode, setAddSubTaskMode] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [showDropdown, setShowDropdown] = useState(null);
  const user = useSelector((state) => state.userInfo.value);
  const [subTaskList, setSubTaskList] = useState([]);
  const db = getDatabase();

  // Load subtasks from Firebase
  useEffect(() => {
    if (task?.id) {
      const taskRef = ref(db, "subtask/");
      const unsubscribe = onValue(taskRef, (snapshot) => {
        let arr = [];
        snapshot.forEach((item) => {
          if (item.val().taskId === task.id) {
            arr.push({ ...item.val(), id: item.key });
          }
        });
        setSubTaskList(arr);
      });

      return () => unsubscribe(); // Cleanup listener
    }
  }, [db, task?.id]);

  // Handle checkbox change (toggle subtask completion)
  const handleCheckboxChange = async (subtaskId) => {
    try {
      const subtaskToUpdate = subTaskList.find((st) => st.id === subtaskId);
      if (subtaskToUpdate) {
        const newStatus =
          subtaskToUpdate.status === "checked" ? "unchecked" : "checked";

        await update(ref(db, `subtask/${subtaskId}`), {
          status: newStatus,
          completedAt:
            newStatus === "checked" ? new Date().toISOString() : null,
          completedBy: newStatus === "checked" ? user?.uid : null,
        });

        toast.success(
          newStatus === "checked" ? "Subtask completed!" : "Subtask reopened!"
        );
      }
    } catch (error) {
      console.error("Error updating subtask:", error);
      toast.error("Failed to update subtask");
    }
  };

  // Add new subtask
  const handleAddTask = async () => {
    if (newTaskTitle.trim()) {
      try {
        await set(push(ref(db, "subtask/")), {
          taskTitle: newTaskTitle,
          whoCreateName: user?.displayName || "Unknown User",
          whoCreatedId: user?.uid,
          whoCreatedImage: user?.photoURL || "",
          taskId: task?.id,
          status: "unchecked",
          projectId: task?.projectId,
          adminId: task?.adminId,
          createdAt: new Date().toISOString(),
        });

        toast.success("Subtask added successfully!");
        setNewTaskTitle("");
        setAddSubTaskMode(false);
      } catch (error) {
        console.error("Error adding subtask:", error);
        toast.error("Failed to add subtask");
      }
    }
  };

  // Edit existing subtask
  const handleEditTask = async (subtaskId) => {
    if (editTaskTitle.trim()) {
      try {
        await update(ref(db, `subtask/${subtaskId}`), {
          taskTitle: editTaskTitle,
          updatedAt: new Date().toISOString(),
          updatedBy: user?.uid,
        });

        toast.success("Subtask updated successfully!");
        setEditingTask(null);
        setEditTaskTitle("");
      } catch (error) {
        console.error("Error editing subtask:", error);
        toast.error("Failed to update subtask");
      }
    }
  };

  // Delete subtask
  const handleDeleteTask = async (subtaskId) => {
    try {
      await remove(ref(db, `subtask/${subtaskId}`));
      toast.success("Subtask deleted successfully!");
      setShowDropdown(null);
    } catch (error) {
      console.error("Error deleting subtask:", error);
      toast.error("Failed to delete subtask");
    }
  };

  const startEdit = (subtask) => {
    setEditingTask(subtask.id);
    setEditTaskTitle(subtask.taskTitle);
    setShowDropdown(null);
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditTaskTitle("");
  };

  const cancelAdd = () => {
    setAddSubTaskMode(false);
    setNewTaskTitle("");
  };

  // Calculate completed subtasks count
  const completedCount = subTaskList.filter(
    (st) => st.status === "checked"
  ).length;

  return (
    <div className="bg-white rounded-xl p-6 font-primary shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Subtasks
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({completedCount}/{subTaskList.length})
          </span>
        </h2>
        {
          task?.status!=="Completed" ? <button
          onClick={() => setAddSubTaskMode(true)}
          className="flex items-center gap-2 px-3 py-2 text-primary hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium">Add Subtask</span>
        </button> : <button
          className="flex items-center gap-2 px-3 py-2 text-primary/60  rounded-lg transition-colors"
        >
          <span className="text-sm font-medium">Task is Complete, can't add more Subtask</span>
        </button>
        }
        
      </div>

      <div className="space-y-2">
        {/* Add new task input */}
        {addSubTaskMode && (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <div className="flex-shrink-0">
              <Circle className="h-5 w-5 text-gray-300" />
            </div>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter subtask title..."
              className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTask();
                if (e.key === "Escape") cancelAdd();
              }}
            />
            <div className="flex items-center space-x-2">
              <button
                onClick={handleAddTask}
                disabled={!newTaskTitle.trim()}
                className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={cancelAdd}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Subtask items */}
        {subTaskList.map((subtask) => (
          <div
            key={subtask.id}
            className="group flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors relative"
          >
            <button
              onClick={() => handleCheckboxChange(subtask.id)}
              className="flex-shrink-0"
            >
              {subtask.status === "checked" ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>

            {/* Task title - editable or display */}
            {editingTask === subtask.id ? (
              <input
                type="text"
                value={editTaskTitle}
                onChange={(e) => setEditTaskTitle(e.target.value)}
                className="flex-1 bg-white border border-gray-200 rounded px-2 py-1 text-gray-700 focus:outline-none focus:border-primary"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleEditTask(subtask.id);
                  if (e.key === "Escape") cancelEdit();
                }}
              />
            ) : (
              <span
                className={`flex-1 ${
                  subtask.status === "checked"
                    ? "line-through text-gray-500"
                    : "text-gray-700"
                }`}
              >
                {subtask.taskTitle}
              </span>
            )}

            {/* Creator info */}
            <div className="flex items-center space-x-2">
              {subtask.whoCreatedImage ? (
                <img
                  src={subtask.whoCreatedImage}
                  alt={subtask.whoCreateName}
                  className="w-6 h-6 rounded-full border border-gray-200"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center"
                style={{ display: subtask.whoCreatedImage ? "none" : "flex" }}
              >
                <User className="h-3 w-3 text-gray-500" />
              </div>
              <span className="text-xs text-gray-500 hidden sm:inline">
                {subtask.whoCreateName
                  ? subtask.whoCreateName.split(" ")[0]
                  : "Unknown"}
              </span>
            </div>

            {/* Action buttons */}
            {editingTask === subtask.id ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditTask(subtask.id)}
                  disabled={!editTaskTitle.trim()}
                  className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={cancelEdit}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="relative">
                {subtask.whoCreatedId == user?.uid && (
                    <button
                      onClick={() =>
                        setShowDropdown(
                          showDropdown === subtask.id ? null : subtask.id
                        )
                      }
                      className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  )}

                {/* Dropdown menu */}
                {showDropdown === subtask.id && (
                  <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                    <button
                      onClick={() => startEdit(subtask)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Edit className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteTask(subtask.id)}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Empty state */}
        {subTaskList.length === 0 && !addSubTaskMode && task?.status!=="Completed" && (
          <div className="text-center py-8 text-gray-500">
            <Circle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No subtasks yet</p>
            <button
              onClick={() => setAddSubTaskMode(true)}
              className="text-primary hover:text-purple-700 text-sm font-medium mt-2"
            >
              Add your first subtask
            </button>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowDropdown(null)}
        />
      )}
    </div>
  );
};

export default SubtasksComponent;
