import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import firebaseConfig from "./firebase/firebase.js";
import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "./pages/RootLayout.jsx";
import Registration from "./pages/Registration.jsx";
import Login from "./pages/Login.jsx";
import Sidebar from "./components/sidebar/Sidebar.jsx";
import ProjectProfile from "./pages/ProjectPage.jsx";
import TaskDetailPage from "./pages/TaskDetailPage.jsx";
import Home from "./pages/Home.jsx";
import { store } from "./store/store.js";
import { Provider } from "react-redux";
import UserRoute from "./protectedRoutes/UserRoute.jsx";
import CurrentUserProvider from "./context/CurrentUserProvider.jsx";
import Members from "./pages/Members.jsx";
import DummyDashboard from "./App.jsx";
import AllProjectsPage from "./pages/AllProjectsPage.jsx";
import Messages from "./pages/Messages.jsx";
import Conversation from "./layouts/Conversation.jsx";
import Todos from "./pages/Todos.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <UserRoute><RootLayout /></UserRoute>,
    children: [{
            index: true,
            element: <Home/>,
          },
          {
            path: '/task/:id',
            element: <TaskDetailPage />,
          },
          {
            path: '/project/:id',
            element: <ProjectProfile />,
          },
          {
            path: '/todos',
            element: <Todos />,
          },
          {
            path: '/members',
            element: <Members />,
          },
          {
            path: '/allprojects',
            element: <AllProjectsPage />,
          },
          {
            path: '/messages',
            element: <Messages />,
            children: [{
              path: '/messages/:id',
              element: <Conversation/>
            }]
          },
        ],
      },
  {
    path: "/registration",
    element: <Registration />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <CurrentUserProvider>
        <RouterProvider router={router} />
      </CurrentUserProvider>
    </Provider>
  </StrictMode>
);

