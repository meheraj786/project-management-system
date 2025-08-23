import React, { useContext, useEffect, useState } from "react";
import {
  Calendar,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  AlertCircle,
  Plus,
  ArrowRight,
  BarChart3,
  MessageCircle,
  Star,
  Filter,
  Search,
  Bell,
  Settings,
  MoreHorizontal,
  FolderOpen,
  Target,
  Award,
  Activity,
} from "lucide-react";
import { useSelector } from "react-redux";
import ProjectCreationModal from "../layouts/ProjectCreationModal";
import { UserContext } from "../context/UserContext";
import { getDatabase, onValue, ref } from "firebase/database";
import Flex from "../layouts/Flex";
import { Link } from "react-router";

const Home = () => {
  const user = useSelector((state) => state.userInfo.value);
  const db = getDatabase();
  const [projects, setProjects] = useState([]);
  const [member, setMember] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [ownProjectsId, setOwnProjectsId] = useState([]);
  const [ownTaskId, setOwnTaskId]= useState([])
  useEffect(() => {
    const starCountRef = ref(db, "tasks/");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const task = item.val();
        if (task.adminId == user?.uid || ownTaskId.includes(item.key)) {
          arr.unshift({ ...task, id: item.key });
        }
        setTasks(arr);
      });
    });
  }, [db, ownTaskId]);
  useEffect(() => {
    const starCountRef = ref(db, "members/");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const members = item.val();
        arr.unshift({ ...members, id: item.key });
      });
      setProjectMembers(arr);
    });
  }, [db]);
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
    const starCountRef = ref(db, "users/");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const members = item.val();
        if (members.adminId == user?.uid) {
          arr.push({ ...members, id: item.key });
        }
      });
      setMember(arr);
    });
  }, []);
  useEffect(() => {
    const starCountRef = ref(db, "assignee/");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const assignee = item.val();
        const assigneeId=item.key
        if (assignee.assigneeId == user?.uid) {
          arr.unshift(assignee.taskId);
        }
        setOwnTaskId(arr);
      });
    });
  }, [db]);
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

  const { currentUser } = useContext(UserContext);
  const [projectModal, setProjectModal] = useState(false);
  const stats = [
    {
      title: "Total Tasks",
      value: tasks.length,
      icon: CheckCircle,
      color: "bg-blue-500",
    },
    {
      title: "In Progress",
      value: tasks.filter((t) => t.status == "InProgress").length,
      icon: Clock,
      color: "bg-orange-500",
    },
    {
      title: "Completed",
      value: tasks.filter((t) => t.status == "Completed").length,
      icon: Award,
      color: "bg-green-500",
    },
    {
      title: "Team Members",
      value: member.length,
      icon: Users,
      color: "bg-primary",
    },
  ];

  // const recentProjects = [
  //   {
  //     id: 1,
  //     name: "Mobile App",
  //     progress: 75,
  //     status: "On Track",
  //     statusColor: "bg-green-100 text-green-600",
  //     dueDate: "Dec 15, 2024",
  //     team: [
  //       { name: "J", color: "bg-blue-500" },
  //       { name: "S", color: "bg-green-500" },
  //       { name: "M", color: "bg-primary" },
  //     ],
  //     tasks: { total: 24, completed: 18 },
  //   },
  //   {
  //     id: 2,
  //     name: "Website Redesign",
  //     progress: 45,
  //     status: "In Progress",
  //     statusColor: "bg-orange-100 text-orange-600",
  //     dueDate: "Jan 10, 2025",
  //     team: [
  //       { name: "A", color: "bg-pink-500" },
  //       { name: "T", color: "bg-yellow-500" },
  //     ],
  //     tasks: { total: 18, completed: 8 },
  //   },
  //   {
  //     id: 3,
  //     name: "Design System",
  //     progress: 90,
  //     status: "Almost Done",
  //     statusColor: "bg-blue-100 text-blue-600",
  //     dueDate: "Nov 30, 2024",
  //     team: [
  //       { name: "L", color: "bg-red-500" },
  //       { name: "K", color: "bg-indigo-500" },
  //     ],
  //     tasks: { total: 15, completed: 13 },
  //   },
  // ];

  // const recentActivities = [
  //   {
  //     id: 1,
  //     user: "Sarah Wilson",
  //     action: "completed",
  //     target: "Mobile App Design",
  //     time: "2 minutes ago",
  //     avatar: "bg-green-500",
  //     initial: "S",
  //     type: "completed"
  //   },
  //   {
  //     id: 2,
  //     user: "John Smith",
  //     action: "added comment on",
  //     target: "Brainstorming session",
  //     time: "1 hour ago",
  //     avatar: "bg-blue-500",
  //     initial: "J",
  //     type: "comment"
  //   },
  //   {
  //     id: 3,
  //     user: "Mike Johnson",
  //     action: "uploaded files to",
  //     target: "Wireframes task",
  //     time: "3 hours ago",
  //     avatar: "bg-primary",
  //     initial: "M",
  //     type: "upload"
  //   },
  //   {
  //     id: 4,
  //     user: "Lisa Chen",
  //     action: "created new task",
  //     target: "User Testing Phase",
  //     time: "5 hours ago",
  //     avatar: "bg-pink-500",
  //     initial: "L",
  //     type: "created"
  //   },
  //   {
  //     id: 5,
  //     user: "Tom Wilson",
  //     action: "updated status of",
  //     target: "API Integration",
  //     time: "1 day ago",
  //     avatar: "bg-orange-500",
  //     initial: "T",
  //     type: "updated"
  //   }
  // ];

  const upcomingTasks = [
    {
      id: 1,
      title: "Design System Documentation",
      project: "Design System",
      dueDate: "Tomorrow",
      priority: "High",
      priorityColor: "bg-red-100 text-red-600",
      assignee: { name: "S", color: "bg-green-500" },
    },
    {
      id: 2,
      title: "User Testing Session",
      project: "Mobile App",
      dueDate: "Dec 2",
      priority: "Medium",
      priorityColor: "bg-yellow-100 text-yellow-600",
      assignee: { name: "J", color: "bg-blue-500" },
    },
    {
      id: 3,
      title: "API Integration Review",
      project: "Website Redesign",
      dueDate: "Dec 5",
      priority: "Low",
      priorityColor: "bg-blue-100 text-blue-600",
      assignee: { name: "M", color: "bg-primary" },
    },
  ];
  const priorityStyles = {
    Low: "bg-blue-100 text-blue-600",
    Medium: "bg-yellow-100 text-yellow-600",
    High: "bg-orange-100 text-orange-600",
    Critical: "bg-red-100 text-red-600",
  };

  // const getActivityIcon = (type) => {
  //   switch (type) {
  //     case 'completed':
  //       return <CheckCircle className="h-4 w-4 text-green-500" />;
  //     case 'comment':
  //       return <MessageCircle className="h-4 w-4 text-blue-500" />;
  //     case 'upload':
  //       return <FolderOpen className="h-4 w-4 text-primary" />;
  //     case 'created':
  //       return <Plus className="h-4 w-4 text-orange-500" />;
  //     case 'updated':
  //       return <Activity className="h-4 w-4 text-indigo-500" />;
  //     default:
  //       return <Activity className="h-4 w-4 text-gray-500" />;
  //   }
  // };

  return (
    <div className="min-h-screen font-primary bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {projectModal && (
          <ProjectCreationModal
            onClose={() => setProjectModal(false)}
            member={member}
          />
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 p-6 rounded-2xl shadow-sm mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Good Morning,{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {user?.displayName.split(" ")[0]}
              </span>{" "}
              👋
            </h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Here's what's happening with your projects today.
            </p>

            <div className="mt-4 space-y-1 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Account Type:</span>{" "}
                {currentUser?.accountType}
              </p>
              <p>
                <span className="font-semibold">Company:</span>{" "}
                {currentUser?.companyName}
              </p>
              <p>
                <span className="font-semibold">Your Role:</span>{" "}
                {currentUser?.role}
              </p>

              {currentUser?.accountType === "admin" ? (
                <p>
                  <span className="font-semibold">Business Type:</span>{" "}
                  {currentUser?.businessType}
                </p>
              ) : (
                <p>
                  <span className="font-semibold">Department:</span>{" "}
                  {currentUser?.department}
                </p>
              )}
            </div>
          </div>

          {currentUser.accountType == "admin" && (
            <div className="flex items-center space-x-3 mt-6 md:mt-0">
              <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 font-medium">Today</span>
              </button>

              <button
                onClick={() => setProjectModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-all duration-200 flex items-center space-x-2 shadow-md"
              >
                <Plus className="h-4 w-4" />
                <span className="font-medium">New Project</span>
              </button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentUser?.accountType == "admin"
            ? stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm mb-1">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                      >
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                );
              })
            : stats
                .filter((s) => s.title !== "Team Members")
                .map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm mb-1">
                            {stat.title}
                          </p>
                          <p className="text-2xl font-bold text-gray-800">
                            {stat.value}
                          </p>
                          <p
                            className={`text-sm ${
                              stat.changeType === "positive"
                                ? "text-green-600"
                                : stat.changeType === "negative"
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
                          >
                            {stat.change} from last month
                          </p>
                        </div>
                        <div
                          className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                        >
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                  );
                })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Recent Projects
                  </h2>
                  <Link to={`/allprojects`}>
                    <button className="text-primary hover:text-purple-700 flex items-center space-x-1">
                      <span className="text-sm">View All</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {projects.map((project) => (
                  <Link to={`/project/${project.id}`}>
                    <div
                      key={project.id}
                      className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-gray-800">
                            {project.title}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              project.status == "Todo"
                                ? "bg-purple-700 text-white"
                                : project.status == "Progress"
                                ? "bg-yellow-500 text-white"
                                : "bg-green-500 text-white"
                            } `}
                          >
                            {project.status}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium 
    ${
      project.priority == "Low"
        ? "bg-green-100 text-green-600"
        : project.priority == "Medium"
        ? "bg-yellow-100 text-yellow-600"
        : "bg-red-100 text-red-600"
    }`}
                          >
                            {project.priority}
                          </span>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                      <p
                        className={`px-2 py-1 rounded mb-4 text-xs font-medium
    ${
      project.category === "Development"
        ? "bg-blue-100 text-blue-700"
        : project.category === "Design"
        ? "bg-pink-100 text-pink-700"
        : project.category === "Marketing"
        ? "bg-indigo-100 text-indigo-700"
        : project.category === "Research"
        ? "bg-teal-100 text-teal-700"
        : "bg-gray-100 text-gray-700"
    }`}
                      >
                        {project.category}
                      </p>

                      <p className="text-sm text-gray-500 mt-2 mb-2 line-clamp-1">
                        {project.description}
                      </p>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            {projectMembers
                              .filter((p) => p.projectId == project.id)
                              .map((member, idx) => (
                                <div
                                  key={idx}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs -ml-1 first:ml-0 border border-white`}
                                >
                                  <img
                                    src={member.memberImage}
                                    className="w-full h-full object-cover rounded-full"
                                    alt=""
                                  />
                                </div>
                              ))}
                            <span className="text-[12px] text-primary">
                              {" "}
                              ...
                              {projectMembers.filter(
                                (p) => p.projectId == project.id
                              ).length > 0
                                ? projectMembers.filter(
                                    (p) => p.projectId == project.id
                                  ).length
                                : "no"}
                              Members
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {/* {project.tasks.completed}/{project.tasks.total} tasks */}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          Due: {project.endDate}
                        </span>
                      </div>

                      {/* <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div> */}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">
                  Upcoming Tasks
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {tasks
                  .filter((t) => t.status == "Todo")
                  .map((task) => (
                    // {tasks.map((task) => (
                    <Link to={`/task/${task.id}`}>
                      <div
                        key={task.id}
                        className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <div
                          className={`w-6 h-6 ${
                            priorityStyles[task?.priority] ||
                            "bg-gray-100 text-gray-600"
                          } rounded-full flex items-center justify-center text-white text-xs flex-shrink-0`}
                        >
                          {task?.title?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-800 text-sm truncate">
                            {task?.title}
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-1 mb-2">
                            {task?.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                priorityStyles[task?.priority] ||
                                "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {task?.priority}
                            </span>
                            <span className="text-xs text-gray-500">
                              {task?.dueDate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}

                {/* <button className="w-full py-2 text-primary hover:text-purple-700 text-sm font-medium flex items-center justify-center space-x-1">
                  <Plus className="h-4 w-4" />
                  <span>Add Task</span>
                </button> */}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
              <button className="text-primary hover:text-purple-700 flex items-center space-x-1">
                <span className="text-sm">View All</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map(activity => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 ${activity.avatar} rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0`}>
                    {activity.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                      <span className="font-medium text-primary">{activity.target}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> */}

        {/* Quick Actions */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-primary to-primary rounded-xl p-6 text-white">
            <Target className="h-8 w-8 mb-4 opacity-80" />
            <h3 className="font-semibold mb-2">Create New Project</h3>
            <p className="text-sm opacity-90 mb-4">Start a new project and invite your team members</p>
            <button className="bg-white text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
              Get Started
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <Users className="h-8 w-8 mb-4 opacity-80" />
            <h3 className="font-semibold mb-2">Invite Team Members</h3>
            <p className="text-sm opacity-90 mb-4">Collaborate with your team and get things done faster</p>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
              Invite Now
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <BarChart3 className="h-8 w-8 mb-4 opacity-80" />
            <h3 className="font-semibold mb-2">View Analytics</h3>
            <p className="text-sm opacity-90 mb-4">Track your team's progress and productivity metrics</p>
            <button className="bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
              View Reports
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Home;
