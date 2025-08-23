import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { Paperclip, Send, Smile, Users } from "lucide-react";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router";

const Conversation = () => {
  const { id } = useParams(); // project id from URL
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Sarah Ahmed",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b332c893?w=40&h=40&fit=crop&crop=face",
      message:
        "Hey team! I've just uploaded the latest design mockups to the project folder.",
      time: "10:30 AM",
      isOwn: false,
    },
    {
      id: 2,
      sender: "You",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      message:
        "Great work Sarah! The designs look fantastic. I especially love the color scheme.",
      time: "10:32 AM",
      isOwn: true,
    },
    {
      id: 3,
      sender: "Mohammad Ali",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      message:
        "I agree! The user flow is much cleaner now. Should I start working on the frontend implementation?",
      time: "10:35 AM",
      isOwn: false,
    },
  ]);
  const [members, setMembers]= useState([])
  const [membersId, setMembersId]= useState([])
  const [currentProject, setCurrentProject]=useState(null)
  const db= getDatabase()
  
  const user = useSelector((state) => state.userInfo.value);

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
      const starCountRef = ref(db, "projects/" +id);
      onValue(starCountRef, (snapshot) => {
          const projects = snapshot.val();
          const projectId = snapshot.key;
          setCurrentProject({...projects, id: projectId});
      });
    }, [db, id]);
  useEffect(() => {
    const messagesRef = ref(db, "messages/");
    onValue(messagesRef, (snapshot) => {
      let arr=[]
      snapshot.forEach((data)=>{
        const message=data.val()
        const messageId= data.key
        if (message.projectId==id) {
          arr.push({...message, id: messageId})
        }
      })
      setMessages(arr)
    });
  }, [db, id]);
  

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Dummy send function
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const newMsg = {
      senderid: user?.uid,
      sendername: user?.displayName,
      avatar:user?.photoURL,
      message: newMessage,
      projectId: id,
      time: moment().format(),
    };
    set(push(ref(db, "messages/")), newMsg)

    setNewMessage("");
  };

  // Dummy project info
  // const currentProject = {
  //   id,
  //   title: `Project ${id}`,
  //   avatar:
  //     "https://images.unsplash.com/photo-1557862921-37829c790f19?w=80&h=80&fit=crop&crop=face",
  //   members: 5,
  //   isOnline: true,
  // };

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            {
              currentProject?.avatar ?             <img
              src={currentProject?.avatar}
              alt={currentProject?.title}
              className="w-10 h-10 rounded-full object-cover"
            /> : <div className="w-10 bg-primary text-white h-10 rounded-full flex justify-center items-center">{currentProject?.title?.charAt(0)?.toUpperCase()}</div>
            }
          </div>
          <div>
            <Link to={`/project/${id}`}>
            <h3 className="font-semibold hover:text-primary text-gray-900">
              {currentProject?.title}
            </h3>
            </Link>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Users className="w-3 h-3" />
              {members?.length} members
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.senderid==user?.uid ? "flex-row-reverse" : ""}`}
          >
            <div className="flex-shrink-0">
              <img
                src={message.avatar}
                alt={message.sender}
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>

            <div
              className={`max-w-xs lg:max-w-md ${
                message.senderid==user?.uid ? "text-right" : ""
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-gray-700">
                  {message.sender}
                </span>
                <span className="text-xs text-gray-500">{moment(message.time).fromNow()}</span>
              </div>

              <div
                className={`rounded-2xl px-4 py-2 ${
                  message.senderid==user?.uid
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
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
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder={`Message Project ${id}...`}
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary pr-12"
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
            disabled={newMessage.trim() === ""}
            className={`p-3 rounded-full transition-all ${
              newMessage.trim() === ""
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-primary text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
