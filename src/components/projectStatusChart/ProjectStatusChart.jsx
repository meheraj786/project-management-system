import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import React from "react";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const ProjectStatusChart = ({ projects, tasks }) => {
  const projectStatusCounts = {
    todo: projects.filter((p) => p.status === "Todo").length,
    inProgress: projects.filter((p) => p.status === "In Progress").length,
    done: projects.filter((p) => p.status === "Done").length,
    onHold: projects.filter((p) => p.status === "On Hold").length,
  };

  const taskStatusCounts = {
    todo: tasks.filter((t) => t.status === "Todo").length,
    inProgress: tasks.filter((t) => t.status === "InProgress").length,
    done: tasks.filter((t) => t.status === "Completed").length,
  };

  const projectData = {
    labels: ["Todo", "In Progress", "Done", "On Hold"],
    datasets: [
      {
        data: [
          projectStatusCounts.todo,
          projectStatusCounts.inProgress,
          projectStatusCounts.done,
          projectStatusCounts.onHold,
        ],
        backgroundColor: ["#9ca3af", "#3b82f6", "#10b981", "#facc15"],
        borderWidth: 1,
      },
    ],
  };

  const taskData = {
    labels: ["Todo", "In Progress", "Completed"],
    datasets: [
      {
        label: "Tasks",
        data: [
          taskStatusCounts.todo,
          taskStatusCounts.inProgress,
          taskStatusCounts.done,
        ],
        backgroundColor: ["#9ca3af", "#3b82f6", "#10b981"],
      },
    ],
  };

return (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Doughnut Chart */}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Project Status</h2>
      <div className="flex items-center justify-center h-80">
        <Doughnut data={projectData} />
      </div>
    </div>

    {/* Bar Chart */}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Task Status</h2>
      <div className="h-80 flex items-center justify-center">
        <Bar data={taskData} />
      </div>
    </div>
  </div>
);
};

export default ProjectStatusChart;
