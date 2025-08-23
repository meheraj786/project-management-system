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
  ChartBarBig,
  MessageCircleDashed,
  Building2,
  DollarSign,
  Clock,
  AlertCircle,
  Target,
  Users,
  X,
  Check,
} from "lucide-react";
import { AddTaskModal } from "../layouts/AddTaskModal";
import { Link, useParams } from "react-router";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import ProjectUpdateModal from "../layouts/ProjectUpdateModal";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const ProjectProfile = () => {
  const [addTaskPop, setAddTaskPop] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const db = getDatabase();
  const { id } = useParams();
  const user = useSelector((state) => state.userInfo.value);
  const [updateProjectModal, setUpdateProjectModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [membersPop, setMembersPop] = useState(false);
  const [assignee, setAssignee] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [membersId, setMembersId] = useState([]);
  const [taskImageList, setTaskImageList] = useState([]);

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
    const starCountRef = ref(db, "users/");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const projects = item.val();
        if (projects.adminId == user?.uid) {
          arr.unshift({ ...projects, id: item.key });
        }
      });
      setAllMembers(arr);
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
        setMembersId(arr.map((m) => m.memberId));
      });
    });
  }, [db, id]);
  useEffect(() => {
    const starCountRef = ref(db, "assignee/");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const members = item.val();
        arr.unshift({ ...members, id: item.key });
      });
      setAssignee(arr);
    });
  }, [db]);
  useEffect(() => {
    const taskRef = ref(db, "comment/");
    onValue(taskRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().projectId == projectData.id) {
          arr.push({ ...item.val(), id: item.key });
        }
      });
      setComments(arr);
    });
  }, [db, projectData]);
  useEffect(() => {
    const taskRef = ref(db, "taskimage/");
    onValue(taskRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().projectId == projectData.id) {
          arr.push({ ...item.val(), id: item.key });
        }
      });
      setTaskImageList(arr);
    });
  }, [db, id, projectData]);

  const renderAvatar = (member) => (
    <div
      key={member.id}
      className={`w-8 h-8 rounded-full  flex items-center justify-center text-white text-xs font-medium -ml-2 first:ml-0 border-2 border-white`}
    >
      <img
        src={member.memberImage}
        className="w-full h-full object-cover rounded-full"
        alt=""
      />
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
                  ? "bg-blue-100 text-primary"
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

        {taskImageList.filter((i) => i.taskId == task.id)[0] && (
          <div
            className={`w-full h-32 rounded-lg mb-4 flex items-center justify-center`}
          >
              <img src={taskImageList.filter((i) => i.taskId == task.id)[0].image} className="w-full h-full rounded-lg object-cover object-cover" alt="" />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {assignee.map(
              (as) => (
                <>
                  {as.taskId == task.id && (
                    <div
                      key={as.id}
                      className={`w-8 h-8 rounded-full  flex items-center justify-center text-white text-xs font-medium -ml-2 first:ml-0 border-2 border-white`}
                    >
                      <img
                        src={as.assigneeImage}
                        className="w-full h-full object-cover rounded-full"
                        alt=""
                      />
                    </div>
                  )}
                </>
              )
              // renderAvatar(teamMembers.find((member) => member.id === assigneeId))
            )}
          </div>

          <div className="flex items-center space-x-3 text-gray-500">
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">
                {comments.filter((c) => c.taskId == task.id).length} comments
              </span>
            </div>
              <div className="flex items-center space-x-1">
                <Paperclip className="h-4 w-4" />
                <span className="text-xs">{taskImageList.filter((i) => i.taskId == task.id).length} files</span>
              </div>
          </div>
        </div>
      </div>
    </Link>
  );

  const addMemberHandler = (m) => {
    set(push(ref(db, "members/")), {
      projectId: projectData.id,
      memberId: m.id,
      memberImage: m.profileImage,
      memberName: m.name,
      memberRole: m.role || "",
    }).then(() => toast.success("Member Added"));
  };
  const removeMemberHandler = (id) => {
    const removeid = members.find((m) => m.memberId == id);
    const assigneeRemoveId = assignee.find((m) => m.assigneeId == id);

    remove(ref(db, "members/" + removeid.id)).then(() => {
      toast.success("Member Removed");
      remove(ref(db, "assignee/" + assigneeRemoveId.id));
    });
  };
  return (
    <div className="max-w-7xl mt-10 mx-auto">
      {addTaskPop && (
        <AddTaskModal
          projectData={projectData}
          onClose={() => setAddTaskPop(false)}
        />
      )}
      {updateProjectModal && (
        <ProjectUpdateModal
          projectData={projectData}
          onClose={() => setUpdateProjectModal(false)}
        />
      )}
      {membersPop && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/40 backdrop-blur-sm z-50">
          <div className="max-w-md w-full mx-4 bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-primary p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Add Team Members</h3>
                </div>
                <button
                  onClick={() => setMembersPop(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Members List */}
            <div className="max-h-96 overflow-y-auto">
              <div className="p-2">
                {allMembers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>No members found</p>
                  </div>
                ) : (
                  allMembers.map((member) => {
                    const isSelected = membersId.includes(member.id);

                    return (
                      <div
                        key={member.id}
                        className={`flex items-center justify-between p-3 rounded-lg mb-2 transition-all duration-200 ${
                          isSelected
                            ? "bg-blue-50 border-2 border-blue-200"
                            : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Profile Image */}
                          <div className="relative">
                            <img
                              src={member.profileImage}
                              alt={member.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>

                          {/* Member Info */}
                          <div>
                            <p className="font-medium text-gray-900">
                              {member.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {member.email}
                            </p>
                          </div>
                        </div>

                        {/* Action Button */}
                        {isSelected ? (
                          <button
                            onClick={() => removeMemberHandler(member.id)}
                            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Remove
                          </button>
                        ) : (
                          <button
                            onClick={() => addMemberHandler(member)}
                            className="px-4 py-2 bg-primary hover:bg-primary text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 border-t">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {membersId.length} member{membersId.length !== 1 ? "s" : ""}{" "}
                  selected
                </p>
                <button
                  onClick={() => setMembersPop(false)}
                  className="px-4 py-2 bg-primary hover:bg-primary text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        {/* Title and Actions Row */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-gray-800">
              {projectData?.title}
            </h1>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Edit className="h-5 w-5 text-primary" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Eye className="h-5 w-5 text-primary" />
              </button>
            </div>
          </div>

          {/* Members Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button onClick={() => setMembersPop(true)}>
                <span className="text-primary text-sm font-medium">
                  Manage Members
                </span>
              </button>

              <div className="flex items-center">
                {members.slice(0, 4).map((member, index) => (
                  <div key={index} className="-ml-2 first:ml-0">
                    {renderAvatar(member)}
                  </div>
                ))}
                {members.length > 4 && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-medium -ml-2 border-2 border-white">
                    +{members.length - 4}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Project Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Status */}
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Status:</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border ${
                projectData?.status === "Done"
                  ? "bg-green-100 text-green-800 border-green-200"
                  : projectData?.status === "In Progress"
                  ? "bg-purple-100 text-purple-800 border-purple-200"
                  : projectData?.status === "On Hold"
                  ? "bg-orange-100 text-orange-800 border-orange-200"
                  : projectData?.status === "Todo"
                  ? "bg-blue-100 text-blue-800 border-blue-200"
                  : "bg-gray-100 text-gray-800 border-gray-200"
              }`}
            >
              {projectData?.status || "Not set"}
            </span>
          </div>

          {/* Priority */}
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Priority:</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border ${
                projectData?.priority === "High"
                  ? "bg-red-100 text-red-800 border-red-200"
                  : projectData?.priority === "Medium"
                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                  : projectData?.priority === "Low"
                  ? "bg-green-100 text-green-800 border-green-200"
                  : "bg-gray-100 text-gray-800 border-gray-200"
              }`}
            >
              {projectData?.priority || "Not set"}
            </span>
          </div>

          {/* Start Date */}
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Start:</span>
            <span className="text-sm font-medium text-gray-800">
              {projectData?.startDate
                ? new Date(projectData.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Not set"}
            </span>
          </div>

          {/* End Date */}
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Due:</span>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-800">
                {projectData?.endDate
                  ? new Date(projectData.endDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Not set"}
              </span>
              {projectData?.endDate && (
                <span
                  className={`text-xs ${(() => {
                    const today = new Date();
                    const end = new Date(projectData.endDate);
                    const diffDays = Math.ceil(
                      (end - today) / (1000 * 60 * 60 * 24)
                    );

                    if (diffDays < 0) return "text-red-600";
                    if (diffDays === 0) return "text-orange-600";
                    if (diffDays <= 7) return "text-yellow-600";
                    return "text-green-600";
                  })()}`}
                >
                  {(() => {
                    const today = new Date();
                    const end = new Date(projectData.endDate);
                    const diffDays = Math.ceil(
                      (end - today) / (1000 * 60 * 60 * 24)
                    );

                    if (diffDays < 0)
                      return `${Math.abs(diffDays)} days overdue`;
                    if (diffDays === 0) return "Due today";
                    return `${diffDays} days left`;
                  })()}
                </span>
              )}
            </div>
          </div>

          {/* Budget */}
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Budget:</span>
            <span className="text-sm font-medium text-gray-800">
              {projectData?.budget
                ? `$${Number(projectData.budget).toLocaleString()}`
                : "Not set"}
            </span>
          </div>

          {/* Client */}
          <div className="flex items-center space-x-2">
            <Building2 className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Client:</span>
            <span className="text-sm font-medium text-gray-800">
              {projectData?.client || "Internal"}
            </span>
          </div>
        </div>

        {/* Description */}
        {projectData?.description && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-start space-x-2">
              <span className="text-sm text-gray-600 font-medium">
                Description:
              </span>
              <p className="text-sm text-gray-700 leading-relaxed flex-1">
                {projectData.description}
              </p>
            </div>
          </div>
        )}

        {/* Category Tag */}
        {projectData?.category && (
          <div className="mt-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {projectData.category}
            </span>
          </div>
        )}
      </div>

      {/* Filters and Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setUpdateProjectModal(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-primary group hover:bg-primary hover:text-white rounded-lg bg-white  transition-colors"
          >
            <ChartBarBig className="h-4 w-4 group-hover:text-gray-200 text-gray-500" />
            <span className="text-sm group-hover:text-white text-gray-700">
              Change Status
            </span>
          </button>

          <button className="flex items-center space-x-2 px-4 py-2 border border-primary group hover:bg-primary hover:text-white rounded-lg bg-white transition-colors">
            <MessageCircleDashed className="h-4 w-4 group-hover:text-gray-200 text-gray-500" />
            <span className="text-sm group-hover:text-white text-gray-700">
              Message
            </span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          {projectData?.status == "Done" ? (
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg  transition-colors">
              <span className="text-sm text-primary/70">
                Project Completed, Can't Add More Task
              </span>
            </button>
          ) : (
            <button
              onClick={() => setAddTaskPop(true)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-primary hover:bg-primary/70 transition-colors"
            >
              <Plus className="h-4 w-4 text-white" />
              <span className="text-sm text-white">Add Task</span>
            </button>
          )}

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
                {tasks.filter((t) => t.status == "Todo").length}
              </span>
            </div>
            <button className="text-primary hover:text-purple-700">
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3">
            {tasks
              .filter((t) => t.status == "Todo")
              .map((task) => renderTask(task))}
          </div>
        </div>

        {/* On Progress Column */}
        <div className="bg-gray-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full border-2 border-orange-300"></div>
              <h2 className="font-semibold text-gray-700">On Progress</h2>
              <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                {tasks.filter((t) => t.status == "InProgress").length}
              </span>
            </div>
            <button className="text-primary hover:text-purple-700">
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3">
            {tasks
              .filter((t) => t.status == "InProgress")
              .map((task) => renderTask(task))}
          </div>
        </div>

        {/* Done Column */}
        <div className="bg-gray-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full border-2 border-green-300"></div>
              <h2 className="font-semibold text-gray-700">Done</h2>
              <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                {tasks.filter((t) => t.status == "Completed").length}
              </span>
            </div>
            <button className="text-primary hover:text-purple-700">
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3">
            {tasks
              .filter((t) => t.status == "Completed")
              .map((task) => renderTask(task))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectProfile;
