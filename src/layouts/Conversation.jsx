import { Paperclip, Send, Smile, Users } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'

const Conversation = ({projects, selectedProject}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      projectId: 1,
      sender: 'Sarah Ahmed',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c893?w=40&h=40&fit=crop&crop=face',
      message: 'Hey team! I\'ve just uploaded the latest design mockups to the project folder.',
      time: '10:30 AM',
      isOwn: false
    },
    {
      id: 2,
      projectId: 1,
      sender: 'You',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      message: 'Great work Sarah! The designs look fantastic. I especially love the color scheme.',
      time: '10:32 AM',
      isOwn: true
    },
    {
      id: 3,
      projectId: 1,
      sender: 'Mohammad Ali',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      message: 'I agree! The user flow is much cleaner now. Should I start working on the frontend implementation?',
      time: '10:35 AM',
      isOwn: false
    },
    {
      id: 4,
      projectId: 1,
      sender: 'Fatima Khan',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      message: 'Yes, let\'s proceed with the implementation. I\'ll handle the backend API endpoints.',
      time: '10:38 AM',
      isOwn: false
    },
    {
      id: 5,
      projectId: 1,
      sender: 'You',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      message: 'Perfect! I\'ll coordinate the testing phase once you both are done.',
      time: '10:40 AM',
      isOwn: true
    }
  ]);
  
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

  // Auto scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: messages.length + 1,
      projectId: selectedProject,
      sender: 'You',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      message: newMessage,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      isOwn: true
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  // Filter messages for selected project
  const currentMessages = messages.filter(msg => msg.projectId === selectedProject);
  const currentProject = projects.find(p => p.id === selectedProject);
  return (
          <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={currentProject?.avatar}
                  alt={currentProject?.title}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {currentProject?.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{currentProject?.title}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {currentProject?.members} members
                </p>
              </div>
            </div>
            
          </div>
        </div>

        {/* Messages Container */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
          style={{ scrollBehavior: 'smooth' }}
        >
          {currentMessages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.isOwn ? 'flex-row-reverse' : ''}`}
            >
              <div className="flex-shrink-0">
                <img
                  src={message.avatar}
                  alt={message.sender}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
              
              <div className={`max-w-xs lg:max-w-md ${message.isOwn ? 'text-right' : ''}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-700">
                    {message.sender}
                  </span>
                  <span className="text-xs text-gray-500">{message.time}</span>
                </div>
                
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    message.isOwn
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder={`Message ${currentProject?.name}...`}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Smile className="w-5 h-5" />
              </button>
            </div>
            
            <button
              type="button"
              onClick={handleSendMessage}
              disabled={newMessage.trim() === ''}
              className={`p-3 rounded-full transition-all ${
                newMessage.trim() === ''
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
  )
}

export default Conversation