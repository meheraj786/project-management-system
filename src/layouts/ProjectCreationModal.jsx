import React, { useState } from "react";
import {
  X,
  Calendar,
  Clock,
  Users,
  Tag,
  FileText,
  Plus,
  Upload,
  ChevronDown,
} from "lucide-react";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { getDatabase, push, ref, set } from "firebase/database";

const ProjectCreationModal = ({ member, onClose }) => {
  const db = getDatabase();
  const user = useSelector((state) => state.userInfo.value);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    priority: "Medium",
    category: "Development",
    adminId: user?.uid,
    status: "Todo",
    budget: "",
    client: "",
  });

  const [newTag, setNewTag] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const priorities = ["Low", "Medium", "High", "Critical"];
  const categories = [
    "Development",
    "Design",
    "Marketing",
    "Testing",
    "Research",
    "Other",
  ];

  const teamMembers = [
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      avatar: "bg-blue-500",
      initial: "J",
    },
    {
      id: 2,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      avatar: "bg-green-500",
      initial: "S",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      avatar: "bg-purple-500",
      initial: "M",
    },
    {
      id: 4,
      name: "Lisa Chen",
      email: "lisa@example.com",
      avatar: "bg-pink-500",
      initial: "L",
    },
    {
      id: 5,
      name: "Tom Wilson",
      email: "tom@example.com",
      avatar: "bg-orange-500",
      initial: "T",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleMemberSelect = (member) => {
    setSelectedMembers((prev) => {
      const isSelected = prev.find((m) => m.id === member.id);
      if (isSelected) {
        return prev.filter((m) => m.id !== member.id);
      } else {
        return [...prev, member];
      }
    });
  };


const handleSubmit = (e) => {
  if (e) e.preventDefault();
  const { title, description, startDate, endDate, priority, category } =
    formData;

  if (
    !title.trim() ||
    !description.trim() ||
    !startDate ||
    !endDate ||
    !priority ||
    !category
  ) {
    toast.error("Please fill all required fields!");
    return;
  }

  const db = getDatabase();

  const projectRef = push(ref(db, "projects/"));
  const projectId = projectRef.key;

  const projectData = {
    ...formData,
  };

  set(projectRef, projectData)
    .then(() => {
      selectedMembers.forEach((m) => {
        const memberRef = push(ref(db, "members/"));
        set(memberRef, {
          projectId: projectId,
          memberId: m.id,
          memberImage: m.profileImage,
          memberName: m.name,
          memberRole: m.role || ""
        }).then(()=>{
          set(push(ref(db, "notification/")), {
          reciverId: memberRef.key,
          adminId: user?.uid,
          adminName: user?.displayName,
          adminImage: user?.photoURL,
          content: `${user?.displayName} added you in their project`
        });
        })
        
      });
      toast.success("Project Created Successfully");
      onClose();
    })
    .catch((err) => {
      toast.error(err.message);
    });
};


  // if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <Toaster position="top-right" />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Create New Project
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Project Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="Enter project title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
                placeholder="Describe your project goals and requirements"
                required
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>
            </div>
          </div>

          {/* Priority & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Priority
              </label>
              <div className="relative">
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition appearance-none"
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition appearance-none"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Budget & Client */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Budget (Optional)
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="Enter budget amount"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Client (Optional)
              </label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="Enter client name"
              />
            </div>
          </div>

          {/* Team Members */}
          {/* Team Members */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Team Members
            </label>
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {member?.map((mem, index) => (
                  <label
                    key={index}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMembers.some(
                        (m) => m.email === mem.email
                      )}
                      onChange={() => handleMemberSelect(mem)}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                      <img
                        src={mem.profileImage}
                        alt={mem.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {mem.name}
                      </p>
                      <p className="text-xs text-gray-500">{mem.email}</p>
                    </div>
                  </label>
                ))}
              </div>

              {selectedMembers.length > 0 && (
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Selected Members:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedMembers.map((m, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                      >
                        {m.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {/* <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tags
            </label>
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm"
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div> */}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Create Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCreationModal;
