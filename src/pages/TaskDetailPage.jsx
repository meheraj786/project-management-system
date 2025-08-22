import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import { useParams } from "react-router";
import { getDatabase, onValue, ref } from "firebase/database";
import moment from "moment";
import AddAssigneeModal from "../layouts/AddAssigneeModal";

const TaskDetailPage = () => {
  const [taskDetail, setTaskDetail] = useState(null);
  const { id } = useParams();
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

useEffect(() => {
  const starCountRef = ref(db, "members/");
  onValue(starCountRef, (snapshot) => {
    let arr = [];
    snapshot.forEach((item) => {
      const members = item.val();
      arr.unshift({ ...members, id: item.key });
    });
    
    const projectMembers = arr.filter((m) => m.projectId == taskDetail.projectId);
    setProjectMembers(projectMembers);
    
    setListForAssignee(() => 
      projectMembers.filter((a) => 
        !assignee.map((m) => m.assigneeId).includes(a.memberId) && a.projectId==taskDetail?.projectId
      )
    );
  });
}, [db, taskDetail, assignee]);
  console.log(listForAssignee, "list");
  console.log(projectMembers, "mem");
  
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

  console.log();

  useEffect(() => {
    const taskRef = ref(db, "tasks/");
    onValue(taskRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), id: item.key });
      });
      setTaskDetail(arr.find((t) => t.id == id));
    });
  }, [db, id]);

  const teamMembers = [
    {
      id: 1,
      name: "John Smith",
      avatar: "bg-blue-500",
      initial: "J",
      role: "Project Manager",
    },
    {
      id: 2,
      name: "Sarah Wilson",
      avatar: "bg-green-500",
      initial: "S",
      role: "UI/UX Designer",
    },
    {
      id: 3,
      name: "Mike Johnson",
      avatar: "bg-purple-500",
      initial: "M",
      role: "Developer",
    },
  ];

  const comments = [
    {
      id: 1,
      author: "Sarah Wilson",
      avatar: "bg-green-500",
      initial: "S",
      time: "2 hours ago",
      content:
        "Great ideas! I think we should focus more on user experience aspects during our brainstorming session.",
    },
    {
      id: 2,
      author: "John Smith",
      avatar: "bg-blue-500",
      initial: "J",
      time: "4 hours ago",
      content:
        "I've added some initial thoughts to the document. Let's schedule a meeting to discuss these ideas further.",
    },
    {
      id: 3,
      author: "Mike Johnson",
      avatar: "bg-purple-500",
      initial: "M",
      time: "1 day ago",
      content:
        "From a technical perspective, we need to consider the feasibility of implementation for each idea.",
    },
  ];

  const subtasks = [
    { id: 1, title: "Research user pain points", completed: true },
    { id: 2, title: "Define problem statements", completed: false },
    { id: 3, title: "Generate solution ideas", completed: false },
    { id: 4, title: "Prioritize ideas by impact", completed: true },
  ];

  const attachments = [
    { id: 1, name: "brainstorming-notes.pdf", size: "2.4 MB", type: "pdf" },
    { id: 2, name: "user-research-data.xlsx", size: "1.8 MB", type: "excel" },
    { id: 3, name: "wireframes-v1.fig", size: "5.2 MB", type: "figma" },
  ];

  const handleCheckboxChange = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const priorityStyles = {
    Low: "bg-blue-100 text-blue-600",
    Medium: "bg-yellow-100 text-yellow-600",
    High: "bg-orange-100 text-orange-600",
    Critical: "bg-red-100 text-red-600",
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

  return (
    <div className="min-h-screen bg-gray-50">
      {activeAssigneeModal && (
        <AddAssigneeModal
          taskDetail={taskDetail}
          users={listForAssignee}
          onClose={() => setActiveAssigneeModal(false)}
        />
      )}
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              Task Details
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Star className="h-5 w-5 text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Share2 className="h-5 w-5 text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal className="h-5 w-5 text-gray-400" />
            </button>
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
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-600">
                    {taskDetail?.status}
                  </span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
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

            {/* Subtasks */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Subtasks
                </h2>
                <button className="text-purple-600 hover:text-purple-700">
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                {subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <button
                      onClick={() => handleCheckboxChange(subtask.id)}
                      className="flex-shrink-0"
                    >
                      {checkedItems[subtask.id] ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    <span
                      className={`flex-1 ${
                        checkedItems[subtask.id]
                          ? "line-through text-gray-500"
                          : "text-gray-700"
                      }`}
                    >
                      {subtask.title}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Comments
              </h2>

              {/* New Comment */}
              <div className="flex space-x-3 mb-6">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  U
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                    rows="3"
                  />
                  <div className="flex justify-end mt-2">
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
                      <Send className="h-4 w-4" />
                      <span>Comment</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full ${comment.avatar} flex items-center justify-center text-white text-xs font-medium`}
                    >
                      {comment.initial}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-800">
                            {comment.author}
                          </span>
                          <span className="text-xs text-gray-500">
                            {comment.time}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">
                          {comment.content}
                        </p>
                      </div>
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
                  <span className="text-red-600 text-sm">
                    {taskDetail?.dueDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Assignees */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Assignees</h3>
                <button
                  onClick={() => setActiveAssigneeModal(true)}
                  className="text-purple-600 hover:text-purple-700"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                {assignee.map((member) => (
                  <div key={member?.id} className="flex items-center space-x-3">
                    {renderAvatar(member)}
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">
                        {member?.assigneeName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {member.assigneeRole}
                      </p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;
