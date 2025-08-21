import React, { useState } from 'react';
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
  Trash2
} from 'lucide-react';

const TaskDetailPage = () => {
  const [newComment, setNewComment] = useState('');
  const [checkedItems, setCheckedItems] = useState({
    1: true,
    2: false,
    3: false,
    4: true
  });

  const teamMembers = [
    { id: 1, name: 'John Smith', avatar: 'bg-blue-500', initial: 'J', role: 'Project Manager' },
    { id: 2, name: 'Sarah Wilson', avatar: 'bg-green-500', initial: 'S', role: 'UI/UX Designer' },
    { id: 3, name: 'Mike Johnson', avatar: 'bg-purple-500', initial: 'M', role: 'Developer' },
  ];

  const comments = [
    {
      id: 1,
      author: 'Sarah Wilson',
      avatar: 'bg-green-500',
      initial: 'S',
      time: '2 hours ago',
      content: 'Great ideas! I think we should focus more on user experience aspects during our brainstorming session.'
    },
    {
      id: 2,
      author: 'John Smith',
      avatar: 'bg-blue-500',
      initial: 'J',
      time: '4 hours ago',
      content: 'I\'ve added some initial thoughts to the document. Let\'s schedule a meeting to discuss these ideas further.'
    },
    {
      id: 3,
      author: 'Mike Johnson',
      avatar: 'bg-purple-500',
      initial: 'M',
      time: '1 day ago',
      content: 'From a technical perspective, we need to consider the feasibility of implementation for each idea.'
    }
  ];

  const subtasks = [
    { id: 1, title: 'Research user pain points', completed: true },
    { id: 2, title: 'Define problem statements', completed: false },
    { id: 3, title: 'Generate solution ideas', completed: false },
    { id: 4, title: 'Prioritize ideas by impact', completed: true },
  ];

  const attachments = [
    { id: 1, name: 'brainstorming-notes.pdf', size: '2.4 MB', type: 'pdf' },
    { id: 2, name: 'user-research-data.xlsx', size: '1.8 MB', type: 'excel' },
    { id: 3, name: 'wireframes-v1.fig', size: '5.2 MB', type: 'figma' },
  ];

  const handleCheckboxChange = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderAvatar = (member) => (
    <div className={`w-8 h-8 rounded-full ${member.avatar} flex items-center justify-center text-white text-xs font-medium`}>
      {member.initial}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Task Details</h1>
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
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600">
                    Low Priority
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-600">
                    To Do
                  </span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <Edit className="h-5 w-5" />
                </button>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-800 mb-3">Brainstorming</h1>
              <p className="text-gray-600 leading-relaxed">
                Brainstorming brings team members' diverse experience into play. This collaborative approach helps us generate innovative solutions and explore different perspectives. We'll focus on creating a safe environment where all ideas are welcome and can be built upon by the team.
              </p>
            </div>

            {/* Subtasks */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Subtasks</h2>
                <button className="text-purple-600 hover:text-purple-700">
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-3">
                {subtasks.map(subtask => (
                  <div key={subtask.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
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
                    <span className={`flex-1 ${checkedItems[subtask.id] ? 'line-through text-gray-500' : 'text-gray-700'}`}>
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
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Comments</h2>
              
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
                {comments.map(comment => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className={`w-8 h-8 rounded-full ${comment.avatar} flex items-center justify-center text-white text-xs font-medium`}>
                      {comment.initial}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-800">{comment.author}</span>
                          <span className="text-xs text-gray-500">{comment.time}</span>
                        </div>
                        <p className="text-gray-700 text-sm">{comment.content}</p>
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
              <h3 className="font-semibold text-gray-800 mb-4">Task Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded text-sm font-medium">To Do</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Priority</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-sm font-medium">Low</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Created</span>
                  <span className="text-gray-800 text-sm">Nov 15, 2024</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Due Date</span>
                  <span className="text-red-600 text-sm">Nov 25, 2024</span>
                </div>
              </div>
            </div>

            {/* Assignees */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Assignees</h3>
                <button className="text-purple-600 hover:text-purple-700">
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-3">
                {teamMembers.map(member => (
                  <div key={member.id} className="flex items-center space-x-3">
                    {renderAvatar(member)}
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role}</p>
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