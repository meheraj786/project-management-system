import React, { useEffect, useState } from "react";
import { getDatabase, push, ref, remove, set, update } from "firebase/database";
import toast from "react-hot-toast";
import {
  X,
  Calendar,
  DollarSign,
  User,
  Building2,
  Tag,
  FileText,
  Target,
  AlertCircle,
  Trash,
} from "lucide-react";
import { useSelector } from "react-redux";
import moment from "moment";
import { useNavigate } from "react-router";

const ProjectUpdateModal = ({ members, projectData, onClose }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.userInfo.value);
  const [formData, setFormData] = useState({
    title: "",
    status: "",
    priority: "",
    startDate: "",
    endDate: "",
    budget: "",
    client: "",
    category: "",
    description: "",
  });

  const db = getDatabase();

  useEffect(() => {
    if (projectData) {
      setFormData({
        id: projectData.id,
        title: projectData.title || "",
        status: projectData.status || "",
        priority: projectData.priority || "",
        startDate: projectData.startDate || "",
        endDate: projectData.endDate || "",
        budget: projectData.budget || "",
        client: projectData.client || "",
        category: projectData.category || "",
        description: projectData.description || "",
      });
    }
  }, [projectData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    update(ref(db, "projects/" + formData.id), {
      title: formData.title,
      status: formData.status,
      priority: formData.priority,
      startDate: formData.startDate,
      endDate: formData.endDate,
      budget: formData.budget,
      client: formData.client,
      category: formData.category,
      description: formData.description,
    })
      .then(() => {
        toast.success("Project Updated Successfully!");
        set(push(ref(db, "activity/")), {
          userid: user?.uid,
          userName: user?.displayName,
          userImage: user?.photoURL,
          acitvityIn: "project",
          projectId: projectData?.id,
          action: "Update",
          content: `update project status.`,
          time: moment().format(),
          type: "updated",
        });
        onClose();
      })
      .catch((err) => toast.error(err.message));
  };

  const projectDeleteHandler = () => {
    remove(ref(db, "projects/" + projectData.id)).then(() => {
      toast.success("Project Deleted");
      members.map((m) => remove(ref(db, "members/" + m.id)));
      navigate("/");
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Update Project
              </h2>
              <p className="text-sm text-gray-500">
                Modify project details and settings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Title */}
            <div className="md:col-span-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Target className="h-4 w-4" />
                <span>Project Title</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter project title"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            {/* Status */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Target className="h-4 w-4" />
                <span>Status</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              >
                <option value="">Select Status</option>
                <option value="Todo">🔵 Todo</option>
                <option value="In Progress">🟣 In Progress</option>
                <option value="On Hold">🟠 On Hold</option>
                <option value="Done">🟢 Done</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <AlertCircle className="h-4 w-4" />
                <span>Priority</span>
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              >
                <option value="">Select Priority</option>
                <option value="Low">🟢 Low</option>
                <option value="Medium">🟡 Medium</option>
                <option value="High">🔴 High</option>
                <option value="High">🔴 Critical</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4" />
                <span>Start Date</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4" />
                <span>End Date</span>
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="h-4 w-4" />
                <span>Budget</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Client */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Building2 className="h-4 w-4" />
                <span>Client</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                  placeholder="Client name"
                  className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Category */}
            <div className="md:col-span-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Tag className="h-4 w-4" />
                <span>Category</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              >
                <option value="">Select Category</option>
                <option value="Development">💻 Development</option>
                <option value="Design">🎨 Design</option>
                <option value="Marketing">📢 Marketing</option>
                <option value="Research">🔍 Research</option>
                <option value="Testing">🧪 Testing</option>
                <option value="Other">📋 Other</option>
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4" />
                <span>Description</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter project description..."
                rows={4}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={projectDeleteHandler}
              className="px-3 flex items-center gap-x-2 py-1 text-sm bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors font-medium"
            >
              <Trash />
              Delete This Project
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium shadow-lg shadow-primary/25"
            >
              Update Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectUpdateModal;
