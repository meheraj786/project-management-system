import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Search,
  Users,
  Settings,
  Phone,
  Video,
  Paperclip,
  Smile,
  MoreVertical,
} from "lucide-react";
import Conversation from "../layouts/Conversation";
import { getDatabase, onValue, ref } from "firebase/database";
import { useSelector } from "react-redux";

const Messages = () => {
  const [selectedProject, setSelectedProject] = useState(1);
  
  const user = useSelector((state) => state.userInfo.value);
  const [projects, setProjects] = useState([]);
  const [ownProjectsId, setOwnProjectsId] = useState([]);
  const db= getDatabase()

  // Sample projects data
  // const [projects] = useState([
  //   {
  //     id: 1,
  //     name: "E-commerce Website",
  //     avatar:
  //       "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=50&h=50&fit=crop",
  //     lastMessage: "Design files are ready for review",
  //     lastMessageTime: "2m ago",
  //     unreadCount: 3,
  //     members: 8,
  //     isOnline: true,
  //   },
  //   {
  //     id: 2,
  //     name: "Mobile App Development",
  //     avatar:
  //       "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=50&h=50&fit=crop",
  //     lastMessage: "API integration completed",
  //     lastMessageTime: "15m ago",
  //     unreadCount: 0,
  //     members: 5,
  //     isOnline: true,
  //   },
  //   {
  //     id: 3,
  //     name: "Marketing Campaign",
  //     avatar:
  //       "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=50&h=50&fit=crop",
  //     lastMessage: "Meeting scheduled for tomorrow",
  //     lastMessageTime: "1h ago",
  //     unreadCount: 1,
  //     members: 12,
  //     isOnline: false,
  //   },
  //   {
  //     id: 4,
  //     name: "Database Optimization",
  //     avatar:
  //       "https://images.unsplash.com/photo-1518186233392-c232efbf2373?w=50&h=50&fit=crop",
  //     lastMessage: "Performance improved by 40%",
  //     lastMessageTime: "3h ago",
  //     unreadCount: 0,
  //     members: 4,
  //     isOnline: true,
  //   },
  // ]);
  useEffect(() => {
    const starCountRef = ref(db, "projects/");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const projects = item.val();
        const projectId = item.key;
        if (
          projects.adminId == user?.uid ||
          ownProjectsId.includes(projectId)
        ) {
          arr.unshift({ ...projects, id: item.key });
        }
      });
      setProjects(arr);
    });
  }, [db, ownProjectsId]);
  useEffect(() => {
    const starCountRef = ref(db, "members/");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const projects = item.val();
        if (projects.memberId == user?.uid) {
          arr.unshift(projects.projectId);
        }
        setOwnProjectsId(arr);
      });
    });
  }, [db]);

  // Sample messages data

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Projects Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Project Chats
          </h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project.id)}
              className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                selectedProject === project.id
                  ? "bg-blue-50 border-r-4 border-r-blue-600"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={project.adminImage}
                    alt={project.title}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                  {project.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      className={`font-semibold text-sm truncate ${
                        selectedProject === project.id
                          ? "text-blue-700"
                          : "text-gray-900"
                      }`}
                    >
                      {project.title}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {project.lastMessageTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">
                      {project.lastMessage}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {project.members}
                        </span>
                      </div>
                      {project.unreadCount > 0 && (
                        <div className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                          {project.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <Conversation projects={projects} selectedProject={selectedProject} />
    </div>
  );
};

export default Messages;
