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
import { getDatabase, onValue, ref, remove } from "firebase/database";
import { useSelector } from "react-redux";
import { Link, Outlet } from "react-router";
import CustomLoader from '../layouts/CustomLoader.jsx'

const Messages = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading]= useState(true)
  const user = useSelector((state) => state.userInfo.value);
  const [projects, setProjects] = useState([]);
  const [ownProjectsId, setOwnProjectsId] = useState([]);
  const db = getDatabase();

  const [msgNotif, setMsgNotif] = useState([]);

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
      setLoading(false)
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
  useEffect(() => {
    const starCountRef = ref(db, "messagenotification/");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const projects = item.val();
        if (projects.reciverId == user?.uid) {
          arr.unshift({ ...projects, id: item.key });
        }
        setMsgNotif(arr);
      });
    });
  }, [db]);

  const removeMsgNotif = (id) => {
    const filtered = msgNotif.filter((n) => n.projectId === id);

    filtered.forEach((m) => remove(ref(db, "messagenotification/" + m.id)));

    setMsgNotif(msgNotif.filter((n) => n.projectId !== id));
  };


  if (loading)  return <CustomLoader/>
  return (
    <div className="flex h-[91vh] bg-gray-50">
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
            <Link to={`/messages/${project.id}`} key={project.id}>
              <div
                onClick={() => removeMsgNotif(project.id)}
                className={`p-4 relative cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  selectedProject === project.id
                    ? "bg-blue-50 border-r-4 border-r-blue-600"
                    : ""
                }`}
              >
                {msgNotif.some((n) => n.projectId == project.id) && (
                    <span className="w-3 h-3 bg-red-500 absolute rounded-full top-2 right-2"></span>
                )}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {project?.avatar ? (
                      <img
                        src={project?.avatar}
                        alt={project?.title}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 bg-primary text-white h-10 rounded-full flex justify-center items-center">
                        {project?.title?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
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
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full
    ${project.status === "Todo" && "bg-gray-100 text-gray-600"}
    ${project.status === "In Progress" && "bg-blue-100 text-blue-600"}
    ${project.status === "Done" && "bg-green-100 text-green-600"}
    ${project.status === "On Hold" && "bg-yellow-100 text-yellow-700"}
  `}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <Outlet />
    </div>
  );
};

export default Messages;
