import { getDatabase, push, ref, set } from "firebase/database";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const AddAssigneeModal = ({ taskDetail, onClose, users }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const db = getDatabase();

  const handleSelect = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleAdd = () => {
    if (!taskDetail) {
      toast.error("Task details not loaded!");
      return;
    }

    // const selectedUserObjects = users.filter((u) =>
    //   selectedUsers.includes(u.id)
    // );

    users.forEach((user) => {
      set(
        push(ref(db, "assignee/")),
        {
          projectId: taskDetail.projectId || "",
          adminId: taskDetail.adminId || "",
          taskId: taskDetail.id || "",
          assigneeId: user.memberId,
          assigneeName: user.memberName,
          assigneeImage: user.memberImage,
          assigneeRole: user.memberRole || "",
        }
      )
        .then(() => {
          toast.success("Successfully added assignee");
        })
        .catch((err) => toast.error(err.message));
    });

    setSelectedUsers([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <Toaster position="top-right" />
      <div className="bg-white w-[400px] rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Add Assignees</h2>

        <div className="max-h-60 overflow-y-auto">
          {users.map((user) => (
            <label
              key={user.id}
              className="flex items-center space-x-3 p-2 rounded hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedUsers.includes(user.id)}
                onChange={() => handleSelect(user.id)}
              />
              <img
                src={user.memberImage}
                alt={user.memberName}
                className="w-8 h-8 rounded-full object-cover border"
              />
              <span className="font-medium">{user.memberName}</span>
              <span className="text-sm text-gray-500">{user.memberRole}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/70"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAssigneeModal;
