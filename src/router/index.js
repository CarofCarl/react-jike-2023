import { createBrowserRouter } from "react-router-dom";

import Login from "@/pages/Login";
import Layout from "@/pages/Layout";
//import Publish from "@/pages/Publish";
//import Article from "@/pages/Article";
//import Home from "@/pages/Home";
import AuthRoute from "@/components/AuthRoute";

import { Suspense, lazy } from "react";
// 1. lazy函数对组件进行导入
const Home = lazy(() => import("@/pages/Home"));
const Article = lazy(() => import("@/pages/Article"));
const Publish = lazy(() => import("@/pages/Publish"));

// 配置路由实例

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthRoute>
        {" "}
        <Layout />
      </AuthRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={"加载中"}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "article",
        element: (
          <Suspense fallback={"加载中"}>
            <Article />
          </Suspense>
        ),
      },
      {
        path: "publish",
        element: (
          <Suspense fallback={"加载中"}>
            <Publish />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
