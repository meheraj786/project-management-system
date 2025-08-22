import React, { useEffect, useState } from "react";
import {
  Filter,
  Calendar,
  Share2,
  MoreHorizontal,
  Plus,
  MessageCircle,
  Paperclip,
  Grid3X3,
  Edit,
  Eye,
} from "lucide-react";
import { AddTaskModal } from "../layouts/AddTaskModal";
import { Link, useParams } from "react-router";
import { getDatabase, onValue, ref } from "firebase/database";

const ProjectProfile = () => {
  const [addTaskPop, setAddTaskPop] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const db = getDatabase();
  const { id } = useParams();
  useEffect(() => {
    const starCountRef = ref(db, "projects/");
    onValue(starCountRef, (snapshot) => {
      snapshot.forEach((item) => {
        const projects = item.val();
        if (item.key == id) {
          setProjectData({ ...projects, id: item.key });
        }
      });
    });
  }, [db, id]);
  useEffect(() => {
    const starCountRef = ref(db, "tasks/");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const task = item.val();
        if (task.projectId == id) {
          arr.unshift({ ...task, id: item.key });
        }
        setTasks(arr);
      });
    });
  }, [db, id]);
  useEffect(() => {
    const starCountRef = ref(db, "members/");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const projects = item.val();
        if (projects.projectId == id) {
          arr.unshift({ ...projects, id: item.key });
        }
        setMembers(arr);
      });
    });
  }, [db, id]);
  const teamMembers = [
    { id: 1, name: "John", avatar: "bg-blue-500", initial: "J" },
    { id: 2, name: "Sarah", avatar: "bg-green-500", initial: "S" },
    { id: 3, name: "Mike", avatar: "bg-primary", initial: "M" },
    { id: 4, name: "Lisa", avatar: "bg-pink-500", initial: "L" },
    { id: 5, name: "Tom", avatar: "bg-orange-500", initial: "T" },
  ];

  const columns = [
    {
      title: "To Do",
      count: 4,
      color: "border-purple-300",
      bgColor: "bg-purple-50",
      tasks: [
        {
          id: 1,
          title: "Brainstorming",
          description:
            "Brainstorming brings team members' diverse experience into play.",
          priority: "Low",
          priorityColor: "bg-blue-100 text-blue-600",
          comments: 12,
          files: 0,
          assignees: [1, 2, 3],
        },
        {
          id: 2,
          title: "Research",
          description:
            "User research helps us to create an optimal product for users.",
          priority: "High",
          priorityColor: "bg-red-100 text-red-600",
          comments: 10,
          files: 3,
          assignees: [2, 4],
        },
        {
          id: 3,
          title: "Wireframes",
          description:
            "Low fidelity wireframes include the most basic content and visuals.",
          priority: "High",
          priorityColor: "bg-red-100 text-red-600",
          comments: 7,
          files: 8,
          assignees: [1, 3, 5],
        },
      ],
    },
    {
      title: "On Progress",
      count: 3,
      color: "border-orange-300",
      bgColor: "bg-orange-50",
      tasks: [
        {
          id: 4,
          title: "Onboarding Illustrations",
          description: "",
          priority: "Low",
          priorityColor: "bg-blue-100 text-blue-600",
          comments: 14,
          files: 15,
          assignees: [2, 3, 4],
          image: "bg-gradient-to-br from-pink-100 to-blue-100",
        },
        {
          id: 5,
          title: "Moodboard",
          description: "",
          priority: "",
          priorityColor: "",
          comments: 9,
          files: 10,
          assignees: [5],
          image: "bg-gradient-to-br from-green-100 to-yellow-100",
        },
      ],
    },
    {
      title: "Done",
      count: 2,
      color: "border-green-300",
      bgColor: "bg-green-50",
      tasks: [
        {
          id: 6,
          title: "Mobile App Design",
          description: "",
          priority: "Completed",
          priorityColor: "bg-green-100 text-green-600",
          comments: 12,
          files: 15,
          assignees: [1, 2],
          image: "bg-gradient-to-br from-gray-100 to-gray-200",
        },
        {
          id: 7,
          title: "Design System",
          description: "It just needs to adapt the UI from what you did before",
          priority: "Completed",
          priorityColor: "bg-green-100 text-green-600",
          comments: 12,
          files: 15,
          assignees: [1, 3, 5],
        },
      ],
    },
  ];

  const renderAvatar = (member) => (
    <div
      key={member.id}
      className={`w-8 h-8 rounded-full  flex items-center justify-center text-white text-xs font-medium -ml-2 first:ml-0 border-2 border-white`}
    >
      <img src={member.memberImage} className="rounded-full" alt="" />
    </div>
  );

  const renderTask = (task) => (
    <Link to={`/task/${task.id}`}>
    <div
      key={task.id}
      className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-3">
        {task.priority && (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              task.priority === "Low"
                ? "bg-blue-100 text-blue-600"
                : task.priority === "Medium"
                ? "bg-yellow-100 text-yellow-600"
                : task.priority === "High"
                ? "bg-red-100 text-red-600"
                : task.priority === "Critical"
                ? "bg-red-200 text-red-800"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {task.priority}
          </span>
        )}

        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <h3 className="font-semibold text-gray-800 mb-2">{task?.title}</h3>

      {task?.description && (
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          {task?.description}
        </p>
      )}

      {task.image && (
        <div
          className={`w-full h-32 rounded-lg mb-4 ${task.image} flex items-center justify-center`}
        >
          <div className="w-16 h-16 bg-white bg-opacity-50 rounded-lg flex items-center justify-center">
            <Eye className="h-8 w-8 text-gray-400" />
          </div>
        </div>
      )}

      {/* <div className="flex items-center justify-between">
        <div className="flex items-center">
          {task.assignees.map((assigneeId) =>
            renderAvatar(teamMembers.find((member) => member.id === assigneeId))
          )}
        </div>

        <div className="flex items-center space-x-3 text-gray-500">
          <div className="flex items-center space-x-1">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{task.comments} comments</span>
          </div>
          {task.files > 0 && (
            <div className="flex items-center space-x-1">
              <Paperclip className="h-4 w-4" />
              <span className="text-xs">{task.files} files</span>
            </div>
          )}
        </div>
      </div> */}
    </div>
    
    </Link>
  );

  return (
    <div className="max-w-7xl mt-10 mx-auto">
      {addTaskPop && (
        <AddTaskModal
          projectData={projectData}
          onClose={() => setAddTaskPop(false)}
        />
      )}
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold text-gray-800">
            {projectData?.title}
          </h1>
          <div className="flex items-center space-x-2">
            <Edit className="h-5 w-5 text-primary" />
            <Eye className="h-5 w-5 text-primary" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Invite Section */}
          <div className="flex items-center space-x-2">
            <span className="text-primary text-sm">Manege Member</span>
            <div className="flex items-center">
              {members.slice(0, 4).map((member) => renderAvatar(member))}
              {members.length > 4 && (
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-medium -ml-2 border-2 border-white">
                  {members.length - 4}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">Filter</span>
          </button>

          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">Today</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAddTaskPop(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-primary hover:bg-primary/70 transition-colors"
          >
            <Plus className="h-4 w-4 text-white" />
            <span className="text-sm text-white">Add Task</span>
          </button>

          <button className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-purple-700 transition-colors">
            <Grid3X3 className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* To Do Column */}
        <div className="bg-gray-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full border-2 border-purple-300"></div>
              <h2 className="font-semibold text-gray-700">To Do</h2>
              <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                3
              </span>
            </div>
            <button className="text-primary hover:text-purple-700">
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3">
            {tasks.filter((t)=>t.status=="Todo").map((task) => renderTask(task))}
          </div>
        </div>

        {/* On Progress Column */}
        <div className="bg-gray-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full border-2 border-orange-300"></div>
              <h2 className="font-semibold text-gray-700">On Progress</h2>
              <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                2
              </span>
            </div>
            <button className="text-primary hover:text-purple-700">
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3">
            {tasks.filter((t)=>t.status=="InProgress").map((task) => renderTask(task))}
          </div>
        </div>

        {/* Done Column */}
        <div className="bg-gray-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full border-2 border-green-300"></div>
              <h2 className="font-semibold text-gray-700">Done</h2>
              <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                2
              </span>
            </div>
            <button className="text-primary hover:text-purple-700">
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3">
            {tasks.filter((t)=>t.status=="Completed").map((task) => renderTask(task))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectProfile;
