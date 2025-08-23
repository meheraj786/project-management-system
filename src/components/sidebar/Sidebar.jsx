import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import {
  Home,
  MessageCircle,
  CheckSquare,
  Users,
  Settings,
  Plus,
  MoreHorizontal,
  Lightbulb,
  Edit3,
  ArrowBigRight,
  ArrowRight,
} from "lucide-react";
import { getDatabase, onValue, ref } from "firebase/database";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const user = useSelector((state) => state.userInfo.value);
  const db = getDatabase();
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const starCountRef = ref(db, "projects/");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const projects = item.val();
        if (projects.adminId == user?.uid) {
          arr.unshift({ ...projects, id: item.key });
        }
      });
      setProjects(arr);
    });
  }, [db]);
  const menuItems = [
    { name: "Home", icon: Home, path: "/", count: null },
    { name: "Messages", icon: MessageCircle, path: "/messages", count: null },
    { name: "Tasks", icon: CheckSquare, path: "/tasks", count: null },
    { name: "Members", icon: Users, path: "/members", count: null },
    { name: "Settings", icon: Settings, path: "/settings", count: null },
  ];

  // const projects = [
  //   {
  //     name: 'Mobile App',
  //     color: 'bg-green-500',
  //     active: true
  //   },
  //   {
  //     name: 'Website Redesign',
  //     color: 'bg-yellow-500',
  //     active: false
  //   },
  //   {
  //     name: 'Design System',
  //     color: 'bg-gray-400',
  //     active: false
  //   },
  //   {
  //     name: 'Wireframes',
  //     color: 'bg-primary',
  //     active: false
  //   },
  // ];

  return (
    <div className="w-64 h-[88vh] bg-white border-r border-gray-200 flex flex-col">
      {/* Navigation Menu */}
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary/8 text-black border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <IconComponent
                      className={`mr-3 h-5 w-5 ${
                        isActive ? "text-primary" : "text-gray-400"
                      }`}
                    />
                    {item.name}
                    {item.count && (
                      <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* My Projects Section */}
        <div className="mt-8">
          <Link to={`/allprojects`}>
          <div className="flex items-center group justify-between px-3 mb-4">
            <h3 className="text-xs font-semibold text-primary uppercase tracking-wide">
              MY PROJECTS
            </h3>
            <button className="text-primary group-hover:translate-x-2 transition-all duration-200 hover:text-gray-600">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          </Link>

          <div className="space-y-2">
            {projects.map((project, index) => {
              const priorityColor =
                project.priority === "High"
                  ? "bg-red-100 text-red-700"
                  : project.priority === "Medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700";

              return (
                <Link to={`/project/${project.id}`}>
                <div
                  key={index}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    project.priorityColor ? "bg-gray-50" : "hover:bg-gray-50"
                  } group`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-3 ${priorityColor}`}
                    ></div>
                    <span
                      className={`text-sm ${
                        project.active
                          ? "text-gray-900 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {project.title}
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Thoughts Time Card */}
      <div className="px-4 pb-6">
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
          <div className="flex flex-col items-center text-center">
            {/* Light bulb icon */}
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mb-3">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>

            <h4 className="font-semibold text-gray-800 text-sm mb-2">
              Thoughts Time
            </h4>

            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              We don't have any record for you. So feel free you can share your
              thoughts with your team.
            </p>

            <button className="w-full bg-white text-gray-700 text-xs font-medium px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center">
              <Edit3 className="h-3 w-3 mr-2" />
              Write a message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
