import { createBrowserRouter } from "react-router-dom";

import Login from "@/pages/Login";
import Layout from "@/pages/Layout";
import Publish from "@/pages/Publish";
import Article from "@/pages/Article";
import Home from "@/pages/Home";
import AuthRoute from "@/components/AuthRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthRoute>
        <Layout />
      </AuthRoute>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "article",
        element: <Article />,
      },
      {
        path: "publish",
        element: <Publish />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
