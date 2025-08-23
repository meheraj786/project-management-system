import React, { useState, useEffect, useContext } from "react";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  DollarSign,
  User,
  Building2,
  Clock,
  AlertCircle,
  Target,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { getDatabase, onValue, ref } from "firebase/database";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import ProjectCreationModal from "../layouts/ProjectCreationModal";
import { UserContext } from "../context/UserContext";

const AllProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const user = useSelector((state) => state.userInfo.value);
  const db = getDatabase();
  const { currentUser } = useContext(UserContext);
  const [ownProjectsId, setOwnProjectsId] = useState([]);
  const [projectCreationPop, setProjectCreationPop] = useState(false);
  const [member, setMember] = useState([]);

  // Sample data - replace with your actual data

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

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || project.status === selectedStatus;
    const matchesPriority =
      selectedPriority === "All" || project.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Group projects by status
  const groupedProjects = {
    Todo: filteredProjects.filter((p) => p.status === "Todo"),
    "In Progress": filteredProjects.filter((p) => p.status === "In Progress"),
    "On Hold": filteredProjects.filter((p) => p.status === "On Hold"),
    Done: filteredProjects.filter((p) => p.status === "Done"),
  };

  // Status colors
  const getStatusColor = (status) => {
    switch (status) {
      case "Todo":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "In Progress":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "On Hold":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Done":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Priority colors
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Project Card Component
  const ProjectCard = ({ project }) => (
    <Link to={`/project/${project.id}`}>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {project.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {project.description}
            </p>
          </div>
          <div className="relative"></div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">
                Due: {formatDate(project.endDate)}
              </span>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                project.priority
              )}`}
            >
              {project.priority}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{project.client}</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">
                ${Number(project.budget).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <Target className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">{project.category}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              project.status
            )}`}
          >
            {project.status}
          </span>
        </div>
      </div>
    </Link>
  );

  // Status Column Component
  const StatusColumn = ({ status, projects, color }) => (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${color}`}></div>
          <h3 className="font-semibold text-gray-800">{status}</h3>
          <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
            {projects.length}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Target className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No projects</p>
          </div>
        ) : (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {projectCreationPop && (
          <ProjectCreationModal
            member={member}
            onClose={() => setProjectCreationPop(false)}
          />
        )}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">All Projects</h1>
            <p className="text-gray-600 mt-1">
              Manage and track all your projects
            </p>
          </div>
          {currentUser.accountType == "admin" && (
            <button
              onClick={() => setProjectCreationPop(true)}
              className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>New Project</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="All">All Status</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="Done">Done</option>
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Stats */}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Total: {filteredProjects.length}</span>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatusColumn
            status="Todo"
            projects={groupedProjects["Todo"]}
            color="bg-blue-500"
          />
          <StatusColumn
            status="In Progress"
            projects={groupedProjects["In Progress"]}
            color="bg-purple-500"
          />
          <StatusColumn
            status="On Hold"
            projects={groupedProjects["On Hold"]}
            color="bg-orange-500"
          />
          <StatusColumn
            status="Done"
            projects={groupedProjects["Done"]}
            color="bg-green-500"
          />
        </div>
      </div>
    </div>
  );
};

export default AllProjectsPage;
