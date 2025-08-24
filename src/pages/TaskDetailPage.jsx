import React, { useContext, useEffect, useState } from "react";
import {
  ArrowLeft,
  Star,
  Share2,
  MoreHorizontal,
  Calendar,
  User,
  MessageCircle,
  Paperclip,
  Plus,
  Send,
  Clock,
  CheckCircle,
  Circle,
  Edit,
  Trash2,
  Upload,
  Image,
  X,
  Trash,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import moment from "moment";
import AddAssigneeModal from "../layouts/AddAssigneeModal";
import SubtasksComponent from "../components/subTaskComponent/SubTaskComponent";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { UserContext } from "../context/UserContext";
import CustomLoader from "../layouts/CustomLoader";

const TaskDetailPage = () => {
  const [taskDetail, setTaskDetail] = useState(null);
  const [comments, setComments] = useState([]);
  const { id } = useParams();
  const user = useSelector((state) => state.userInfo.value);
  const db = getDatabase();
  const [newComment, setNewComment] = useState("");
  const [checkedItems, setCheckedItems] = useState({
    1: true,
    2: false,
    3: false,
    4: true,
  });
  const [activeAssigneeModal, setActiveAssigneeModal] = useState(false);
  const [projectMembers, setProjectMembers] = useState([]);
  const [assignee, setAssignee] = useState([]);
  const [listForAssignee, setListForAssignee] = useState([]);
  const [addSubTaskMode, setAddSubTaskMode] = useState(false);
  const { currentUser } = useContext(UserContext);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [editCommentModal, setEditCommentModal] = useState(false);
  const [editComment, setEditComment] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [image, setImage] = useState("");
  const [imageList, setImageList] = useState([]);
  const [loading, setLoading]= useState(true)
  const navigate = useNavigate();

  const handleEditComment = (comment) => {
    setEditComment(comment);
    setEditCommentModal(true);
  };

  const handleUpdateComment = () => {
    if (!editComment) return;

    update(ref(db, "comment/" + editComment.id), {
      ...editComment,
      taskTitle: editComment.taskTitle,
    })
      .then(() => {
        toast.success("Comment updated!");
        setEditCommentModal(false);
        setActiveMenu(null);
      })
      .catch((err) => toast.error(err.message));
  };

  useEffect(() => {
    if (taskDetail) {
      setFormData({
        id: taskDetail.id,
        status: taskDetail.status || "",
        priority: taskDetail.priority || "",
        dueDate: taskDetail.dueDate || "",
      });
    }
  }, [taskDetail]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    update(ref(db, "tasks/" + formData.id), {
      status: formData.status || "Todo",
      priority: formData.priority || "Low",
      dueDate: formData.dueDate
        ? moment(formData.dueDate).format("YYYY-MM-DD")
        : "",
    }).then(() => {
      set(push(ref(db, "activity/")), {
        userid: user?.uid,
        userName: user?.displayName,
        userImage: user?.photoURL,
        acitvityIn: "task",
        projectId: taskDetail?.projectId,
        action: "Updated",
        content: `updated a Task.`,
        time: moment().format(),
        type: "updated",
      });
      toast.success("Updated");
      setIsOpen(false);
    });
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  useEffect(() => {
    const starCountRef = ref(db, "members/");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const members = item.val();
        arr.unshift({ ...members, id: item.key });
      });

      const projectMembers = arr.filter(
        (m) => m.projectId == taskDetail.projectId
      );
      setProjectMembers(projectMembers);

      setListForAssignee(() =>
        projectMembers.filter(
          (a) =>
            !assignee.map((m) => m.assigneeId).includes(a.memberId) &&
            a.projectId == taskDetail?.projectId
        )
      );
    });
  }, [db, taskDetail, assignee]);

  useEffect(() => {
    const starCountRef = ref(db, "assignee/");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const members = item.val();
        arr.unshift({ ...members, id: item.key });
      });
      setAssignee(
        arr.filter(
          (m) =>
            m.projectId == taskDetail.projectId && m.taskId == taskDetail.id
        )
      );
    });
  }, [db, taskDetail]);

  useEffect(() => {
    const taskRef = ref(db, "taskimage/");
    onValue(taskRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().taskId == taskDetail.id) {
          arr.push({ ...item.val(), id: item.key });
        }
      });
      setImageList(arr);
    });
  }, [db, id, taskDetail]);

  useEffect(() => {
    const taskRef = ref(db, "tasks/");
    onValue(taskRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), id: item.key });
      });
      setTaskDetail(arr.find((t) => t.id == id));
      setLoading(false)
    });
  }, [db, id]);
  useEffect(() => {
    const taskRef = ref(db, "comment/");
    onValue(taskRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().taskId == taskDetail.id) {
          arr.push({ ...item.val(), id: item.key });
        }
      });
      setComments(arr);
    });
  }, [db, taskDetail]);

  const handleAssigneeRemove = (member) => {
    remove(ref(db, "assignee/" + member.id)).then(() =>
      toast.success("Assignee Removed")
    );
  };

  const priorityStyles = {
    Low: "bg-blue-100 text-blue-600",
    Medium: "bg-yellow-100 text-yellow-600",
    High: "bg-orange-100 text-orange-600",
    Critical: "bg-red-100 text-red-600",
  };
  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const commentRef = push(ref(db, "comment/"));
    const activityRef = push(ref(db, "activity/"));

    const commentData = {
      taskTitle: newComment,
      whoCommentName: user?.displayName || "Unknown User",
      whoCommentId: user?.uid || "unknown",
      whoCommentImage: user?.photoURL || "",
      taskId: taskDetail?.id || "unknown",
      projectId: taskDetail?.projectId || "unknown",
      adminId: taskDetail?.adminId || "unknown",
      createdAt: moment().format(),
    };

    const activityData = {
      userid: user?.uid || "unknown",
      userName: user?.displayName || "Unknown User",
      userImage: user?.photoURL || "",
      acitvityIn: "task",
      projectId: taskDetail?.projectId || "unknown",
      taskId: taskDetail?.id || "unknown",
      action: "Comment",
      content: `comment on a task.`,
      time: moment().format(),
      type: "comment",
    };

    set(commentRef, commentData)
      .then(() => {
        return set(activityRef, activityData);
      })
      .then(() => {
        toast.success("Comment added successfully!");
        setNewComment("");
        setAddSubTaskMode(false);
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
        toast.error("Failed to add comment");
      });
  };

  const renderAvatar = (member) => (
    <div
      className={`w-8 h-8 rounded-full  flex items-center justify-center text-white text-xs font-medium`}
    >
      <img
        src={member.assigneeImage}
        className="rounded-full w-full h-full object-cover"
        alt=""
      />
    </div>
  );
  const handleDeleteComment = (commentId) => {
    remove(ref(db, "comment/" + commentId))
      .then(() => toast.success("Comment deleted!"))
      .catch((err) => toast.error(err.message));
    setActiveMenu(null);
  };
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const data = new FormData();

    data.append("file", file);
    data.append("upload_preset", "e-com app with firebase");
    data.append("cloud_name", "dlrycnxnh");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dlrycnxnh/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const result = await res.json();
    setImage(result.secure_url);
  };
  const addImage = () => {
    if (image) {
      set(push(ref(db, "taskimage/")), {
        image: image,
        adminId: taskDetail?.adminId,
        projectId: taskDetail?.projectId,
        taskId: taskDetail?.id,
        whoAddId: user?.uid,
        whoAddImage: user?.photoURL,
        whoAddName: user?.displayName,
      }).then(() => {
        set(push(ref(db, "activity/")), {
          userid: user?.uid,
          userName: user?.displayName,
          userImage: user?.photoURL,
          acitvityIn: "task",
          projectId: taskDetail?.projectId,
          action: "upload",
          content: `Add an Attachment.`,
          time: moment().format(),
          type: "upload",
        });
        toast.success("Image Added");
        setImage("");
      });
    }
  };
  const removeImage = (id) => {
    remove(ref(db, "taskimage/" + id)).then(() => {
      toast.success("Image Removed");
    });
  };
  const taskRemoveHandler = () => {
    remove(ref(db, "tasks/" + taskDetail.id)).then(() => {
      toast.success("Task Deleted");
      assignee.map((a) =>
        a.taskId == taskDetail.id ? remove(ref(db, "assignee/" + a.id)) : null
      );
      navigate("/");
    });
  };

  if (loading) return <CustomLoader/>

  return (
    <div className="min-h-screen font-primary bg-gray-50">
      {activeAssigneeModal && (
        <AddAssigneeModal
          taskDetail={taskDetail}
          users={listForAssignee}
          onClose={() => setActiveAssigneeModal(false)}
        />
      )}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[400px] rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Update Task</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Status */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                >
                  <option>Todo</option>
                  <option>InProgress</option>
                  <option>Completed</option>
                </select>
              </div>

              {currentUser.accountType == "admin" && (
                <>
                  {/* Priority */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border rounded-lg"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Critical</option>
                    </select>
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Due Date
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border rounded-lg"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={taskRemoveHandler}
                    className="px-4 py-2 bg-red-200 text-red-700 rounded-lg"
                  >
                    <Trash />
                    Delete This Task
                  </button>
                </>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {editCommentModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white w-[400px] rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Edit Comment</h2>
            <textarea
              value={editComment.taskTitle}
              onChange={(e) =>
                setEditComment({ ...editComment, taskTitle: e.target.value })
              }
              className="w-full border p-3 rounded-lg"
              rows="3"
            />
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setEditCommentModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateComment}
                className="px-4 py-2 bg-primary text-white rounded-lg"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to={`/project/${taskDetail?.projectId}`}>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="h-5 w-5 text-primary" />
              </button>
            </Link>
            <h1 className="text-xl font-semibold text-gray-800">
              Task Details
            </h1>
          </div>


        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Header */}

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      priorityStyles[taskDetail?.priority] ||
                      "bg-gray-100 text-gray-600"
                    } text-blue-600`}
                  >
                    {taskDetail?.priority}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-primary">
                    {taskDetail?.status}
                  </span>
                </div>
                <button onClick={()=>setIsOpen(true)} className="text-gray-400 hover:text-gray-600">
                  <Edit className="h-5 w-5" />
                </button>
              </div>

              <h1 className="text-2xl font-bold text-gray-800 mb-3">
                {taskDetail?.title}
              </h1>
              <p className="text-gray-600 leading-relaxed">
                {taskDetail?.description}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/50 backdrop-blur-sm">
              {/* Upload Section */}
              <div className="relative overflow-hidden flex items-center justify-start p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100/50 rounded-xl hover:shadow-md transition-all duration-300 group">
                <div className="flex  items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-blue-100/50 group-hover:scale-105 transition-transform duration-200">
                    <Upload className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    {taskDetail?.status == "Completed" ? (
                      <label
                        htmlFor="image"
                        className="text-sm font-semibold text-gray-800 cursor-pointer  block"
                      >
                        Task is Completed, you can't add more Attachment
                      </label>
                    ) : (
                      <label
                        htmlFor="image"
                        className="text-sm font-semibold text-gray-800 cursor-pointer hover:text-blue-700 transition-colors duration-200 block"
                      >
                        Attach Images
                      </label>
                    )}
                  </div>
                </div>
                {taskDetail?.status == "Completed" ? (
                  <input
                    id="image"
                    onChange={handleImageChange}
                    type="file"
                    className="hidden"
                    disabled
                  />
                ) : (
                  <input
                    id="image"
                    onChange={handleImageChange}
                    type="file"
                    className="hidden"
                  />
                )}

                {image && (
                  <div className="relative overflow-hidden rounded-xl ">
                    <img
                      src={image}
                      className="w-full h-18 ml-2 object-cover transition-transform duration-300"
                    />

                    <div className="absolute inset-0  to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </div>
                )}

                <div className="flex-1 flex justify-end gap-x-2 items-center">
                  {image && (
                    <button
                      onClick={() => setImage("")}
                      className="  p-2 bg-white border-2 border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {taskDetail?.status == "Completed" ? (
                    <button
                      className="px-5  py-2 bg-gradient-to-r from-primary/50 to-blue-700/50 hover:from-blue-700/50 hover:to-blue-800/50 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg "
                      disabled
                    >
                      Attach
                    </button>
                  ) : (
                    <button
                      onClick={addImage}
                      className="px-5  py-2 bg-gradient-to-r from-primary to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Attach
                    </button>
                  )}
                </div>

                {/* Subtle background pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
              </div>

              {/* Images Display */}
              {imageList.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-100">
                        <Image className="w-4 h-4 text-primary " />
                      </div>
                      <span className="text-sm font-semibold text-gray-800">
                        Attachments
                      </span>
                      <div className="px-3 py-1 bg-gradient-to-r from-primary to-blue-500 text-white text-xs font-bold rounded-full shadow-sm">
                        {imageList.length}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    {imageList.map((img, index) => (
                      <div key={img.id} className="relative group">
                        <a href={img.image} target="_blank">
                          <div className="relative overflow-hidden rounded-xl border-2 border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <img
                              src={img.image}
                              alt={`Attachment ${index + 1}`}
                              className="w-full h-18 object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <img
                              src={img.whoAddImage}
                              className="w-5 h-5 rounded-full absolute bottom-2 left-2 bg-white shadow "
                              alt=""
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                          </div>
                        </a>
                        {img.whoAddId == user?.uid && (
                          <button
                            onClick={() => removeImage(img.id)}
                            className="absolute -top-2 -right-2 p-1.5 bg-white border-2 border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Image index indicator */}
                        <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Subtasks */}
            <SubtasksComponent task={taskDetail} />

            {/* Comments */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Comments
              </h2>

              {/* New Comment */}
              <div className="flex space-x-3 mb-6">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  <img
                    src={user?.photoURL}
                    className="w-full h-full object-cover rounded-full"
                    alt=""
                  />
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                    rows="3"
                  />
                  <div className="flex justify-end mt-2">
                    {taskDetail?.status == "Completed" ? (
                      <button className=" text-primary/60 px-4 py-2 rounded-lg  transition-colors flex items-center space-x-2">
                        <span>Task Is Complete, Can't Add More Comment</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleAddComment}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                      >
                        <Send className="h-4 w-4" />
                        <span>Comment</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full  flex items-center justify-center text-white text-xs font-medium`}
                    >
                      <img
                        src={comment?.whoCommentImage}
                        className="w-full h-full object-cover rounded-full"
                        alt=""
                      />
                    </div>
                    <div className="flex-1">
                      <div
                        className={`bg-gray-50 ${
                          comment.whoCommentId == comment.adminId &&
                          "bg-red-50/40"
                        } rounded-lg p-3`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-800">
                            {comment.whoCommentName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {moment(comment.time).fromNow()}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">
                          {comment.taskTitle}
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setActiveMenu((prev) =>
                            prev === comment.id ? null : comment.id
                          )
                        }
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>

                      {activeMenu === comment.id && (
                        <div className="absolute right-0 mt-2 w-28 bg-white border rounded-lg shadow-md">
                          <button
                            onClick={() => handleEditComment(comment)}
                            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Task Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">
                Task Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded text-sm font-medium">
                    {taskDetail?.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Priority</span>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      priorityStyles[taskDetail?.priority] ||
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {taskDetail?.priority}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Created</span>
                  <span className="text-gray-800 text-sm">
                    {moment().add(taskDetail?.createdAt).calendar()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Due Date</span>
                  <span
                    className={`text-sm ${
                      taskDetail?.status === "Completed"
                        ? "text-green-600"
                        : taskDetail?.priority === "High" ||
                          taskDetail?.priority === "Critical"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {taskDetail?.dueDate
                      ? moment(taskDetail.dueDate).format(
                          "DD MMM YYYY, hh:mm A"
                        )
                      : "No due date"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(true)}
                className="mt-4 w-full bg-primary hover:bg-primary/70 text-white py-2 rounded-lg font-medium"
              >
                Update Task
              </button>
            </div>

            {/* Assignees */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              {" "}
              <div className="flex items-center justify-between mb-4">
                {" "}
                <h3 className="font-semibold text-gray-800">Assignees</h3>{" "}
                {currentUser.accountType == "admin" && (
                  <>
                    {taskDetail?.status == "Completed" ? (
                      <button className="text-primary/60 text-xs">
                        {" "}
                        Task Complete, Can't Assignee More
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveAssigneeModal(true)}
                        className="text-primary hover:text-primary/70"
                      >
                        {" "}
                        <Plus className="h-5 w-5" />{" "}
                      </button>
                    )}
                  </>
                )}
              </div>
              <div className="space-y-3">
                {assignee.map((member) => (
                  <div key={member?.id} className="relative">
                    <div className="flex items-center space-x-3">
                      {renderAvatar(member)}
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">
                          {member?.assigneeName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {member.assigneeRole}
                        </p>
                      </div>
                      {currentUser.accountType == "admin" && (
                        <button
                          onClick={() => toggleDropdown(member.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* Dropdown */}
                    {openDropdown === member.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border border-primary rounded-lg shadow-lg z-10">
                        <button
                          onClick={() => handleAssigneeRemove(member)}
                          className="flex items-center gap-2 w-full rounded-lg px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {assignee.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10 text-gray-400 mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 20h5V4H2v16h5m10 0v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6m10 0H7"
                      />
                    </svg>
                    <p className="text-gray-500 text-sm font-medium">
                      No assignee yet
                    </p>
                    <p className="text-gray-400 text-xs">
                      Assign members to this task
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;
