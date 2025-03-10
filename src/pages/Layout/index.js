// 1. 引入需要的组件和图标
import { Layout, Menu, Popconfirm } from "antd";
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./index.scss";
// 2. 引入路由相关的hook
// - Outlet: 用于在父路由中渲染子路由的组件
// - useNavigate: 用于编程式导航的hook
// - useLocation: 用于获取当前路由信息的hook
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { fetchUserInfo, clearUserInfo } from "@/store/modules/user";
import { useDispatch, useSelector } from "react-redux";

// 3. 从Layout组件中解构出需要的子组件
const { Header, Sider } = Layout;

// 4. 定义菜单项数组
// 每个菜单项包含:
// - label: 显示的文本
// - key: 对应的路由路径，用于导航和高亮匹配
// - icon: 显示的图标组件
const items = [
  {
    label: "首页",
    key: "/",
    icon: <HomeOutlined />,
  },
  {
    label: "文章管理",
    key: "/article",
    icon: <DiffOutlined />,
  },
  {
    label: "创建文章",
    key: "/publish",
    icon: <EditOutlined />,
  },
];

const GeekLayout = () => {
  // 5. 使用useNavigate hook获取导航函数
  const navigate = useNavigate();

  // 6. 定义菜单点击处理函数
  // 当用户点击菜单项时，使用navigate函数导航到对应路由
  // 运行结果: 点击菜单项后浏览器URL会变为对应的路由路径，页面内容也会相应变化
  const menuClick = (route) => {
    navigate(route.key);
  };

  // 7. 菜单高亮实现核心部分
  // 使用useLocation hook获取当前路由信息
  const location = useLocation();
  // 从location对象中获取当前路径pathname
  // 运行结果: 如当前URL为"http://localhost:3000/article"，则selectedKey为"/article"
  const selectedKey = location.pathname;

  const dispatch = useDispatch();
  const name = useSelector((state) => state.user.userInfo.name);
  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);
  // 退出登录
  const loginOut = () => {
    dispatch(clearUserInfo());
    navigate("/login");
  };

  return (
    <Layout>
      {/* 8. 页面顶部Header部分 */}
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{name}</span>
          <span className="user-logout">
            <Popconfirm
              title="是否确认退出？"
              okText="退出"
              cancelText="取消"
              onConfirm={loginOut}
            >
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        {/* 9. 侧边栏Sider部分 */}
        <Sider width={200} className="site-layout-background">
          {/* 10. Menu组件 - 实现菜单高亮的关键 */}
          <Menu
            mode="inline" // 菜单模式: 内嵌模式
            theme="dark" // 主题: 暗色
            selectedKeys={selectedKey} // 当前选中的菜单项key - 通过匹配当前路径实现高亮
            // 运行结果: 当pathname为"/article"时，"文章管理"菜单项会高亮显示
            items={items} // 菜单项配置
            style={{ height: "100%", borderRight: 0 }}
            onClick={menuClick} // 点击处理函数
          />
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          {/* Outlet组件: 用于渲染匹配到的子路由组件 */}
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  );
};
export default GeekLayout;
