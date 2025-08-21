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

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserRoute><RootLayout /></UserRoute>,
    children: [{
            index: true,
            element: <Home/>,
          },
          {
            path: '/task',
            element: <TaskDetailPage />,
          },
          {
            path: '/projects',
            element: <ProjectProfile />,
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

