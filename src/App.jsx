import React from "react";
import { MoreVertical, Clock, Calendar, User, Plus, Star } from "lucide-react";

const DummyDashboard = () => {
  // Static Dummy Data
  const boards = [
    {
      id: 1,
      title: "To Do",
      color: "bg-gradient-to-br from-sky-50 to-sky-100",
      cards: [
        {
          id: 1,
          title: "Design Homepage",
          description: "Create wireframes and UI design for homepage",
          dueDate: "2025-08-25",
          assignee: "Meheraj",
          priority: "high",
          tags: ["UI", "Design"],
        },
        {
          id: 2,
          title: "API Setup",
          description: "Initialize Express server and connect MongoDB",
          dueDate: "2025-08-28",
          assignee: "Rakib",
          priority: "medium",
          tags: ["Backend", "Database"],
        },
      ],
    },
    {
      id: 2,
      title: "In Progress",
      color: "bg-gradient-to-br from-emerald-50 to-green-100",
      cards: [
        {
          id: 3,
          title: "Shopping Cart Feature",
          description: "Implement add to cart and checkout flow",
          dueDate: "2025-08-22",
          assignee: "Arafat",
          priority: "high",
          tags: ["React", "Ecommerce"],
        },
      ],
    },
    {
      id: 3,
      title: "Done",
      color: "bg-gradient-to-br from-indigo-50 to-violet-100",
      cards: [
        {
          id: 4,
          title: "User Authentication",
          description: "Firebase authentication with email & Google",
          dueDate: "2025-08-18",
          assignee: "Tanvir",
          priority: "low",
          tags: ["Auth", "Firebase"],
        },
      ],
    },
  ];

  // Static Dummy Reviews
  const reviews = [
    {
      id: 1,
      name: "Rahim Uddin",
      role: "Frontend Developer",
      rating: 5,
      comment:
        "This dashboard UI is super clean and easy to use. Love the colors and layout!",
    },
    {
      id: 2,
      name: "Karim Hossain",
      role: "Backend Engineer",
      rating: 4,
      comment:
        "Really helpful for organizing tasks. Would be nice to add drag & drop.",
    },
    {
      id: 3,
      name: "Nusrat Jahan",
      role: "UI/UX Designer",
      rating: 5,
      comment:
        "The design feels professional and minimal. Perfect for project teams!",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">
                Project Dashboard
              </h1>
              <p className="text-slate-600 text-lg">
                Streamline your workflow and boost productivity
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                {boards.reduce((t, b) => t + b.cards.length, 0)} Total Tasks
              </div>
            </div>
          </div>
        </div>

        {/* Boards */}
        <div className="flex gap-6 flex-wrap pb-12">
          {boards.map((board) => (
            <div
              key={board.id}
              className={`flex-shrink-0 w-80 ${board.color} rounded-xl shadow-sm border backdrop-blur-sm`}
            >
              {/* Board Header */}
              <div className="p-6 border-b border-slate-200/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
                    {board.title}
                  </h2>
                  <span className="bg-white/80 text-slate-700 text-sm font-medium px-3 py-1 rounded-full border border-slate-200/50">
                    {board.cards.length}
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div className="p-4 space-y-4 min-h-[300px] max-h-[700px] overflow-y-auto">
                {board.cards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200/50 group relative backdrop-blur-sm"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-slate-800 flex-1 text-lg leading-tight">
                        {card.title}
                      </h3>
                      <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 transition-all p-2 rounded-lg hover:bg-slate-50">
                        <MoreVertical size={16} />
                      </button>
                    </div>

                    <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                      {card.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {card.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="bg-slate-100 text-slate-700 text-xs font-medium px-2 py-1 rounded-full border border-slate-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Priority & Due */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-medium px-2 py-1 rounded-full border bg-blue-50 text-blue-700">
                        {card.priority.toUpperCase()} PRIORITY
                      </span>
                      <span className="text-xs text-red-600 font-medium flex items-center gap-1">
                        <Clock size={12} /> 2d left
                      </span>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm text-slate-500 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span className="font-medium">{card.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span className="font-medium">{card.assignee}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Dummy Add Task */}
                <button className="w-full p-4 bg-white/50 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 flex items-center justify-center gap-2">
                  <Plus size={18} />
                  <span className="font-medium">Add New Task</span>
                </button>
              </div>
            </div>
          ))}

          {/* Dummy Add Board */}
          <button className="flex-shrink-0 w-80 h-40 bg-white/50 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-600">
            <div className="text-center">
              <Plus size={28} className="mx-auto mb-3 text-slate-400" />
              <span className="font-medium text-lg">Add New Board</span>
              <p className="text-sm text-slate-500 mt-1">
                Create a new workflow column
              </p>
            </div>
          </button>
        </div>

        {/* Review Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mt-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">User Reviews</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-800">{review.name}</h3>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < review.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-slate-300"
                        }
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-2">{review.role}</p>
                <p className="text-slate-600 leading-relaxed text-sm">
                  "{review.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DummyDashboard;
